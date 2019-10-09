export class HomePage extends HTMLElement {
    /**
    @author: Sajan Paul,
    @date: 20- 09- 2019,
    @description : Description
    */
    constructor() {
        super();
        /**
        * @description An instance of the element is created or upgraded. Useful for initializing state,
          setting up event listeners, or creating a shadow dom.
          See the spec for restrictions on what you can do in the constructor.
        */
    }
    connectedCallback() {
        this.innerHTML = /*html*/ `
		<div class="card-container" data-element="card-holder-page">
		<div class="menu-area">
		
		</div>
		<div class="greeting-buble">
			<div class="bubble-title">
				<h1 class="bubble-title">Hey</h1>
				<p class="bubble-text"> Goodmorning, How are you? This is just a demo card.
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptate deleniti!. </p>
			</div>
		</div>
		</div>
		`;
        /**
        * @description Called every time the element is inserted into the DOM. Useful for running setup code,
          such as fetching resources or rendering. Generally, you should try to delay work until this time.
        */
    }
    disconnectedCallback() {
        /**
        * @description Called every time the element is removed from the DOM. Useful for running clean up code.
        */
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        /**
        * @description Called when an observed attribute has been added, removed, updated, or replaced.
          Also called for initial values when an element is created by the parser, or upgraded.
          Note: only attributes listed in the observedAttributes property will receive this callback.
        */
    }
    adoptedCallback() {
        /**
        * @description The custom element has been moved into a new document
        (e.g. someone called document.adoptNode(el)).
        */
    }
}
customElements.define('home-page-el', HomePage);
//# sourceMappingURL=home-page.el.js.map