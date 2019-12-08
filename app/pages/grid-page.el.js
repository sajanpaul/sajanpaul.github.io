import { setMeta, gridRender, updateFixedAndScrollColumns, updateVisibleColumns, updateColumnOrder, getMeta } from '../../lib/util.js';
/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Grid Page
*/
export class GridPage extends HTMLElement {
    constructor() {
        super();
        this.onActionButtonClick = (event) => {
            let elName = event.target.dataset.element;
            let meta = getMeta();
            if (elName === 'show-few') {
                meta.scrollColumns.forEach((cl, index) => cl.isVisible = (index > 990));
            }
            else if (elName === 'show-rand') {
                meta.scrollColumns.forEach((cl, index) => cl.isVisible = (Math.round(Math.random() * 1000) % 2 === 0));
            }
            else if (elName === 'show-all') {
                meta.scrollColumns.forEach((cl, index) => cl.isVisible = true);
            }
            updateVisibleColumns();
            updateColumnOrder();
            gridRender();
        };
    }
    connectedCallback() {
        let columns = [];
        let rows = [];
        for (var index = 0; index < 1000; index++) {
            columns.push({
                col_index: index,
                column_unique_id: ('col-' + index),
                isFixedInfoColumn: false,
                order: index,
                isVisible: true,
                column_name: ((Math.round(Math.random() * 100000).toString(36)).toUpperCase() + '-' + (index + 1)),
                width: 200,
                isReadOnly: false,
                showEmpty: false,
            });
        }
        for (var index = 0; index < 10000; index++) {
            rows.push({
                row_index: index,
                row_unique_id: ('row-' + index),
                height: 30
            });
        }
        setMeta({
            columns: columns,
            rows: rows,
            fixedColumns: [],
            scrollColumns: [],
            visibleColumns: [],
            cellData: [],
            activeFocus: null,
        });
        this.innerHTML = /* html */ `
		<div class="grid-page-wrapper">
			<div class="menu-panel">
				<div class='button-group'>
				Hot key to change column visibility ->
					<button data-element="show-few" >
						Show Few Columns
					</button>
					<button data-element="show-rand" >
						Show Random Columns
					</button>
					<button data-element="show-all" >
						Show All Columns
					</button>
				</div>
				<div>
					<column-sort-panel class="menu-item"></column-sort-panel>
					<visibility-panel  class="menu-item"></visibility-panel>
				<div>
			</div>
			<grid-view-el> </grid-view-el>
			<config-popup-panel></config-popup-panel>
		</div>
		`;
        updateFixedAndScrollColumns();
        updateVisibleColumns();
        updateColumnOrder();
        gridRender();
        this.querySelectorAll('[data-element="show-few"],[data-element="show-rand"],[data-element="show-all"]').forEach(el => el.addEventListener('click', this.onActionButtonClick));
    }
    disconnectedCallback() {
        this.querySelectorAll('[data-element="show-few"],[data-element="show-rand"],[data-element="show-all"]').forEach(el => el.removeEventListener('click', this.onActionButtonClick));
    }
    attributeChangedCallback(attrName, oldVal, newVal) { }
    adoptedCallback() { }
}
customElements.define('grid-page-el', GridPage);
//# sourceMappingURL=grid-page.el.js.map