import { getMeta } from '../../lib/util.js';
/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Grid Cell element
*/
export class GridCell extends HTMLElement {
    constructor() {
        super();
        this.meta = getMeta();
        this.el = {
            display: null,
            text: null,
        };
        this.inputChange = () => {
            if (this.cellScope === 'LOCAL') {
                this.meta.cellData.push(this.cellRef);
                this.cellScope = 'GLOBAL';
            }
            this.cellRef.value = this.el.text.value;
            this.checkEmptyStatus();
        };
        this.onInputFocus = () => {
            this.meta.activeFocus = {
                column_unique_id: this._COLUMN.column_unique_id,
                row_unique_id: this._ROW.row_unique_id,
            };
        };
        this.check = () => {
            if (this.isConnected && this._COLUMN && this._ROW) {
                this.ready();
            }
        };
    }
    connectedCallback() {
        this.check();
    }
    ready() {
        this.innerHTML = /* html */ `
			<span  class="cell-display"  data-cell-el="cell-display"></span>
			<input  class="cell-textbox"    data-cell-el="cell-textbox">
		`;
        this.el.display = this.querySelector('[data-cell-el="cell-display"]');
        this.el.text = this.querySelector('[data-cell-el="cell-textbox"]');
        this.el.text.addEventListener('input', this.inputChange);
        this.el.text.addEventListener('focus', this.onInputFocus);
        this.updateReference();
        this.render();
        this.checkEmptyStatus();
        if (this.meta.activeFocus) {
            if (this._COLUMN.column_unique_id === this.meta.activeFocus.column_unique_id &&
                this._ROW.row_unique_id === this.meta.activeFocus.row_unique_id) {
                this.el.text.focus();
            }
        }
    }
    updateReference() {
        this.cellRef = this.meta.cellData.find(x => x.column_unique_id === this._COLUMN.column_unique_id && x.row_unique_id === this._ROW.row_unique_id);
        if (!this.cellRef) {
            this.cellRef = {
                column_unique_id: this._COLUMN.column_unique_id,
                row_unique_id: this._ROW.row_unique_id,
                value: '',
            };
            this.cellScope = 'LOCAL';
        }
        else {
            this.cellScope = 'GLOBAL';
        }
    }
    render() {
        if (this._COLUMN.isReadOnly) {
            this.el.text.style.display = 'none';
            this.el.display.innerText = this.cellRef.value;
            this.classList.add('disabled');
        }
        else {
            this.el.display.style.display = 'none';
            this.el.text.value = this.cellRef.value;
        }
    }
    checkEmptyStatus() {
        if (this._COLUMN.showEmpty) {
            if (this.cellRef.value === '') {
                this.classList.add('empty');
            }
            else {
                this.classList.remove('empty');
            }
        }
    }
    disconnectedCallback() {
        this.el.text.removeEventListener('input', this.inputChange);
    }
    attributeChangedCallback(attrName, oldVal, newVal) { }
    adoptedCallback() { }
    set cellData(_cellData) {
        this._CELLPACK = _cellData;
        this._COLUMN = this._CELLPACK.column;
        this._ROW = this._CELLPACK.row;
        this.check();
    }
}
customElements.define('grid-cell-el', GridCell);
//# sourceMappingURL=grid-cell.el.js.map