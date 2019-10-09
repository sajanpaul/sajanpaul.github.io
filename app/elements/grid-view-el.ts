import { IGridMeta, ICellPack, IColFrag, IRowFrag, IPositionMap, IFCMapper, IGridColumn, IGridRow } from './grid-view.d';



export class GridView extends HTMLElement {
	/**
	@author: Sajan Paul,
	@date: 24- 09- 2019,
	@description : Description
	*/


	GRID_META: IGridMeta = null;

	gridPosition = {
		XPOS: <number>0,
		YPOS: <number>0,
	};

	gridSize = {
		height: <number>0,
		width: <number>0,
	}
	renderGridSize = {
		height: <number>0,
		width: <number>0,
	}

	layoutConfig = {
		serialColumnWidth: <number>100,
		pestBarHeight: <number>50,
		headingBarHeight: <number>50,
		applyBarHeight: <number>50,
	}


	el = {
		gridLayout: <HTMLElement>null,
		gridTouchLayer: <HTMLElement>null,
		pest: {
			pestGlue: <HTMLElement>null,
			pestTitle: <HTMLElement>null,
			pestHeadingView: <HTMLElement>null,
			pestHeadingWrapper: <HTMLElement>null
		},
		reportIcon: <HTMLElement>null,
		fixedhead: {
			head1: <HTMLElement>null,
			head2: <HTMLElement>null,
			head3: <HTMLElement>null,
		},
		headingListView: <HTMLElement>null,
		headingListWrapper: <HTMLElement>null,
		slNo: <HTMLElement>null,
		applyAll: <HTMLElement>null,
		applyHeadingView: <HTMLElement>null,
		applyHeadingWrapper: <HTMLElement>null,
		fixedBody: {
			serialView: <HTMLElement>null,
			serialWrapper: <HTMLElement>null,
			body1View: <HTMLElement>null,
			body2View: <HTMLElement>null,
			body3View: <HTMLElement>null,
			body1Wrapper: <HTMLElement>null,
			body2Wrapper: <HTMLElement>null,
			body3Wrapper: <HTMLElement>null,
		},
		gridBodyView: <HTMLElement>null,
		gridBodyWrapper: <HTMLElement>null,
	}

	touchState = {
		lastX: <number>null,
		lastY: <number>null,
		dragActive: <boolean>false,
		totalX: <number>0,
		totalY: <number>0,
		lastSecondX: <number>null,
		lastSecondY: <number>null,
		reset: () => {
			this.touchState.lastX = null;
			this.touchState.lastY = null;
			this.touchState.dragActive = false;
			this.touchState.totalX = 0;
			this.touchState.totalY = 0;

			this.touchState.lastSecondX = null;
			this.touchState.lastSecondY = null;
		}
	}
	resizeState = {
		hit: <number>0,
		running: <boolean>false,
	}
	max = {
		scrollLeft: <number>0,
		scrollTop: <number>0,
	};
	positionBookMark = {
		XMap: <Array<IPositionMap>>[],
		YMap: <Array<IPositionMap>>[],
	};

	flags = {
		touchStopProp:false,
	}



	// gridViewWidth: number = 0;
	// gridViewHeight: number = 0;

	// gridTotalRenderWidth: number = 0;
	// horizontalScrollRatio: number = 0;
	// gridTotalRenderHeight: number = 0;
	// verticleScrollRatio: number = 0;
	// widthScrollMoveRatio: number = 0;
	// heighScrollMoveRatio: number = 0;

	LastVirtualGRID: any[] | null = null;




	constructor() {
		/**
		* @description An instance of the element is created or upgraded. Useful for initializing state,
		  setting up event listeners, or creating a shadow dom.
		  See the spec for restrictions on what you can do in the constructor.
		*/
		super();

	}

	connectedCallback() {
		// this.style.display = "none";
		this.innerHTML = /* html */ `
			<div class="grid-touch-layer" data-render-el="grid-touch-layer"></div>
			<div class="grid-layout" data-render-el="grid-layout">
				<div class="grid-layout-child" style="grid-column:1/2;grid-row:1/2" data-render-el="grid-pest-glue"></div>
				<div class="grid-layout-child" style="grid-column:2/5;grid-row:1/2" data-render-el="grid-pest-title">Pest Control</div>
				<div class="grid-layout-child" style="grid-column:5/6;grid-row:1/2" data-render-el="grid-pest-heading-view">
					<div class="wrapper-dimension" data-render-el="grid-pest-heading-wrapper">Pest List</div>
				</div>

				<div class="grid-layout-child" style="grid-column:1/2;grid-row:2/3" data-render-el="grid-report-icon">
					<span  class="report-icon">
					<img  style="width:24px" src="assets/icon/report.png">
					</span>
				</div>
				<div class="grid-layout-child" style="grid-column:2/3;grid-row:2/3" data-render-el="grid-fixed-head-1">IC>FIXED_HEAD1</div>
				<div class="grid-layout-child" style="grid-column:3/4;grid-row:2/3" data-render-el="grid-fixed-head-2">IC>FIXED_HEAD2</div>
				<div class="grid-layout-child" style="grid-column:4/5;grid-row:2/3" data-render-el="grid-fixed-head-3">IC>FIXED_HEAD3</div>
				<div class="grid-layout-child" style="grid-column:5/6;grid-row:2/3" data-render-el="grid-heading-view">
					<div class="wrapper-dimension" data-render-el="grid-heading-wrapper">heading List</div>
				</div>

				<div class="grid-layout-child" style="grid-column:1/2;grid-row:3/4" data-render-el="grid-slno">
				<span  class="slno">SL.NO</span>
				</div>
				<div class="grid-layout-child" style="grid-column:2/5;grid-row:3/4" data-render-el="grid-apply-all">
					<span class="apply-for-all"> Apply for All.</span>
				</div>
				<div class="grid-layout-child" style="grid-column:5/6;grid-row:3/4" data-render-el="grid-apply-heading-view">
					<div class="wrapper-dimension" data-render-el="grid-apply-heading-wrapper" >
						apply goes here
					</div>
				</div>

				<div class="grid-layout-child" style="grid-column:1/2;grid-row:4/5" data-render-el="grid-fixed-body-serial-view">
					<div  class="wrapper-dimension" data-render-el="grid-fixed-body-serial-wrapper"></diV>
				</div>
				<div class="grid-layout-child" style="grid-column:2/3;grid-row:4/5" data-render-el="grid-fixed-body1-view">
					<div  class="wrapper-dimension" data-render-el="grid-fixed-body1-wrapper"></div>
				</div>
				<div class="grid-layout-child" style="grid-column:3/4;grid-row:4/5" data-render-el="grid-fixed-body2-view">
					<div  class="wrapper-dimension"  data-render-el="grid-fixed-body2-wrapper"></div>
				</div>
				<div class="grid-layout-child" style="grid-column:4/5;grid-row:4/5" data-render-el="grid-fixed-body3-view">
					<div  class="wrapper-dimension" data-render-el="grid-fixed-body3-wrapper"></div>
				</div>
				<div class="grid-layout-child border-left" style="grid-column:5/6;grid-row:4/5" data-render-el="grid-body-view">
					<div  class="wrapper-dimension" data-render-el="grid-body-wrapper"></div>
				</div>
			</div>
			`;
		this.el.gridTouchLayer = this.querySelector('[data-render-el="grid-touch-layer"]');
		this.el.gridLayout = this.querySelector('[data-render-el="grid-layout"]');
		this.el.pest.pestGlue = this.querySelector('[data-render-el="grid-pest-glue"]');
		this.el.pest.pestTitle = this.querySelector('[data-render-el="grid-pest-title"]');
		this.el.pest.pestHeadingView = this.querySelector('[data-render-el="grid-pest-heading-view"]');
		this.el.pest.pestHeadingWrapper = this.querySelector('[data-render-el="grid-pest-heading-wrapper"]');

		this.el.reportIcon = this.querySelector('[data-render-el="grid-report-icon"]');

		this.el.fixedhead.head1 = this.querySelector('[data-render-el="grid-fixed-head-1"]');
		this.el.fixedhead.head2 = this.querySelector('[data-render-el="grid-fixed-head-2"]');
		this.el.fixedhead.head3 = this.querySelector('[data-render-el="grid-fixed-head-3"]');

		this.el.headingListView = this.querySelector('[data-render-el="grid-heading-view"]');
		this.el.headingListWrapper = this.querySelector('[data-render-el="grid-heading-wrapper"]');

		this.el.slNo = this.querySelector('[data-render-el="grid-slno"]');
		this.el.applyAll = this.querySelector('[data-render-el="grid-apply-all"]');

		this.el.applyHeadingView = this.querySelector('[data-render-el="grid-apply-heading-view"]');
		this.el.applyHeadingWrapper = this.querySelector('[data-render-el="grid-apply-heading-wrapper"]');

		this.el.fixedBody.serialView = this.querySelector('[data-render-el="grid-fixed-body-serial-view"]');
		this.el.fixedBody.serialWrapper = this.querySelector('[data-render-el="grid-fixed-body-serial-wrapper"]');

		this.el.fixedBody.body1View = this.querySelector('[data-render-el="grid-fixed-body1-view"]');
		this.el.fixedBody.body1Wrapper = this.querySelector('[data-render-el="grid-fixed-body1-wrapper"]');

		this.el.fixedBody.body2View = this.querySelector('[data-render-el="grid-fixed-body2-view"]');
		this.el.fixedBody.body2Wrapper = this.querySelector('[data-render-el="grid-fixed-body2-wrapper"]');

		this.el.fixedBody.body3View = this.querySelector('[data-render-el="grid-fixed-body3-view"]');
		this.el.fixedBody.body3Wrapper = this.querySelector('[data-render-el="grid-fixed-body3-wrapper"]');

		this.el.gridBodyView = this.querySelector('[data-render-el="grid-body-view"]');
		this.el.gridBodyWrapper = this.querySelector('[data-render-el="grid-body-wrapper"]');

		this.el.gridLayout.addEventListener('wheel', this.handleGridWheel);
		this.el.gridLayout.addEventListener('keydown', this.handlerGridKey);

		this.el.gridLayout.addEventListener('touchstart', this.gridHandleTouchStart);

		this.el.gridTouchLayer.addEventListener('touchstart', this.touchOverlayStart);
		this.el.gridTouchLayer.addEventListener('touchmove', this.touchOverlayMove);
		this.el.gridTouchLayer.addEventListener('touchend', this.touchOverlayEnd);

		// NOTE refer https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
		// NOTE refe https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent


		window.addEventListener('resize', this.resizeHandler);
		this.gridInit();
	}

	disconnectedCallback() {
		this.el.gridLayout.removeEventListener('wheel', this.handleGridWheel);
		this.el.gridLayout.removeEventListener('keydown', this.handlerGridKey);

		this.el.gridLayout.removeEventListener('touchstart', this.gridHandleTouchStart);

		this.el.gridTouchLayer.removeEventListener('touchstart', this.touchOverlayStart);
		this.el.gridTouchLayer.removeEventListener('touchmove', this.touchOverlayMove);
		this.el.gridTouchLayer.removeEventListener('touchend', this.touchOverlayEnd);
		window.removeEventListener('resize', this.resizeHandler);
	}

	attributeChangedCallback(attrName: any, oldVal: any, newVal: any) {

	}

	adoptedCallback() {

	}
	set gridMeta(_gdmeta: any) {
		// console.log(_gdmeta);
		this.GRID_META = _gdmeta;
		this.gridInit();
	}
	gridInit() {
		if (this.el.gridLayout && this.GRID_META) {
			//Checking to ensure both data and dom are available
			this.style.display = 'block';
			this.updateLayout();
		}
	}


	updateLayout() {
		// When the layout is updated new fixed column row etc

		var layout_column_ar = [];
		var layout_row_ar = [];
		layout_column_ar.push(this.layoutConfig.serialColumnWidth + 'px');
		for (var x = 0; x < 3; x++) {
			if (this.GRID_META.fixedCol[x]) {
				layout_column_ar.push(this.GRID_META.fixedCol[x].width + 'px');
				((this.el.fixedhead as any)[('head' + (x + 1))] as HTMLElement).style.display = '';
				((this.el.fixedBody as any)[('body' + (x + 1) + 'View')] as HTMLElement).style.display = '';
			} else {
				((this.el.fixedhead as any)[('head' + (x + 1))] as HTMLElement).style.display = 'none';
				((this.el.fixedBody as any)[('body' + (x + 1) + 'View')] as HTMLElement).style.display = 'none';
				layout_column_ar.push(0 + 'px');
			}
		}

		if (this.GRID_META.fixedCol.length === 0) {
			this.el.pest.pestTitle.style.display = 'none';
			this.el.applyAll.style.display = 'none';
		}else{
			this.el.pest.pestTitle.style.display = '';
			this.el.applyAll.style.display = '';
		}

		layout_column_ar.push('auto');


		if (this.GRID_META.showpestBAR) {
			layout_row_ar.push(this.layoutConfig.applyBarHeight + 'px');
			this.el.pest.pestGlue.style.display = '';
			this.el.pest.pestTitle.style.display = '';
			this.el.pest.pestHeadingView.style.display = '';
		} else {
			layout_row_ar.push(0 + 'px');
			this.el.pest.pestGlue.style.display = 'none';
			this.el.pest.pestTitle.style.display = 'none';
			this.el.pest.pestHeadingView.style.display = 'none';

		}
		layout_row_ar.push(this.layoutConfig.headingBarHeight + 'px');
		layout_row_ar.push(this.layoutConfig.applyBarHeight + 'px');
		layout_row_ar.push('auto');

		this.el.gridLayout.style.gridTemplateColumns = layout_column_ar.join(' ').trim();
		this.el.gridLayout.style.gridTemplateRows = layout_row_ar.join(' ').trim();
		this.upgradeVirtualGridSize();
		this.fixedColumnRender();
	}

	upgradeVirtualGridSize() {

		// call when grid meta data is upgraded

		// Reset values here
		this.LastVirtualGRID = null;

		let _twidth = 0;
		let _theight = 0;

		let _arr_tl = this.GRID_META.columns.length;
		for (let col_index = 0; col_index < _arr_tl; col_index++) {
			_twidth = _twidth + this.GRID_META.columns[col_index].width;
		}
		_arr_tl = this.GRID_META.rows.length;
		for (let row_index = 0; row_index < _arr_tl; row_index++) {
			_theight = _theight + this.GRID_META.rows[row_index].height;
		}
		this.gridSize.width = _twidth
		this.gridSize.height = _theight;
		this.updateViewPort();
	}


	updateViewPort() {
		//need to update on window resize  or view port size change
		this.renderGridSize.width = this.el.gridBodyView.clientWidth;
		this.renderGridSize.height = this.el.gridBodyView.clientHeight;

		this.max.scrollLeft = (this.gridSize.width - this.renderGridSize.width);
		this.max.scrollTop = (this.gridSize.height - this.renderGridSize.height);

		this.max.scrollLeft = this.max.scrollLeft < 0 ? 0 : this.max.scrollLeft;
		this.max.scrollTop = this.max.scrollTop < 0 ? 0 : this.max.scrollTop;

		this.gridPosition.XPOS = this.gridPosition.XPOS < this.max.scrollLeft ? this.gridPosition.XPOS : this.max.scrollLeft;
		this.gridPosition.YPOS = this.gridPosition.YPOS < this.max.scrollTop ? this.gridPosition.YPOS : this.max.scrollTop;
		this._updateBookMark()
		/*`
		 NOTE view port change  occure by many reason including  landscape/protrait swtiching
		 triggering  this.fullRender()   wouldn't be a vice for some situvations

		*/

		this.fullRender()
	}




	_updateBookMark() {

		this.positionBookMark.XMap = [];
		this.positionBookMark.YMap = [];

		let col_total_length: number = this.GRID_META.columns.length;
		let row_total_length: number = this.GRID_META.rows.length;

		let calcWidth = this.renderGridSize.width * 2;
		let calcHeight = this.renderGridSize.height * 2;

		let _cursor_position: number = 0;
		let _lastPosition: number = 0;
		let _targetPosition: number = calcWidth;


		for (let col_index: number = 0; col_index <= col_total_length; col_index++) {
			if (_cursor_position > _targetPosition) {
				this.positionBookMark.XMap.push({
					index: col_index,
					position: _cursor_position,
					lastpos: _lastPosition,

				})
				_targetPosition += calcWidth;
			}
			if (col_index < col_total_length) {
				_lastPosition = _cursor_position;
				_cursor_position = _cursor_position + this.GRID_META.columns[col_index].width;
			}
		}

		_cursor_position = 0;
		_lastPosition = 0;
		_targetPosition = calcWidth;

		for (let row_index: number = 0; row_index <= row_total_length; row_index++) {
			if (_cursor_position > _targetPosition) {
				this.positionBookMark.YMap.push({
					index: row_index,
					position: _cursor_position,
					lastpos: _lastPosition,
				})
				_targetPosition += calcHeight;
			}
			if (row_index < row_total_length) {
				_lastPosition = _cursor_position;
				_cursor_position = _cursor_position + this.GRID_META.rows[row_index].height;
			}
		}
	}

	fixedColumnRender() {
		this.GRID_META.fixedCol.forEach((col, index) => {


			// let headSpan =  document.createElement('span');
			// headSpan.classList.add('fixed-col-heading');
			// headSpan.innerText = col.column_name;
			let template = /* html */`<span class="fixed-col-heading">${col.column_name } ${col.type==='infocol' ? '(i)' :''}</span>`;
			((this.el.fixedhead as any)['head' + (index + 1)] as HTMLElement).innerHTML = template;
			// ((this.el.fixedhead as any)['head'+(index + 1)] as HTMLElement).appendChild(headSpan);
		})
	}

	fullRender() {
		//Update entire view
		let colFrag: IColFrag = this.lookup_col_fullRecursive(this.gridPosition.XPOS, this.gridPosition.XPOS + this.renderGridSize.width);
		let rowFrag: IRowFrag = this.lookup_row_fullRecursive(this.gridPosition.YPOS, this.gridPosition.YPOS + this.renderGridSize.height);
		let newVDOM: ICellPack[] = [];

		let colWidth: number[] = [];
		let rowHeight: number[] = [];

		let col_flag_length: number = colFrag.array.length;
		let row_flag_length: number = rowFrag.array.length;

		let gridDocFrag = document.createDocumentFragment();
		let seraiDocFrag = document.createDocumentFragment();
		let headingDocFrag = document.createDocumentFragment();
		let applyDocFrag = document.createDocumentFragment();
		let serailVM = [];

		let fixedColumMapper: IFCMapper[] = this.GRID_META.fixedCol.map((col: IGridColumn, _ind: number): IFCMapper => {
			return {
				vDOM: [] as ICellPack[],
				col: col as IGridColumn,
				elView: ((this.el.fixedBody as any)[('body' + (_ind + 1) + 'View')]) as HTMLElement,
				elWrapper: ((this.el.fixedBody as any)[('body' + (_ind + 1) + 'Wrapper')]) as HTMLElement,
				docFrag: document.createDocumentFragment()
			};
		});

		for (let row_index = 0; row_index < row_flag_length; row_index++) {
			if (!(rowHeight[row_index] && rowHeight[row_index] > rowFrag.array[row_index].height)) {
				rowHeight[row_index] = rowFrag.array[row_index].height;
			}
			for (let col_index = 0; col_index < col_flag_length; col_index++) {
				if (!(colWidth[col_index] && colWidth[col_index] > colFrag.array[col_index].width)) {
					colWidth[col_index] = colFrag.array[col_index].width;
				}
				let cell_object: ICellPack = this.createCellPack(colFrag.array[col_index], rowFrag.array[row_index], col_index, row_index)
				newVDOM.push(cell_object);

				let element: any = document.createElement('grid-cell-el');
				element.cellData = cell_object;
				gridDocFrag.appendChild(element);
			}

			for (let fragIndex: number = 0; fragIndex < fixedColumMapper.length; fragIndex++) {
				let cell_object: ICellPack = this.createCellPack(fixedColumMapper[fragIndex].col, rowFrag.array[row_index], fragIndex, row_index);
				fixedColumMapper[fragIndex].vDOM.push(cell_object);
				let element: any = document.createElement('grid-cell-el');
				element.cellData = cell_object;
				fixedColumMapper[fragIndex].docFrag.appendChild(element);
			}
			serailVM.push(rowFrag.array[row_index].row_index + 1)
			let serial_span = document.createElement('span');
			serial_span.classList.add('serail-cell');
			serial_span.innerText = (rowFrag.array[row_index].row_index + 1) + '';
			seraiDocFrag.appendChild(serial_span);

		}
		for (let head_col_index = 0; head_col_index < col_flag_length; head_col_index++) {
			// RE WRITE THIS
			colFrag.array[head_col_index];
			let headingEl = document.createElement('span');
			let applyAdj = document.createElement('span');
			let applyAdj_input = document.createElement('input');
			headingEl.classList.add('col-heading');
			applyAdj.classList.add('col-apply');
			applyAdj_input.classList.add('col-apply-input');
			applyAdj_input.dataset.colIndex = colFrag.array[head_col_index].col_index + '';
			applyAdj_input.onkeypress = this._tempwidthAdjust;
			// applyAdj_input.onclick = this._tempInputClick;
			applyAdj_input.ontouchstart = this._tempInputTouch;
			applyAdj_input.value = colFrag.array[head_col_index].width + '';
			applyAdj_input.type ="number";
			applyAdj.appendChild(applyAdj_input);
			headingEl.innerText = colFrag.array[head_col_index].column_name +' '+(colFrag.array[head_col_index].type==='infocol' ? '(i)' :'');
			headingDocFrag.appendChild(headingEl);
			applyDocFrag.appendChild(applyAdj);

		}

		this.el.gridLayout.style.display = 'none';

		let t_width: number = 0;
		let t_height: number = 0;
		let colGridTemplate: string = colWidth.map((x) => { t_width += x; return x + 'px' }).join(' ').trim();
		let rowGridTemplate: string = rowHeight.map((x) => { t_height += x; return x + 'px' }).join(' ').trim()

		this.el.gridBodyWrapper.innerHTML = '';
		this.el.gridBodyWrapper.appendChild(gridDocFrag);
		this.el.gridBodyWrapper.style.gridTemplateColumns = colGridTemplate;
		this.el.gridBodyWrapper.style.gridTemplateRows = rowGridTemplate;
		this.el.gridBodyWrapper.style.width = t_width + 'px';
		this.el.gridBodyWrapper.style.height = t_height + 'px';
		this.el.gridBodyWrapper.style.left = '-' + colFrag.firstLossAmount + 'px';
		this.el.gridBodyWrapper.style.top = '-' + rowFrag.firstLossAmount + 'px';

		this.el.fixedBody.serialWrapper.innerHTML = '';
		this.el.fixedBody.serialWrapper.appendChild(seraiDocFrag);
		this.el.fixedBody.serialWrapper.style.gridTemplateColumns = '1fr';
		this.el.fixedBody.serialWrapper.style.gridTemplateRows = rowGridTemplate;
		this.el.fixedBody.serialWrapper.style.width = this.layoutConfig.serialColumnWidth + 'px';
		this.el.fixedBody.serialWrapper.style.height = t_height + 'px';
		this.el.fixedBody.serialWrapper.style.left = '0px';
		this.el.fixedBody.serialWrapper.style.top = '-' + rowFrag.firstLossAmount + 'px';


		this.el.applyHeadingWrapper.innerHTML = '';
		this.el.applyHeadingWrapper.appendChild(applyDocFrag);
		this.el.applyHeadingWrapper.style.gridTemplateColumns = colGridTemplate;
		this.el.applyHeadingWrapper.style.gridTemplateRows = '1fr';
		this.el.applyHeadingWrapper.style.width = t_width + 'px';
		this.el.applyHeadingWrapper.style.height = this.layoutConfig.applyBarHeight + 'px';
		this.el.applyHeadingWrapper.style.left = '-' + colFrag.firstLossAmount + 'px';
		this.el.applyHeadingWrapper.style.top = '0px';

		this.el.headingListWrapper.innerHTML = '';
		this.el.headingListWrapper.appendChild(headingDocFrag);
		this.el.headingListWrapper.style.gridTemplateColumns = colGridTemplate;
		this.el.headingListWrapper.style.gridTemplateRows = '1fr';
		this.el.headingListWrapper.style.width = t_width + 'px';
		this.el.headingListWrapper.style.height = this.layoutConfig.applyBarHeight + 'px';
		this.el.headingListWrapper.style.left = '-' + colFrag.firstLossAmount + 'px';
		this.el.headingListWrapper.style.top = '0px';

		for (let fragIndex: number = 0; fragIndex < fixedColumMapper.length; fragIndex++) {
			let fixedCol = fixedColumMapper[fragIndex];
			fixedCol.elWrapper.innerHTML = '';
			fixedCol.elWrapper.appendChild(fixedCol.docFrag);
			fixedCol.elWrapper.style.gridTemplateColumns = '1fr';
			fixedCol.elWrapper.style.gridTemplateRows = rowGridTemplate;
			fixedCol.elWrapper.style.width = fixedCol.col.width + 'px';
			fixedCol.elWrapper.style.height = t_height + 'px';
			fixedCol.elWrapper.style.left = '0px';
			fixedCol.elWrapper.style.top = '-' + rowFrag.firstLossAmount + 'px';
		}


		this.el.gridLayout.style.display = '';
	}


	partialRender() {
		//Update partial view use Virtual DOM
		this.fullRender();
	}
	createCellPack(col: IGridColumn, row: IGridRow, renderColOrder: number, renderRowOrder: number): ICellPack {
		let cell_object: ICellPack = {} as ICellPack;
		cell_object.uniqueId = 'c' + col.col_index + '_r' + row.row_index;
		cell_object.column = col;
		cell_object.row = row;
		cell_object.col_pos = renderColOrder;
		cell_object.row_pos = renderRowOrder;
		return cell_object;
	}


	handleGridWheel = (event: WheelEvent) => {
		// console.log(event);
		event.preventDefault();
		let xDelta = event.deltaX;
		let YDelta = event.deltaY;
		if (event.shiftKey) {
			let temp = xDelta;
			xDelta = YDelta;
			YDelta = temp;
		}
		let factor = 1;
		if (event.deltaMode === event.DOM_DELTA_PIXEL) {
			factor = 1;
		} else if (event.deltaMode === event.DOM_DELTA_LINE) {
			factor = 50; //TODO update value based on avg line size
		} else if (event.deltaMode === event.DOM_DELTA_PAGE) {
			factor = 500; //TODO update value based on page size
		}
		if (event.altKey) { //booster
			factor = factor * 10;
		}
		xDelta = Math.round(xDelta * factor);
		YDelta = Math.round(YDelta * factor);
		// console.log(`${event.altKey ? '(boosted)' : ''} x = ${xDelta},  y = ${YDelta}`);
		this.gridmoveBy(xDelta, YDelta);
	}
	handlerGridKey = (event: KeyboardEvent) => {
		// console.log(event);
	}
	touchOverlayMove = (event: TouchEvent) => {
		// console.log(event);
		// console.log(event.target);
		event.preventDefault();
		event.stopPropagation();
		// console.log(event.target);
		// console.log(` Real Scroll = ${event.touches[0].clientX} ${event.touches[0].clientY} `);

		let currentTouchPosX: number = (event.touches[0].clientX);
		let currentTouchPosY: number = (event.touches[0].clientY);

		let currentSecondTouchPosX: number | null = null;
		let currentSecondTouchPosY: number | null = null;
		let secondTouch: Touch = event.touches[1];
		if (secondTouch) {
			currentSecondTouchPosX = secondTouch.clientX;
			currentSecondTouchPosY = secondTouch.clientY;
		}
		if (
			this.touchState.dragActive &&
			this.touchState.lastX !== null &&
			this.touchState.lastY !== null
		) {
			let secondDragActiveX: boolean = false;
			let secondDragActiveY: boolean = false;
			if (
				currentSecondTouchPosX !== null &&
				currentSecondTouchPosY !== null &&
				this.touchState.lastSecondX !== null &&
				this.touchState.lastSecondY !== null
			) {
				secondDragActiveX = Math.abs(this.touchState.lastSecondX - currentSecondTouchPosX) > 4;
				secondDragActiveY = Math.abs(this.touchState.lastSecondY - currentSecondTouchPosY) > 4;
			}

			let XDiff = Math.round(this.touchState.lastX - currentTouchPosX);
			let YDiff = Math.round(this.touchState.lastY - currentTouchPosY);

			let abs_XDiff = Math.abs(XDiff);
			let abs_YDiff = Math.abs(YDiff);

			if (abs_YDiff > 10 && abs_XDiff < 2) {
				XDiff = 0 // consider as noice
			}

			if (abs_XDiff > 10 && abs_YDiff < 2) {
				YDiff = 0 // consider as noice
			}


			if (abs_XDiff > 2) {
				this.touchState.totalX += XDiff;
			}
			if (abs_XDiff > 2) {
				this.touchState.totalY += YDiff;
			}
			let actualMoveX = (Math.abs(this.touchState.totalX) > 6) ? XDiff : 0;
			let actualMoveY = (Math.abs(this.touchState.totalY) > 6) ? YDiff : 0;

			//TODO Change boosted value fraction (10)
			actualMoveX = (Math.abs(actualMoveX) > 3 && secondDragActiveX) ? actualMoveX * 10 : actualMoveX;
			actualMoveY = (Math.abs(actualMoveY) > 3 && secondDragActiveY) ? actualMoveY * 10 : actualMoveY;
			this.gridmoveBy(actualMoveX, actualMoveY);

			if (!(actualMoveX === 0 && actualMoveY === 0)) {
				// console.log(` Scroll Move x = ${actualMoveX} ${boostedX ? '(boosted)' : ''}, y = ${actualMoveY} ${boostedY ? '(boosted)' : ''}  `);
			}

		}
		this.touchState.lastX = currentTouchPosX;
		this.touchState.lastY = currentTouchPosY;
		this.touchState.lastSecondX = currentSecondTouchPosX
		this.touchState.lastSecondY = currentSecondTouchPosY;
	}
	gridHandleTouchStart = (event: TouchEvent) => {
		// if(this.flags.touchStopProp){
		// 	this.flags.touchStopProp = false;
		// 	return false;
		// }
		console.log('gridHandleTouchStart', event);
		event.preventDefault();
		const ct: Touch = event.touches[0];
		// const touchObj: any = {
		// 	clientX: ct.clientX,
		// 	clientY: ct.clientY,
		// 	force: ct.force,
		// 	identifier: ct.identifier,
		// 	pageX:  ct.pageX,
		// 	pageY : ct.pageY,
		// 	radiusX: ct.radiusX,
		// 	radiusY: ct.radiusY,
		// 	rotationAngle: ct.rotationAngle,
		// 	screenX:ct.screenX,
		// 	screenY:ct.screenY,
		// 	target: this.el.gridTouchLayer,
		// }
		// const touchEvent = new TouchEvent('touchstart', {
		// 	cancelable: true,
		// 	bubbles: true,
		// 	touches: [touchObj],
		// 	targetTouches: [touchObj],
		// 	changedTouches: [touchObj],
		// 	shiftKey: false,
		// });
		// const new_event:any = document.createEvent('TouchEvent');
		// new_event.initUIEvent('touchstart', true, true);

		this.el.gridTouchLayer.style.display = 'block';
		// this.el.gridTouchLayer.dispatchEvent(new_event);
	}

	touchOverlayStart = (event: TouchEvent) => {
		console.log('touch overlay start ', event);
		event.preventDefault();
		this.touchState.reset();
		this.touchState.dragActive = true;
	}
	touchOverlayEnd = (event: TouchEvent) => {
		console.log('touch overlay end ', event);
		event.preventDefault();
		this.touchState.reset();
		this.el.gridTouchLayer.style.display = '';
		// setTimeout(()=>{this.el.gridBodyWrapper.innerText = ''},100000)
	}

	gridmoveBy(_mvX: number, _mvY: number) {

		//re write this

		let moveX = 0;
		let moveY = 0;
		let _xApllied = 0;
		let _yApllied = 0;

		if (
			(this.gridPosition.XPOS <= 0 && _mvX < 0) ||
			(this.gridPosition.XPOS >= this.max.scrollLeft && _mvX > 0)
		) {
			moveX = 0;
		} else {
			_xApllied = (this.gridPosition.XPOS + _mvX);

			if (_xApllied < 0) {
				moveX = _mvX + Math.abs(_xApllied);
			} else if (_xApllied > this.max.scrollLeft) {
				moveX = _mvX - (_xApllied - this.max.scrollLeft);
			} else {
				moveX = _mvX;
			}
		}

		if (
			(this.gridPosition.YPOS <= 0 && _mvY < 0) ||
			(this.gridPosition.YPOS >= this.max.scrollTop && _mvY > 0)
		) {
			moveY = 0;
		} else {
			_yApllied = (this.gridPosition.YPOS + _mvY);
			if (_yApllied < 0) {
				moveY = _mvY + Math.abs(_yApllied);
			} else if (_yApllied > this.max.scrollTop) {
				moveY = _mvY - (_yApllied - this.max.scrollTop);
			} else {
				moveY = _mvY;
			}
		}
		// console.log('Y POS', this.gridPosition.YPOS, '_mvY', _mvY, '_yApllied', _yApllied, '|', 'X POS', this.gridPosition.XPOS, '_mvX', _mvX, '_xApllied', _xApllied);




		this.gridPosition.XPOS += moveX;
		this.gridPosition.YPOS += moveY;
		if (
			(moveX / this.renderGridSize.width) < 0.9 &&
			(moveY / this.renderGridSize.height) < 0.9
		) {
			this.partialRender(); // Less than 90% view port is moved partial render
		} else {
			this.fullRender(); // else full render
		}
	}


	resizeHandler = (event?: any) => {

		if(document.activeElement.nodeName ==="INPUT" || document.activeElement.nodeName ==="GRID-CELL-EL"){
			return;
		}
		// console.count('actual Hit')
		this.resizeState.hit++;
		if (!this.resizeState.running) {
			this.resizeState.running = true;
			this.resizeState.hit = 0;
			// console.count('optimized Hit')
			setTimeout(() => { this.updateViewPort(); }, 10); //delay for re render
			setTimeout(() => {
				this.resizeState.running = false;
				if (this.resizeState.hit > 0) {
					this.resizeHandler();
				}
			}, 150);
		}
	}


	lookup_col_fullRecursive(start: number, end: number): IColFrag {
		let _arr_tl: number = this.GRID_META.columns.length;

		let _arrIndexStart: number = 0;
		let _arrIndexEnd: number = 0;

		let _first_lost_amount: number = 0;

		let _cursor_position: number = 0;
		let _lastPosition: number = 0;

		let calculatedEnd = end;
		// console.group();

		let idealStartPos: IPositionMap = this._columnBookmarkFind(start);
		_cursor_position = idealStartPos.position;
		_lastPosition = idealStartPos.lastpos;

		for (let col_index: number = idealStartPos.index; col_index <= _arr_tl; col_index++) {
			if (_cursor_position === start) {
				_arrIndexStart = col_index;
				// console.log('start',start, 'start loss',0, 'current position',_cursor_position)
			} else if (_lastPosition < start && _cursor_position > start) {
				_first_lost_amount = start - _lastPosition;
				_arrIndexStart = col_index;
				calculatedEnd += _first_lost_amount;
				// console.log('start',start, 'start loss',_first_lost_amount, 'current position',_cursor_position)
			}
			if (_cursor_position === calculatedEnd) {
				_arrIndexEnd = col_index;
				// console.log('end',end,   'end  calculated',calculatedEnd, 'current position',_cursor_position)
				break;
			} else if (_lastPosition < calculatedEnd && _cursor_position > calculatedEnd) {
				_arrIndexEnd = col_index + 1;
				// console.log('end',end,  'end  calculated',calculatedEnd, 'current position',_cursor_position)
				break;
			} else if (col_index === _arr_tl && _lastPosition < calculatedEnd && _cursor_position < calculatedEnd) {
				_arrIndexEnd = _arr_tl;
				break;
			}

			if (col_index < _arr_tl) {
				_lastPosition = _cursor_position;
				_cursor_position = _cursor_position + this.GRID_META.columns[col_index].width;
			}
		}
		// console.log('diff',end -start ,_first_lost_amount,(end -start)+ _first_lost_amount)

		// console.groupEnd();
		_arrIndexEnd = _arrIndexEnd > _arr_tl ? _arr_tl : _arrIndexEnd;
		let column_array = this.GRID_META.columns.slice(_arrIndexStart, _arrIndexEnd);
		return {
			'firstLossAmount': _first_lost_amount,
			'indexStart': _arrIndexStart,
			'indexEnd': _arrIndexEnd,
			'array': column_array
		}
	}


	lookup_row_fullRecursive(start: number, end: number): IRowFrag {
		// console.log('row look up',start,end, this.max, this.gridSize);

		let _arr_tl: number = this.GRID_META.rows.length;

		let _arrIndexStart: number = 0;
		let _arrIndexEnd: number = 0;

		let _first_lost_amount: number = 0;

		let _cursor_position: number = 0;
		let _lastPosition: number = 0;

		let calculatedEnd = end;
		let idealStartPos: IPositionMap = this._rowBookmarkFind(start);
		_cursor_position = idealStartPos.position;
		_lastPosition = idealStartPos.position;

		for (let row_index: number = idealStartPos.index; row_index <= _arr_tl; row_index++) {
			if (_cursor_position === start) {
				_arrIndexStart = row_index;
				// console.log('start',start, 'start loss',0, 'current position',_cursor_position, '_arrIndexStart', _arrIndexStart)
			} else if (_lastPosition < start && _cursor_position > start) {
				_first_lost_amount = start - _lastPosition;
				_arrIndexStart = row_index;
				calculatedEnd += _first_lost_amount;
				// console.log('start',start, 'start loss',_first_lost_amount, 'current position',_cursor_position,'_arrIndexStart', _arrIndexStart)
			}
			if (_cursor_position === calculatedEnd) {
				_arrIndexEnd = row_index;
				// console.log('end',end,   'end  calculated',calculatedEnd, 'current position',_cursor_position,'_arrIndexEnd', _arrIndexEnd)
				break;
			} else if (_lastPosition < calculatedEnd && _cursor_position > calculatedEnd) {
				_arrIndexEnd = row_index + 1;
				// console.log('end',end,   'end  calculated',calculatedEnd, 'current position',_cursor_position , '_arrIndexEnd', _arrIndexEnd)
				break;
			} else if (row_index === _arr_tl && _lastPosition < calculatedEnd && _cursor_position < calculatedEnd) {
				_arrIndexEnd = _arr_tl;
				break;
			}
			if (row_index < _arr_tl) {
				_lastPosition = _cursor_position;
				_cursor_position = _cursor_position + this.GRID_META.rows[row_index].height;
			}
		}
		_arrIndexEnd = _arrIndexEnd > _arr_tl ? _arr_tl : _arrIndexEnd;
		let row_array = this.GRID_META.rows.slice(_arrIndexStart, _arrIndexEnd);
		// console.log(row_array, 'tota len',_arr_tl);
		return {
			'firstLossAmount': _first_lost_amount,
			'indexStart': _arrIndexStart,
			'indexEnd': _arrIndexEnd,
			'array': row_array
		}
	}

	_columnBookmarkFind(position: number): IPositionMap {
		let lastItemIndex: IPositionMap = { index: 0, position: 0, lastpos: 0 };
		let xmapLength: number = this.positionBookMark.XMap.length;
		for (let index = 0; index < xmapLength; index++) {
			if (this.positionBookMark.XMap[index].position > position) {
				return lastItemIndex;
			}
			lastItemIndex = this.positionBookMark.XMap[index];
		}
		return this.positionBookMark.XMap[xmapLength - 1];
	}
	_rowBookmarkFind(position: number): IPositionMap {
		let lastItemIndex: IPositionMap = { index: 0, position: 0, lastpos: 0 };
		let ymapLength: number = this.positionBookMark.YMap.length;
		for (let index = 0; index < ymapLength; index++) {
			if (this.positionBookMark.YMap[index].position > position) {
				return lastItemIndex;
			}
			lastItemIndex = this.positionBookMark.YMap[index];
		}
		return this.positionBookMark.YMap[ymapLength - 1];
	}

	_tempwidthAdjust = (event: KeyboardEvent) => {
		// if(event.key = event.)
		if (event.key === "Enter") {
			let value = parseInt((event.currentTarget as HTMLInputElement).value)
			if (typeof value !== 'number' || Number.isNaN(value)) {
				alert('Invalid width value');
			} else if ( value< 50 || value > 300) {
				alert('The width  value should be between 50 and 300');
			} else {
				// debugger
				this.GRID_META.columns[parseInt((event.currentTarget as HTMLInputElement).dataset.colIndex)].width = value;
				this.upgradeVirtualGridSize();
			}
		}

	}

	_tempInputTouch = (event: TouchEvent | MouseEvent) => {
		// this.flags.touchStopProp = true;
		// event.preventDefault();
		event.stopPropagation();
	}
	_tempInputClick = (event: TouchEvent | MouseEvent) => {
		// event.preventDefault();
		// event.stopPropagation();
	}


	left() {
		this.gridPosition.XPOS--
		this.fullRender();
	}
	right() {
		this.gridPosition.XPOS++;
		this.fullRender();
	}
	Xend() {
		this.gridPosition.XPOS = this.max.scrollLeft;
		this.fullRender();
	}
	Xstart() {
		this.gridPosition.XPOS = 0;
		this.fullRender();
	}
}
customElements.define('grid-view-el', GridView);


	// var newVDOM = [];
	// var colWidth = [];
	// var rowHeight = [];

	// var _VDOM_STATE_ARR: any[] = [];

	// var hasVirtualDOM = false;


	// if (this.LastVirtualGRID instanceof Array && this.LastVirtualGRID.length > 0) {
	// 	hasVirtualDOM = true;
	// }

	// var col_flag_length = colFrag.array.length;
	// var row_flag_length = rowFrag.array.length;

	// var documentFrag = document.createDocumentFragment();
	// for (let row_index = 0; row_index < row_flag_length; row_index++) {
	// 	if (!(rowHeight[row_index] && rowHeight[row_index] > rowFrag.array[row_index].height)) {
	// 		rowHeight[row_index] = rowFrag.array[row_index].height;
	// 	}
	// 	for (let col_index = 0; col_index < col_flag_length; col_index++) {
	// 		if (!(colWidth[col_index] && colWidth[col_index] > colFrag.array[col_index].width)) {
	// 			colWidth[col_index] = colFrag.array[col_index].width;
	// 		}

	// 		let cell_object: any = {}
	// 		cell_object.uniqueId = 'c' + colFrag.array[col_index].colIndex + '_r' + rowFrag.array[row_index].rowIndex;
	// 		cell_object.column = colFrag.array[col_index];
	// 		cell_object.row = rowFrag.array[row_index];
	// 		cell_object.col_pos = col_index;
	// 		cell_object.row_pos = row_index;
	// 		newVDOM.push(cell_object);
	// 		let Obj: any = {};
	// 		if (hasVirtualDOM) {

	// 			let index = this.LastVirtualGRID.findIndex(_oldVD => _oldVD.uniqueId === cell_object.uniqueId);

	// 			if (index === -1) {
	// 				Obj = { 'state': 'CREATE', 'id': cell_object.uniqueId, 'data': cell_object, element: null };
	// 				Obj.element = document.createElement('grid-cell-el');
	// 				Obj.element.setAttribute('data-id', Obj.id);

	// 			} else {
	// 				Obj = { 'state': 'KEEP', 'id': cell_object.uniqueId, 'data': cell_object, element: null };
	// 				Obj.element = this.elGridRenderWrapper.children[index];
	// 				// console.log('fl_two')
	// 			}
	// 		} else {
	// 			Obj = { 'state': 'CREATE', 'id': cell_object.uniqueId, 'data': cell_object, element: null };
	// 			Obj.element = document.createElement('grid-cell-el');
	// 			Obj.element.setAttribute('data-id', Obj.id);
	// 			// console.log('fl_three')
	// 		}


	// 		_VDOM_STATE_ARR.push(Obj);
	// 	}
	// }

	// let t_width = 0;
	// let t_height = 0;
	// this.elGridRenderWrapper.innerHTML = '';
	// let vdom_staet_len = _VDOM_STATE_ARR.length;
	// for (var vdom_index = 0; vdom_index < vdom_staet_len; vdom_index++) {
	// 	_VDOM_STATE_ARR[vdom_index].element.cellData = _VDOM_STATE_ARR[vdom_index].data;
	// 	documentFrag.appendChild(_VDOM_STATE_ARR[vdom_index].element);

	// }
	// this.elGridRenderWrapper.appendChild(documentFrag);
	// this.elGridRenderWrapper.style.gridTemplateColumns = colWidth.map((x) => { t_width += x; return x + 'px' }).join(' ').trim();
	// this.elGridRenderWrapper.style.gridTemplateRows = rowHeight.map((x) => { t_height += x; return x + 'px' }).join(' ').trim()
	// this.elGridRenderWrapper.style.width = t_width + 'px';
	// this.elGridRenderWrapper.style.height = t_height + 'px';

	// this.elGridRenderWrapper.style.left = '-' + colFrag.firstLossAmount + 'px';
	// this.elGridRenderWrapper.style.top = '-' + rowFrag.firstLossAmount + 'px';


	// this.LastVirtualGRID = newVDOM;


	// var itrEl = this.elGridRenderWrapper.firstElementChild;
	// while (itrEl) {
	// 	const _st = _VDOM_STATE_OBJ[itrEl.dataSet.uniqueId];
	// 	if (_st && _st.STATE === 'KEEP') {
	// 		_st.element = itrEl;
	// 	}
	// 	itrEl = itrEl.nextElementSibling;
	// }

	// let vdom_staet_len = _VDOM_STATE_ARR.length;
	// for (var vdom_index = 0; vdom_index < vdom_staet_len; vdom_index++) {
	// 	_VDOM_STATE_ARR[vdom_index];

	// }






	// el ?  el.nextElementSibling : this.elGridRenderWrapper.firstElementChild;





	// var randomArr = [];
	// randomArr.push(_VDOM_STATE_ARR[_VDOM_STATE_ARR.length - 1].ID);
	// randomArr.push(_VDOM_STATE_ARR[Math.round(_VDOM_STATE_ARR.length / 2)].ID);
	// randomArr.push(_VDOM_STATE_ARR[Math.round(_VDOM_STATE_ARR.length / 3)].ID);
	// randomArr.push(_VDOM_STATE_ARR[Math.round(_VDOM_STATE_ARR.length / 4)].ID);
	// for (var x in randomArr) {
	// 	perfomanceCheck(x + 1, randomArr[x]);
	// }


	// function perfomanceCheck(times, item){
	// 	console.log('___________'  +times+ ' Itration_____________');
	// 	let usingObj_start = performance.now();
	// 	let obj_target = _VDOM_STATE_OBJ[item];
	// 	let usingObj_end = performance.now();

	// 	let usingArr_start = performance.now();
	// 	let arr_target = _VDOM_STATE_ARR.find( x => x.ID === item );
	// 	let usingArr_end = performance.now();

	// 	console.log('USING OBJ',usingObj_end - usingObj_start,obj_target);
	// 	console.log('USING ARR',usingArr_end - usingArr_start, arr_target);
	// }


	// updateViewPort() {
	// 	//need to update on window resize  or view port size change
	// 	this.gridViewWidth = this.elGridView.clientWidth;
	// 	this.gridViewHeight = this.elGridView.clientHeight;

	// 	const scroll_thick = this.elGridView.offsetHeight - this.elGridView.clientHeight;

	// 	this.elSerialColFixed.style.bottom = scroll_thick + 'px';
	// 	this.elHeadingRowFixed.style.right = scroll_thick + 'px';

	// 	this.idealRenderWidth = this.gridViewWidth * 1.2;
	// 	this.idealRenderHeight = this.gridViewHeight * 1.2;


	// 	if (this.gridTotalWidth < this.idealRenderWidth && this.gridTotalWidth > this.gridViewWidth) {
	// 		this.idealRenderWidth = this.gridTotalWidth;
	// 	} else if (this.gridTotalWidth < this.gridViewWidth) {
	// 		this.idealRenderWidth = this.gridViewWidth;
	// 	}

	// 	if (this.gridTotalHeight < this.idealRenderHeight && this.gridTotalHeight > this.gridViewHeight) {
	// 		this.idealRenderHeight = this.gridTotalHeight;
	// 	} else if (this.gridTotalHeight < this.gridViewHeight) {
	// 		this.idealRenderHeight = this.gridViewHeight;
	// 	}

	// 	if (this.gridTotalWidth > this.VG_MAX_RENDER_LIMIT) {
	// 		this.gridTotalRenderWidth = this.VG_MAX_RENDER_LIMIT;
	// 		this.horizontalScrollRatio = (this.gridTotalWidth - this.gridViewWidth) / (this.VG_MAX_RENDER_LIMIT - this.gridViewWidth);
	// 	} else {
	// 		this.gridTotalRenderWidth = this.gridTotalWidth;
	// 		this.horizontalScrollRatio = 1;
	// 	}

	// 	if (this.gridTotalHeight > this.VG_MAX_RENDER_LIMIT) {
	// 		this.gridTotalRenderHeight = this.VG_MAX_RENDER_LIMIT;
	// 		this.verticleScrollRatio = (this.gridTotalHeight - this.gridViewWidth) / (this.VG_MAX_RENDER_LIMIT - this.gridViewWidth);
	// 	} else {
	// 		this.gridTotalRenderHeight = this.gridTotalHeight;
	// 		this.verticleScrollRatio = 1;
	// 	}

	// 	this.max.scrollLeft = (this.gridTotalRenderWidth - this.gridViewWidth);
	// 	this.max.scrollTop = (this.gridTotalRenderHeight - this.gridViewHeight);

	// 	this.widthScrollMoveRatio = (this.idealRenderWidth - this.gridViewWidth) / this.max.scrollLeft;
	// 	this.heighScrollMoveRatio = (this.idealRenderHeight - this.gridViewHeight) / this.max.scrollTop;


	// 	this.lastScrollLeft = this.lastScrollLeft < this.max.scrollLeft ? this.lastScrollLeft : this.max.scrollLeft;
	// 	this.lastScrollTop = this.lastScrollTop < this.max.scrollTop ? this.lastScrollTop : this.max.scrollTop;

	// 	// this.renderViewPort();
	// }
	// renderViewPort() {
	// 	//call on scroll
	// 	this.elGridContainer.style.display = "none";

	// 	let horizontalStartPoint = this.lastScrollLeft - (this.lastScrollLeft * this.widthScrollMoveRatio);
	// 	horizontalStartPoint = Math.ceil(horizontalStartPoint);
	// 	let horizontalEndPoint = horizontalStartPoint + this.idealRenderWidth;
	// 	let columnStr = `${horizontalStartPoint}px ${this.idealRenderWidth}px ${this.gridTotalRenderWidth - horizontalEndPoint}px`

	// 	let verticleStartPoint = this.lastScrollTop - (this.lastScrollTop * this.heighScrollMoveRatio);
	// 	verticleStartPoint = Math.ceil(verticleStartPoint);
	// 	let verticleEndPoint = verticleStartPoint + this.idealRenderHeight;
	// 	let rowStr = `${verticleStartPoint}px ${this.idealRenderHeight}px ${this.gridTotalRenderHeight - verticleEndPoint}px`

	// 	//@ts-ignore
	// 	this.elGridContainer.style.width = this.gridTotalRenderWidth + 'px';
	// 	//@ts-ignore
	// 	this.elGridContainer.style.gridTemplateColumns = columnStr;

	// 	//@ts-ignore
	// 	this.elGridContainer.style.height = this.gridTotalRenderHeight + 'px';
	// 	//@ts-ignore
	// 	this.elGridContainer.style.gridTemplateRows = rowStr;

	// 	let colFrag = this.lookupColIndexByPosition(this.lastScrollLeft, this.idealRenderWidth);
	// 	let rowFrag = this.lookupRowIndexByPosition(this.lastScrollTop, this.idealRenderHeight);
	// 	this.updateUsingVirtualDOM(colFrag, rowFrag)

	// 	this.elGridContainer.style.display = "";
	// }
