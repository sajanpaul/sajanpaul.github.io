
export class HomePage extends HTMLElement {


	constructor() {
		super();
		/**
		* @description An instance of the element is created or upgraded. Useful for initializing state,
		  setting up event listeners, or creating a shadow dom.
		  See the spec for restrictions on what you can do in the constructor.
		*/
	
	}

	connectedCallback() {
		this.innerHTML = /*html*/`
		<div class="card-container" data-element="card-holder-page">
		<div class="menu-area">
			<ol>
			<li>
				<a href="#mtf"> Match the following</a>
				<div><samp>MouseOnly</samp>  <samp>NoAutoScroll</samp> <samp>Completed</samp></div>
			</li>
			<li>
				<a href="#grid"  disabled="disabled">SpreadSheet</a>
				<div><samp>MouseOnly</samp>  <samp>InProgress</samp></div>
			</li>
			<li>
				<a href="#crop"   disabled="disabled">Image Cropping</a>
				<div><samp>MouseOnly</samp>  <samp>InProgress</samp></div>
			</li>
			<li>
				<a href="https://github.com/sajanpaul/sajanp">Source Code</a>
				<div><samp>Github</samp>  <samp>SouceCode</samp></div>
			</li>
			</ol>
		</div>
		<div class="greeting-buble">
			<div class="bubble-title">
				<h1 class="bubble-title"> <span class="min-greet">Hey</span>  <span class="welcome-greet">Welcome</span>  </h1>
				<div class="bubble-text">Click match the following <br> link to open demo </div>
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

	attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
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
