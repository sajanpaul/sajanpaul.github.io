export class MtfPageEl extends HTMLElement {
    constructor() {
        super();
        this.el = {
            mtfEl: null,
            textArea: null,
            errorLog: null,
            errorList: null,
        };
        this._parsedData = null;
        this.actionHandler = (event) => {
            let key = event.target.dataset.clickAction;
            switch (key) {
                case 'apply':
                    this.apply();
                    break;
                case 'reset':
                    this.reset();
                    break;
                case 'check':
                    this.el.mtfEl.check();
                    break;
                case 'copy':
                    this.el.textArea.select();
                    document.execCommand('copy', null, null);
                    this.el.textArea.setSelectionRange(0, 0);
                    break;
                case 'clear':
                    this.el.errorList.innerHTML = '';
                    break;
            }
        };
    }
    connectedCallback() {
        const template = /* html */ `
		<div class="flex-child mtf-wrapper">
			<mtf-el data-element="mtf-el"></mtf-el>
		</div>
		<div class="flex-child json-box">
			<textarea class="json-text-area">	</textarea>
		</div>
		<div class="flex-child error-logger">
			<div class="btn-panel">
				<button title="Apply JSON to MTF Element" data-click-action="apply">Apply</button>
				<button title="Reset to  hardcoded JSON" data-click-action="reset"> Reset</button>
				<button title="Check Answer" data-click-action="check">Check</button>
				<button title="Copy JSON" data-click-action="copy">Copy</button>
				<button  title="Clear Error List" data-click-action="clear">Clear</button>
			</div>
			
			<details open>
				<summary>Catch Errors</summary>
				<div class="error-list">

				</div>
			</details>
		</div>
	`;
        this.innerHTML = template;
        this.classList.add('grid-parent');
        this.el.mtfEl = this.querySelector('[data-element="mtf-el"]');
        this.el.textArea = this.querySelector('.json-text-area');
        this.el.errorList = this.querySelector('.error-list');
        this.querySelectorAll('[data-click-action]')
            .forEach(x => x.addEventListener('click', this.actionHandler));
        this.reset();
    }
    reset() {
        this._parsedData = {
            premiseList: [
                { id: 1, text: 'Kerala' },
                { id: 2, text: 'Telangana' },
                { id: 3, text: 'Karnataka' },
                { id: 4, text: 'Uttarakhand' },
                { id: 5, text: 'Punjab' },
                { id: 6, text: 'Bihar' },
            ],
            responseList: [
                { id: 1, text: 'Thiruvananthapuram' },
                { id: 2, text: 'Hyderabad' },
                { id: 3, text: 'Bengaluru' },
                { id: 4, text: 'Dehradun' },
                { id: 5, text: 'Chandigarh' },
                { id: 6, text: 'Patna' },
            ],
        };
        this.el.textArea.value = JSON.stringify(this._parsedData, null, 2);
        this.el.mtfEl.mtfData = this._parsedData;
    }
    apply() {
        try {
            this._parsedData = JSON.parse(this.el.textArea.value);
            let jsonNewString = JSON.stringify(this._parsedData, null, 2);
            this.el.textArea.value = jsonNewString;
            this.el.mtfEl.mtfData = JSON.parse(jsonNewString);
            this.el.errorList.innerText = '';
        }
        catch (e) {
            this.el.errorList.innerText = e.toString();
        }
    }
    disconnectedCallback() {
        this.querySelectorAll('[data-click-action]')
            .forEach(x => x.removeEventListener('click', this.actionHandler));
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
customElements.define('mtf-page-el', MtfPageEl);
//# sourceMappingURL=mtf-page.el.js.map