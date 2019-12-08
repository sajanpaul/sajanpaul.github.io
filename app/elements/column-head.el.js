import { getColumnConfigReference } from '../../lib/util.js';
/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Colum head element for Grid
*/
export class ColumnHead extends HTMLElement {
    constructor() {
        super();
        this.isFixedColumn = false;
        this.isOnlyColumn = false;
        this.el = {
            setting: null,
            title: null,
        };
        this.settingPanel = getColumnConfigReference();
        this.setting_click = (event) => {
            if (this.settingPanel) {
                this.settingPanel.column = this._COLUMN;
            }
        };
    }
    ;
    connectedCallback() {
        this.innerHTML = /* html */ `
			<span class="title" data-col-el="title"></span>
			<span class="setting-heading-icon" title="Column Options" data-col-el="setting"></span>
		`;
        this.el.title = this.querySelector('[data-col-el="title"]');
        this.el.setting = this.querySelector('[data-col-el="setting"]');
        this.el.setting.addEventListener('click', this.setting_click);
        this.isConnected && this.ready();
    }
    disconnectedCallback() {
        this.el.setting.removeEventListener('click', this.setting_click);
    }
    ready() {
        this.el.title.title = this._COLUMN.column_name;
        this.el.title.innerText = this._COLUMN.column_name;
        if (this._COLUMN.isFixedInfoColumn) {
            this.classList.add('fixed-col-head');
        }
        else {
            this.classList.remove('fixed-col-head');
        }
    }
    attributeChangedCallback(attrName, oldVal, newVal) { }
    adoptedCallback() { }
    set head(_COLUMN) {
        this._COLUMN = _COLUMN;
        this.isConnected && this.ready();
    }
}
customElements.define('column-head', ColumnHead);
//# sourceMappingURL=column-head.el.js.map