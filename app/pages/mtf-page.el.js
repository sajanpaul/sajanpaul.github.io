export class MtfPageEl extends HTMLElement {
    constructor() {
        super();
        this.el = {
            mtfEl: null,
            textArea: null,
            errorLog: null,
        };
    }
    connectedCallback() {
        const parsedData = {
            premiseList: [
                { id: 1, text: 'Kerala' },
                { id: 2, text: 'Telangana' },
                { id: 3, text: 'Karnataka' },
                { id: 4, text: 'Uttarakhand' },
                { id: 5, text: 'Punjab' },
            ],
            responseList: [
                { id: 1, text: 'Thiruvananthapuram' },
                { id: 2, text: 'Hyderabad' },
                { id: 3, text: 'Bengaluru' },
                { id: 4, text: 'Dehradun' },
                { id: 5, text: 'Chandigarh' },
            ],
        };
        const template = /* html */ `
		<div class="flex-child mtf-wrapper">
			<mtf-el data-element="mtf-el"></mtf-el>
		</div>
		<div class="flex-child json-box">
			<textarea>	</textarea>
		</div>
		<div class="flex-child error-logger"></div>
	`;
        this.innerHTML = template;
        this.classList.add('grid-parent');
        this.el.mtfEl = document.querySelector('[data-element="mtf-el"]');
        this.el.mtfEl.mtfData = parsedData;
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
    set mtfData(_data) {
    }
}
customElements.define('mtf-page-el', MtfPageEl);
//# sourceMappingURL=mtf-page.el.js.map