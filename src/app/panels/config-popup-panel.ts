import { IGridColumn, IDataReference } from './../../../types/grid.d';
import { updateFixedAndScrollColumns, updateVisibleColumns, updateColumnOrder, gridRender, setColumnConfigReference, getMeta } from '../../lib/util.js';
/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Popup panel for configurations
*/

declare type ERROR_CODE = 'INVALID_VALUE' | 'OUT_RANGE';
export class ConfigPopupPanel extends HTMLElement {


	private widthRange = {
		min: 150,
		max: 600
	}

	private settings = {
		readOnly: false,
		showEmptyCells: false,
		isFixed: false,
		columnWidth: 0,
	}
	private isColumnWidthDirty = false;
	private columnWidthErrorCode: ERROR_CODE = null;

	private meta:IDataReference;



	private _COLUMN: IGridColumn;

	private el = {
		closeButton: <HTMLElement>null,
		title: <HTMLElement>null,
		columnWidth: <HTMLInputElement>null,
		columnWidthController: <HTMLInputElement>null,
		columnWidthError: <HTMLInputElement>null,
		readOnlySwitch: <HTMLInputElement>null,
		showEmptySwitch: <HTMLInputElement>null,
		fixedSwitch: <HTMLInputElement>null,
		fixedSwitchLabel: <HTMLElement>null,
		reset: <HTMLElement>null,
		apply: <HTMLElement>null,
	}

	constructor() {
		super();
	}
	connectedCallback() {
		setColumnConfigReference(this);
	}

	disconnectedCallback() {
		setColumnConfigReference(null);
		if(this.el.columnWidth){
			this.el.columnWidth.removeEventListener('input', this.columnWidthInputChange);
			this.el.columnWidth.removeEventListener('focus', this.columnWidthFocus);
		}
		if(this.el.readOnlySwitch){
			this.el.readOnlySwitch.removeEventListener('change', this.readOnlySwitch_change);
		}
		if(this.el.showEmptySwitch){
			this.el.showEmptySwitch.removeEventListener('change', this.showEmptySwitch_change);
		}
		if(this.el.fixedSwitch){
			this.el.fixedSwitch.removeEventListener('change', this.fixedSwitch_change);
		}
		if(this.el.closeButton){
			this.el.closeButton.removeEventListener('click', this.closeButtonClick);
		}	
		if(this.el.reset){
			this.el.reset.removeEventListener('click', this.resetClick);
		}	
		if(this.el.apply){
			this.el.apply.removeEventListener('click', this.applyClick);
		}	

	}




	panelInit() {
		this.settings.readOnly = this._COLUMN.isReadOnly;
		this.settings.showEmptyCells = this._COLUMN.showEmpty;
		this.settings.isFixed = this._COLUMN.isFixedInfoColumn;
		this.settings.columnWidth = this._COLUMN.width;
		this.meta = getMeta();


		this.isColumnWidthDirty = false;
		this.columnWidthErrorCode = null;
	}



	render() {


		if(this.settings.isFixed ){
			this.el.columnWidth.disabled = true;
			this.settings.columnWidth = 200;
			this.el.columnWidth.title ='Width can\'t be changed in fixed mode' ;
		}else{
			this.el.columnWidth.disabled = false;
			this.el.columnWidth.title ='';
		}

		if(this.meta.fixedColumns.length >= 3 && !this._COLUMN.isFixedInfoColumn){
			this.el.fixedSwitch.disabled = true;
			this.el.fixedSwitchLabel.classList.add('disabled-label')
			this.el.fixedSwitchLabel.title ='Maximum Pin limit (3 Columns) reached' ;
		}else{
			this.el.fixedSwitch.disabled = false;
			this.el.fixedSwitchLabel.title ='';
			this.el.fixedSwitchLabel.classList.remove('disabled-label')
		}

		this.el.title.innerText = this._COLUMN.column_name;
		this.el.showEmptySwitch.checked = this.settings.showEmptyCells;
		this.el.fixedSwitch.checked = this.settings.isFixed;
		this.el.readOnlySwitch.checked = this.settings.readOnly;
		this.el.columnWidth.value = (this.settings.columnWidth + '');
	}


	renderTemplate() {


		this.innerHTML =	/* html */`
				<div class="custom-popup">
					<div class="popup-contant-outer">
						<div class="popup-content">
							<div class="popup-body column-selection">
								<button type="button" class="close-btn"  data-element="close-button">
									<span aria-hidden="true">×</span>
								</button>
								<h5 class="popup-title" >
									<span data-element="popup-title"></span>
								</h5>
								<div class="listing height"  data-element="width-form-control">
									<label>Column WIdth</label>
									<input min="${this.widthRange.min}" max="${this.widthRange.max}" data-element="column-width" type="number">
									<span class="error-msg" data-element="width-form-error"> Enter Correct value</span>
								</div>
								<div class="listing ">
									<label  class="check-box-container"  data-element="fixed-switch-label">
										<input  type="checkbox" data-element="fixed-switch"  ${this._COLUMN.isFixedInfoColumn ? 'checked="checked"' : ''}>
										<span class="checkmark"></span>
										<span class="checklabel">Pin column to right</span>
									</label>
								</div>
								<div class="listing ">
									<label  class="check-box-container">
										<input  type="checkbox" data-element="readonly-switch"  ${this._COLUMN.isReadOnly ? 'checked="checked"' : ''}>
										<span class="checkmark"></span>
										<span class="checklabel">Make cells readonly</span>
									</label>
								</div>
								<div class="listing ">
									<label  class="check-box-container">
										<input  type="checkbox" data-element="emptycell-switch"  ${this._COLUMN.showEmpty ? 'checked="checked"' : ''}>
										<span class="checkmark"></span>
										<span class="checklabel">Highlight empty cells</span>
									</label>
								</div>
							</div>
							<div class="popup-footer">
								<button  data-element="reset" class="btn btn-default">Reset</button>
								<button  data-element="apply" class="btn btn-primary">Apply</button>
							</div>
						</div>
					</div>
				</div>
			`;

		this.el.closeButton = this.querySelector('[data-element="close-button"]');
		this.el.title = this.querySelector('[data-element="popup-title"]');

		this.el.columnWidth = this.querySelector('[data-element="column-width"]');
		this.el.columnWidthController = this.querySelector('[data-element="width-form-control"]');
		this.el.columnWidthError = this.querySelector('[data-element="width-form-error"]');


		this.el.readOnlySwitch = this.querySelector('[data-element="readonly-switch"]');
		this.el.showEmptySwitch = this.querySelector('[data-element="emptycell-switch"]');
		this.el.fixedSwitch = this.querySelector('[data-element="fixed-switch"]');

		this.el.fixedSwitchLabel = this.querySelector('[data-element="fixed-switch-label"]');

		this.el.reset = this.querySelector('[data-element="reset" ]');
		this.el.apply = this.querySelector('[data-element="apply"]');


		this.el.columnWidth.addEventListener('input', this.columnWidthInputChange);
		this.el.columnWidth.addEventListener('focus', this.columnWidthFocus);

		this.el.readOnlySwitch.addEventListener('change', this.readOnlySwitch_change);
		this.el.showEmptySwitch.addEventListener('change', this.showEmptySwitch_change);
		this.el.fixedSwitch.addEventListener('change', this.fixedSwitch_change);

		this.el.closeButton.addEventListener('click', this.closeButtonClick);
		this.el.reset.addEventListener('click', this.resetClick);
		this.el.apply.addEventListener('click', this.applyClick);
	}



	applyClick = (event: MouseEvent) => {
		this.isColumnWidthDirty = true;
		this.columnWidthErrorCode = this.hasWidthError(this.settings.columnWidth + '');
		this.renderErrors();
		if (!this.columnWidthErrorCode) {
			this._COLUMN.width = this.settings.columnWidth;
			this._COLUMN.isReadOnly = this.settings.readOnly;
			this._COLUMN.showEmpty = this.settings.showEmptyCells;
			this._COLUMN.isFixedInfoColumn = this.settings.isFixed;
			updateFixedAndScrollColumns();
			updateVisibleColumns();
			updateColumnOrder();
			gridRender();
			this.close_popup();
		}
	}


	openPopup() {
		this.renderTemplate();
		this.panelInit();
		this.render();
		this.classList.remove('hide');
	}


	close_popup() {
		this._COLUMN = null;
		this.classList.add('hide');
	}




	hasWidthError(value: string): ERROR_CODE | null {
		let intVal = parseInt(value);
		if (!intVal && intVal !== 0) {
			return 'INVALID_VALUE';
		} else if (intVal > this.widthRange.max || intVal < this.widthRange.min) {
			return 'OUT_RANGE';
		} else {
			return null;
		}
	}


	resetClick = (event: MouseEvent) => {
		this.panelInit();
		this.render();
	}
	closeButtonClick = (event: MouseEvent) => {
		this.close_popup();
	}

	columnWidthInputChange = (event: InputEvent) => {
		let val = this.el.columnWidth.value;
		val = val.replace(/[^0-9]/gmi, '');
		this.el.columnWidth.value = val;
		this.settings.columnWidth = parseInt(val, 10);
		this.columnWidthErrorCode = this.hasWidthError(val);
		this.renderErrors();
	}


	renderErrors() {
		if (this.isColumnWidthDirty) {
			if (this.columnWidthErrorCode === 'INVALID_VALUE') {
				this.el.columnWidthError.innerText = 'Please enter a valid width value.';
				this.el.columnWidthController.classList.add('error-wrap')
			} else if (this.columnWidthErrorCode === 'OUT_RANGE') {
				this.el.columnWidthError.innerText = `The width value should be within ${this.widthRange.min} and  ${this.widthRange.max}.`;
				this.el.columnWidthController.classList.add('error-wrap')
			} else {
				this.el.columnWidthController.classList.remove('error-wrap')
			}
		}
	}

	columnWidthFocus = (event: FocusEvent) => {
		this.isColumnWidthDirty = true;
	}


	readOnlySwitch_change = (event: InputEvent) => {
		this.settings.readOnly = this.el.readOnlySwitch.checked;
	}
	showEmptySwitch_change = (event: InputEvent) => {
		this.settings.showEmptyCells = this.el.showEmptySwitch.checked;
	}
	fixedSwitch_change = (event: InputEvent) => {
		this.settings.isFixed = this.el.fixedSwitch.checked;
		if(this.settings.isFixed ){
			this.el.columnWidth.disabled = true;
			this.el.columnWidth.value= '200';
			this.settings.columnWidth = 200;
			this.el.columnWidth.title ='Width can\'t be changed in fixed mode' ;
		}else{
			this.el.columnWidth.disabled = false;
			this.el.columnWidth.title ='' ;
		}
	}

	set column(cl: IGridColumn) {
		if (cl) {
			this._COLUMN = cl;
			this.openPopup()
		} else {
			this.close_popup();
		}
	}
	get column(): IGridColumn {
		return this._COLUMN;
	}


	attributeChangedCallback(attrName: string, oldVal: string, newVal: string) { }

	adoptedCallback() { }

}
customElements.define('config-popup-panel', ConfigPopupPanel);
