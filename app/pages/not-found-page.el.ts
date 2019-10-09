export class NotFoundPage extends HTMLElement {
	constructor() {
		super();

		let tmpl = document.createElement('template');
		tmpl.innerHTML = /* html */`
		<div> Not found  Page </div>
		`;
		let shadowRoot = this.attachShadow({ mode: "closed" });
		shadowRoot.appendChild(tmpl.content.cloneNode(true));

	}

	connectedCallback() {}

	disconnectedCallback() {}

	attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {}

	adoptedCallback() {}

}

customElements.define('not-found-page-el', NotFoundPage);
