import { getMeta, updateVisibleColumns, updateColumnOrder, gridRender } from "../../lib/util.js";
/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Popover panel for handling visibility
*/
export class visibilityPanel extends HTMLElement {
    constructor() {
        super();
        this.ColumnMap = {};
        this.searchPhase = '';
        this.el = {
            cancel: null,
            apply: null,
            panel: null,
            searchBox: null,
            toggle: null,
            listContainer: null,
        };
        this.searchTextChange = (event) => {
            this.searchPhase = this.el.searchBox.value.trim().toUpperCase();
            this.renderUpdate();
        };
        this.checkChange = (event) => {
            this.ColumnMap[event.target.dataset.visibilityColumn || ''].status = event.target.checked;
        };
        this.applyClick = (event) => {
            for (var idKey in this.ColumnMap) {
                this.ColumnMap[idKey].column.isVisible = this.ColumnMap[idKey].status;
            }
            updateVisibleColumns();
            updateColumnOrder();
            gridRender();
            this.closePanel();
            this.panelInit();
        };
        this.cancelClick = (event) => {
            this.closePanel();
        };
        this.menuToggler = (event) => {
            event.preventDefault();
            if (this.el.panel.classList.contains('hide')) {
                this.openPanel();
            }
            else {
                this.closePanel();
            }
        };
        this.outSideClickHandler = (event) => {
            if (!(event.target === this || event.target.closest(this.nodeName))) {
                this.closePanel();
            }
        };
    }
    connectedCallback() {
        this.innerHTML = /* html */ `
			<button data-element="toggle"  class="btn btn-primary">
				<span class="text">Columns Visibility</span>
			</button>
			<div class="freeze-column-popup hide"  data-element="panel">
				<div class="popup-body column-selection">
					<h5 class="popup-title">Columns Visibility</h5>
					<div class="search-wrap for-dropdown">
						<input type="text" data-element="search-box" placeholder="Enter search text here…">
					</div>
					<ul class="top-space" data-element="list-container"></ul>
				</div>
				<div class="popup-footer">
				<button class="btn btn-default" data-element="cancel">Cancel</button>
				<button class="btn btn-primary" data-element="apply">Apply</button>
				</div>
			</div>
		`;
        this.el.cancel = this.querySelector('[data-element="cancel"]');
        this.el.apply = this.querySelector('[data-element="apply"]');
        this.el.searchBox = this.querySelector('[data-element="search-box"]');
        this.el.listContainer = this.querySelector('[data-element="list-container"]');
        this.el.panel = this.querySelector('[data-element="panel"]');
        this.el.toggle = this.querySelector('[data-element="toggle"]');
        this.el.searchBox.addEventListener('input', this.searchTextChange);
        this.el.toggle.addEventListener('click', this.menuToggler);
        this.el.cancel.addEventListener('click', this.cancelClick);
        this.el.apply.addEventListener('click', this.applyClick);
        this.panelInit();
    }
    disconnectedCallback() {
        this.dynamicContentListener('unbind');
        document.removeEventListener('mousedown', this.outSideClickHandler);
        this.el.searchBox.removeEventListener('input', this.searchTextChange);
        this.el.toggle.removeEventListener('click', this.menuToggler);
        this.el.cancel.removeEventListener('click', this.cancelClick);
        this.el.apply.removeEventListener('click', this.applyClick);
    }
    panelInit() {
        this.ColumnMap = {};
        this.el.searchBox.value = '';
        this.searchPhase = '';
        this.meta = getMeta();
        ;
        for (let idx = 0, len = this.meta.scrollColumns.length; idx < len; idx++) {
            this.ColumnMap[this.meta.scrollColumns[idx].column_unique_id] = {
                status: this.meta.scrollColumns[idx].isVisible,
                column: this.meta.scrollColumns[idx]
            };
        }
        this.renderUpdate();
    }
    renderUpdate() {
        if (this.el.listContainer) {
            this.dynamicContentListener('unbind');
            let searchedResult = [];
            if (this.searchPhase) {
                searchedResult = this.meta.scrollColumns.filter((col) => {
                    return col.column_name.toUpperCase().includes(this.searchPhase);
                });
            }
            else {
                searchedResult = this.meta.scrollColumns;
            }
            if (searchedResult.length > 0) {
                this.el.listContainer.innerHTML = searchedResult.map((col) => {
                    return ( /* html */`
								<li class="custom-radio">
									<label title="${col.column_name}" class="check-box-container">
										<input  type="checkbox" data-visibility-column="${col.column_unique_id}"  ${this.ColumnMap[col.column_unique_id].status ? 'checked="checked"' : ''}>
										<span class="checkmark"></span>
										<span class="checklabel">${col.column_name}</span>
									</label>
								</li>
							`);
                }).join('');
            }
            else {
                this.el.listContainer.innerHTML = /* html */ `
				<li class="custom-radio">
					<label  class="check-box-container">
						NO RESULT FOUND!
					</label>
				</li>
				`;
            }
            this.dynamicContentListener('bind');
        }
        else {
            console.error('Visibility Panel Render Error: Not Found - List Container');
        }
    }
    dynamicContentListener(action) {
        if (action === 'bind') {
            this.querySelectorAll('[data-visibility-column]')
                .forEach((checkEl) => checkEl.addEventListener('change', this.checkChange));
        }
        else if (action === 'unbind') {
            this.querySelectorAll('[data-visibility-column]')
                .forEach((checkEl) => checkEl.removeEventListener('change', this.checkChange));
        }
    }
    closePanel() {
        document.removeEventListener('mousedown', this.outSideClickHandler);
        this.el.panel.classList.add('hide');
    }
    openPanel() {
        this.panelInit();
        document.addEventListener('mousedown', this.outSideClickHandler);
        this.el.panel.classList.remove('hide');
    }
    attributeChangedCallback(attrName, oldVal, newVal) { }
    adoptedCallback() { }
}
customElements.define('visibility-panel', visibilityPanel);
//# sourceMappingURL=visibility-panel.js.map