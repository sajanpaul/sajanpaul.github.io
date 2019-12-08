export class NotFoundPage extends HTMLElement {
    /**
    @author: Sajan Paul,
    @since:  2019-12-07,
    @description : Not Found Page
    */
    constructor() {
        super();
        let template = document.createElement('template');
        template.innerHTML = /* html */ `
		<p> Page Not Found  <a href="#home"> Take me to home</a> </p>
		
		`;
        let shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback(attrName, oldVal, newVal) { }
    adoptedCallback() { }
}
customElements.define('not-found-page-el', NotFoundPage);
//# sourceMappingURL=not-found-page.el.js.map