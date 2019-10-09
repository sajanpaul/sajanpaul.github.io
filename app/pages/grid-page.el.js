export class GridPage extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = /* html */ `
				<div class="grid-page-wrapper">
					<grid-view-el> </grid-view-el>
				</div>
				`;
    }
    disconnectedCallback() { }
    attributeChangedCallback(attrName, oldVal, newVal) { }
    adoptedCallback() { }
}
customElements.define('grid-page-el', GridPage);
//# sourceMappingURL=grid-page.el.js.map