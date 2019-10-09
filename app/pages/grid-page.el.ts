
export class GridPage extends HTMLElement {

	constructor() {
		super();
	}


	connectedCallback() {
		this.innerHTML =  /* html */`
				<div class="grid-page-wrapper">
					<grid-view-el> </grid-view-el>
				</div>
				`;

	}

	disconnectedCallback() {}

	attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {}

	adoptedCallback() {}

}


customElements.define('grid-page-el', GridPage);
