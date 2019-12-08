import { IGridColumn, IDataReference } from '../../../types/grid.d';
import {gridRender, getMeta, updateColumnOrder } from '../../lib/util.js';
/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Popover panel for sorting columns
*/


export class ColumnSortPanel extends HTMLElement {


	private ColumnMap = {} as { [colId: string]: { order: number, column: IGridColumn, } };


	private el = {
		cancel: <HTMLElement>null,
		apply: <HTMLElement>null,
		panel: <HTMLElement>null,
		toggle: <HTMLElement>null,
		listContainer: <HTMLElement>null,
	}

	private meta: IDataReference;

	private dragState = {
		activeHandleElement: <HTMLElement>null,
		activeListElement: <HTMLElement>null,
		placeHolder: <HTMLElement>null,
		ghost: <HTMLElement>null,
		dragStart: <boolean>false,
		ElementList: <NodeListOf<HTMLElement> | null>null,
		totalMouseMovementY: 0,
		totalMouseMovementX: 0,
		topAdjust: 0,
		leftAdjust: 0,
		autoScrollRef: <any>null,
		autoScrollValue: 0,
		enableAutoScroll: (state: boolean) => {
			if (state) {
				if (this.dragState.autoScrollRef) {
					clearInterval(this.dragState.autoScrollRef);
				}
				this.dragState.autoScrollRef = setInterval(this.dragState._autoScrollRun, 100);

			} else {
				if (this.dragState.autoScrollRef) {
					clearInterval(this.dragState.autoScrollRef);
					this.dragState.autoScrollRef = null;
				}
			}
		},
		listener: (enable: boolean) => {
			if (enable) {
				document.addEventListener('mousemove', this.dragMouseMove);
				document.addEventListener('mouseup', this.dragMouseUp);
			} else {
				document.removeEventListener('mousemove', this.dragMouseMove);
				document.removeEventListener('mouseup', this.dragMouseUp);
			}

		},
		_autoScrollRun: () => {
			console.log('tick tick', this.dragState.autoScrollValue)
			this.el.listContainer.scrollTop += this.dragState.autoScrollValue;

		},
		userSelect: (value: 'enable' | 'disable') => {
			if (value === 'enable') {
				document.body.classList.remove('no-user-selection')
			} else if (value === 'disable') {
				document.getSelection().removeAllRanges();
				document.body.classList.add('no-user-selection')
			}
		},
		reset: () => {
			if (this.dragState.placeHolder) {
				this.dragState.placeHolder.remove();
			}
			if (this.dragState.ghost) {
				this.dragState.ghost.remove();
			}
			this.dragState.activeHandleElement = null;
			this.dragState.activeListElement = null;
			this.dragState.placeHolder = null;
			this.dragState.ghost = null;
			this.dragState.dragStart = false;
			this.dragState.totalMouseMovementY = 0;
			this.dragState.totalMouseMovementX = 0;
			this.dragState.topAdjust = 0;
			this.dragState.leftAdjust = 0;
			this.dragState.ElementList = null;
			this.dragState.enableAutoScroll(false);
			this.dragState.listener(false);
			this.dragState.userSelect('enable');
		},

	};


	constructor() {
		super();
	}


	connectedCallback() {

		this.meta = getMeta();

		this.innerHTML =/* html */`
			<button data-element="toggle" class="btn btn-primary">
				<span class="text">Columns Order</span>
			</button>
			<div class="freeze-column-popup hide"  data-element="panel">
				<div class="popup-body column-selection">
					<h5 class="popup-title">Columns Order</h5>
					<ul class="list-sort"  data-element="list-container"></ul>
				</div>
				<div class="popup-footer">
					<button class="btn btn-default" data-element="cancel">Cancel</button>
					<button class="btn btn-primary" data-element="apply">Apply</button>
				</div>
			</div>
		`;

		this.el.cancel = this.querySelector('[data-element="cancel"]');
		this.el.apply = this.querySelector('[data-element="apply"]');
		this.el.listContainer = this.querySelector('[data-element="list-container"]');
		this.el.panel = this.querySelector('[data-element="panel"]');
		this.el.toggle = this.querySelector('[data-element="toggle"]');


		this.el.toggle.addEventListener('click', this.menuToggler);
		this.el.cancel.addEventListener('click', this.cancelClick);
		this.el.apply.addEventListener('click', this.applyClick);


		this.panelInit();
	}
	disconnectedCallback() {
		this.dynamicContentListener('unbind');
		this.dragState.reset(); // remove listeners, states, elements etc
		document.removeEventListener('mousedown', this.outSideClickHandler);
		this.el.toggle.removeEventListener('click', this.menuToggler);
		this.el.cancel.removeEventListener('click', this.cancelClick);
		this.el.apply.removeEventListener('click', this.applyClick);
	}


	panelInit() {
		this.meta.visibleColumns.sort((a: IGridColumn, b: IGridColumn) => a.order - b.order);
		this.ColumnMap = {};
		this.meta = getMeta();

		for (let idx = 0, len = this.meta.visibleColumns.length; idx < len; idx++) {
			this.ColumnMap[this.meta.visibleColumns[idx].column_unique_id] = {
				order: this.meta.visibleColumns[idx].order,
				column: this.meta.visibleColumns[idx]
			}
		}
		this.renderUpdate();
	}


	renderUpdate() {
		this.dragState.reset();
		if (this.el.listContainer) {
			this.dynamicContentListener('unbind');
			if (this.meta.visibleColumns.length > 0) {
				this.el.listContainer.innerHTML = this.meta.visibleColumns.map((col: IGridColumn) => {
					return (/* html */`
								<li data-element="list-item" data-sort-ui-id="${col.column_unique_id}">
									<span class="move-option" data-element="list-sort-handle"  data-sort-ui-id="${col.column_unique_id}"></span>
									<span class="column-name" data-element="list-label">${col.column_name}</span>
								</li>
							`);
				}).join('')
			} else {
				this.el.listContainer.innerHTML = /* html */`
				<li>
					<span class="column-name">
						NO RESULT FOUND!
					</span>
				</li>
				`;
			}
			this.dynamicContentListener('bind');
		} else {
			console.error('Column Sort Panel Render Error: Not Found - List Container')
		}
	}


	private dynamicContentListener(action: 'bind' | 'unbind') {
		if (action === 'bind') {
			(this.querySelectorAll('[data-element="list-container"] [data-element="list-item"] [data-element="list-sort-handle"]') as NodeListOf<HTMLInputElement>)
				.forEach((checkEl) => checkEl.addEventListener('mousedown', this.dragHandlerMouseDown));

		} else if (action === 'unbind') {
			(this.querySelectorAll('[data-element="list-container"] [data-element="list-item"] [data-element="list-sort-handle"]') as NodeListOf<HTMLInputElement>)
				.forEach((checkEl) => checkEl.removeEventListener('mousedown', this.dragHandlerMouseDown));
		}
	}


	private dragHandlerMouseDown = (event: MouseEvent) => {
		this.dragState.listener(true);
		this.dragState.userSelect('disable');
		this.dragState.activeHandleElement = event.currentTarget as HTMLElement;
		if (this.dragState.activeHandleElement) {
			this.dragState.activeListElement = this.dragState.activeHandleElement.closest('[data-element="list-item"]');
		}
	}





	private dragMouseMove = (event: MouseEvent) => {
		// console.log('mouse updated');
		// if(event.movementY)
		if (this.dragState.activeListElement) {// Having element
			this.dragState.ElementList = this.querySelectorAll('[data-element="list-item"]');
			this.dragState.totalMouseMovementY += Math.abs(event.movementY);
			this.dragState.totalMouseMovementX += Math.abs(event.movementX);
			if (!this.dragState.dragStart &&
				(this.dragState.totalMouseMovementY > 15 || this.dragState.totalMouseMovementX > 30)
			) {
				this.dragState.dragStart = true;
				this.generatePlaceHolderAndGhost(this.dragState.activeListElement);
			}
			if (this.dragState.dragStart) {

				this.dragState.ghost.style.top = (event.clientY - this.dragState.topAdjust) + 'px';
				this.dragState.ghost.style.left = (event.clientX - this.dragState.leftAdjust) + 'px';


				const rect = this.el.listContainer.getClientRects()[0];
				if (rect) {
					const horizontalInside = (event.clientX > rect.left) && (event.clientY < rect.right);
					if (horizontalInside) {
						// console.log('horizontal inside');
						const top_scroll_area_start = rect.top - 120;
						const bottom_scroll_area_end = rect.bottom + 120;

						const top_scroll_area_end = top_scroll_area_start + 130;
						const bottom_scroll_area_start = bottom_scroll_area_end - 130;

						// let top = document.getElementById('top-rep');

						// let bottom = document.getElementById('bottom-rep');

						// top.style.left = rect.left + 'px';
						// top.style.width = rect.width + 'px';

						// bottom.style.left = rect.left + 'px';
						// bottom.style.width = rect.width + 'px';

						// top.style.top = top_scroll_area_start + 'px';
						// top.style.height = (top_scroll_area_start - top_scroll_area_end) + 'px';

						// bottom.style.top = bottom_scroll_area_start + 'px';
						// bottom.style.bottom = (bottom_scroll_area_start - bottom_scroll_area_end) + 'px';


						// console.log(event.clientY, top_scroll_area_start, bottom_scroll_area_end);

						const OnTop = (event.clientY > top_scroll_area_start) && (event.clientY < top_scroll_area_end);
						const OnBottom = (event.clientY > bottom_scroll_area_start) && (event.clientY < bottom_scroll_area_end);
						// console.log(OnTop,OnBottom)

						if (OnTop && !OnBottom) {
							this.dragState.autoScrollValue = -50

						} else if (!OnTop && OnBottom) {
							this.dragState.autoScrollValue = 50
						}

						if ((OnTop && OnBottom) || (!OnTop && !OnBottom)) {
							this.dragState.enableAutoScroll(false);

						} else {
							this.dragState.enableAutoScroll(true);
						}
					} else {
						this.dragState.enableAutoScroll(false);
					}

					const targetEl = (<HTMLElement>event.target).closest('[data-element="list-item"]:not(.heading-drag-place-holder)');
					if (
						targetEl &&
						targetEl !== this.dragState.activeListElement &&
						!targetEl.classList.contains('heading-drag-place-holder')
					) {
						let verifiedTarget = 0;
						if (this.dragState.ElementList) {
							this.dragState.ElementList.forEach((node) => {
								if (targetEl === node) {
									verifiedTarget++;
								}
							});
						}

						if (verifiedTarget === 1) {// only one true reference and that existed
							// console.log(targetEl, targetEl.parentElement);
							this.dragState.placeHolder.remove();
							if (event.movementY > 0) {
								if (targetEl.parentElement.lastElementChild === targetEl) {
									targetEl.parentElement.appendChild(this.dragState.placeHolder);
								} else {
									targetEl.parentElement.insertBefore(this.dragState.placeHolder, targetEl.nextElementSibling);
								}
							} else {
								targetEl.parentElement.insertBefore(this.dragState.placeHolder, targetEl);
							}
						}
					}
				}
			}
		}
	}

	private dragMouseUp = () => {

		const isAfterSuccessfullDrag = this.dragState.activeListElement && this.dragState.dragStart;
		if (this.dragState.activeListElement && this.dragState.placeHolder) {
			this.dragState.placeHolder.replaceWith(this.dragState.activeListElement);
		}

		this.dragState.reset();

		if (isAfterSuccessfullDrag) {
			if (this.el.listContainer && this.el.listContainer.children) {
				for (let elx_index = 0; elx_index < this.el.listContainer.children.length; elx_index++) {
					this.ColumnMap[(this.el.listContainer.children.item(elx_index) as HTMLElement).dataset.sortUiId].order = elx_index;
				}
			}
		}

	}

	private generatePlaceHolderAndGhost(el: HTMLElement) {
		if (this.dragState.placeHolder) {
			(<HTMLElement>this.dragState.placeHolder).remove();
		}

		if (this.dragState.ghost) {
			(<HTMLElement>this.dragState.ghost).remove();
		}

		this.dragState.placeHolder = el.cloneNode() as HTMLElement;

		this.dragState.placeHolder.style.height = el.offsetHeight + 'px';
		this.dragState.placeHolder.style.width = el.offsetWidth + 'px';
		this.dragState.placeHolder.classList.add('heading-drag-place-holder');



		this.dragState.ghost = document.createElement('div') as HTMLElement;
		this.dragState.ghost.innerHTML = el.innerHTML;

		let targetCheck = this.dragState.ghost.querySelector('[data-element="list-toggle"]') as HTMLInputElement;
		let source = el.querySelector('[data-element="list-toggle"]') as HTMLInputElement;
		if (targetCheck && source) {
			targetCheck.checked = source.checked
		}

		this.dragState.ghost.style.height = el.offsetHeight + 'px';
		this.dragState.ghost.style.width = el.offsetWidth + 'px';

		this.dragState.topAdjust = Math.round(el.offsetHeight / 2);
		// this.dragState.leftAdjust = Math.round(el.offsetWidth / 2);
		this.dragState.leftAdjust = 23;


		this.dragState.ghost.classList.add('heading-drag-ghost-element');

		this.dragState.activeListElement.replaceWith(this.dragState.placeHolder);
		document.body.appendChild(this.dragState.ghost);
	}






	applyClick = (event: Event) => {
		for (var idKey in this.ColumnMap) {
			this.ColumnMap[idKey].column.order = this.ColumnMap[idKey].order;
		}
		updateColumnOrder();
		gridRender();
		this.closePanel();
		this.panelInit();
	}

	cancelClick = (event: Event) => {
		this.closePanel();
	}

	menuToggler = (event: Event) => {
		event.preventDefault();
		if (this.el.panel.classList.contains('hide')) {
			this.openPanel();
		} else {
			this.closePanel();
		}
	}

	outSideClickHandler = (event: Event) => {
		if (!(event.target === this || (event.target as HTMLElement).closest(this.nodeName))) {
			this.closePanel();
		}
	}


	closePanel() {
		document.removeEventListener('mousedown', this.outSideClickHandler);
		this.el.panel.classList.add('hide');

	}
	openPanel() {
		this.panelInit();
		document.addEventListener('mousedown', this.outSideClickHandler)
		this.el.panel.classList.remove('hide')
	}


	attributeChangedCallback(attrName: string, oldVal: string, newVal: string) { }

	adoptedCallback() { }
}
customElements.define('column-sort-panel', ColumnSortPanel);
