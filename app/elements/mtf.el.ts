
import { IMTF, IPremise , IResponse  } from  './../../../types/mtf'
export class MtfEl extends HTMLElement {

	el={
		premiseList:<HTMLElement>null,
		responseList:<HTMLElement>null
	}
	/**
	@author: Sajan Paul,
	@date: 09- 10- 2019,
	@description : Description
	*/
	private MTF: IMTF;
	constructor() {
		/**
		* @description An instance of the element is created or upgraded. Useful for initializing state,
		  setting up event listeners, or creating a shadow dom.
		  See the spec for restrictions on what you can do in the constructor.
		*/


		super();

		let tmpl = document.createElement('template');
		tmpl.innerHTML = /* html */`
		<div class="premise-list" id="premise-list"></div>
		<div class="response-list" id="response-list"></div>
		`;
		let shadowRoot = this.attachShadow({ mode: "closed" });
		shadowRoot.appendChild(tmpl.content.cloneNode(true));
		this.el.premiseList = shadowRoot.getElementById('premise-list');
		this.el.responseList = shadowRoot.getElementById('response-list');



	}

	connectedCallback() {
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
	set mtfData(_data: IMTF) {
		this.MTF = _data;
		this.renderBlocks();
		this.shuffleList();

	}

	renderBlocks() {
		this.el.premiseList.innerHTML =  '';
		this.el.responseList.innerHTML =  '';
		// Validate and render blocks
		if (this.MTF.premiseList.length > 10 || this.MTF.responseList.length > 10) {
			throw 'Premise and response length should be less than 10'
		} else if (this.MTF.premiseList.length !== this.MTF.responseList.length) {
			throw 'Premise and response length should be equal'
		} else {
			for (let premise of this.MTF.premiseList) {
				// premise
				let response = this.MTF.responseList.find(_res => _res.id === premise.id)
				if (response) {
					premise.responseRef = response;
				} else {
					throw 'Failed find response of premise, id =' + premise.id;
				}

				if (!(premise && !Number.isNaN(parseInt(premise.id + '')) && (premise.text || '').trim() !== '')) {
					throw 'invalid ID or  text in premise, id =' + premise.id;

				} else if (!(response && !Number.isNaN(parseInt(response.id + '')) && (response.text || '').trim() !== '')) {
					throw 'invalid ID or text in response, id =' + response.id;
				} else {
					premise.element = document.createElement('div');
					premise.element.classList.add('premise');
					premise.element.innerText = premise.text;

					response.element = document.createElement('div');
					response.element.classList.add('response');
					response.element.innerText = premise.text;


					premise.sortKey = Math.random()*100;
					response.sortKey = Math.random()*100;


				}
			}
		}
	}
	shuffleList() {
		//shuffle and update lists
		this.MTF.premiseList.sort((a, b) => a.sortKey - b.sortKey);
		this.MTF.responseList.sort((a, b) => a.sortKey - b.sortKey);
		this.MTF.premiseList.forEach((ent,index) =>{
			ent.indexdID = index+1
			ent.sortKey = Math.random()*100
			ent.element.dataset.indexdId =ent.indexdID+'';
			this.el.premiseList.appendChild(ent.element);
		});
		this.MTF.responseList.forEach((ent,index) =>{
			ent.indexdID = index+1
			ent.sortKey = Math.random()*100
			ent.element.dataset.indexdId =ent.indexdID+'';
			this.el.responseList.appendChild(ent.element);
		});
	}

}


customElements.define('mtf-el', MtfEl);
