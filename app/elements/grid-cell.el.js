export class GridCell extends HTMLElement {
	/**
	@author: Sajan Paul,
	@date: 27- 09- 2019,
	@description : Description
	*/

	CELL_DATA = null;
	elementState = {
		data: false,
		connected: false,
		check: () => { data && connected && this.render() }
	};
	constructor() {
		/**
		* @description An instance of the element is created or upgraded. Useful for initializing state,
		  setting up event listeners, or creating a shadow dom.
		  See the spec for restrictions on what you can do in the constructor.
		*/
		super();
		let shadowRoot = this.attachShadow({ mode: "open" });
		shadowRoot.innerHTML =/* html */`
		<div  id="codeDisplay">uu</div>
		`
		this.codeDisplay = this.shadowRoot.getElementById("codeDisplay");
		this.codeDisplay.contentEditable = true;
		this.addEventListener('touchmove', this.touchmove);
		this.addEventListener('touchstart', this.touchstart);
		this.addEventListener('touchend', this.touchend);


	}
	connectedCallback() {

	}
	touchmove = (e) => {
		e.preventDefault();
	}
	touchstart = (e) => {
		// e.stopPropagation();

	}
	touchend = (e) => {
		e.preventDefault();

	}

	disconnectedCallback() {

	}

	attributeChangedCallback(attrName, oldVal, newVal) {

	}

	adoptedCallback() {

	}

	set cellData(_cldata) {
		this.CELL_DATA = _cldata;
		this.render();

	}
	get cellData() {
		return this.CELL_DATA
	}
	render() {
		this.codeDisplay.innerText = this.CELL_DATA.uniqueId;
	}



}
customElements.define('grid-cell-el', GridCell);
