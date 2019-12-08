
import { GridCell } from './grid-cell.el.js';
import { ColumnHead } from './column-head.el.js';
import { IGridMeta, ICellPack, IColFrag, IRowFrag, IPositionMap, IFCMapper, IGridColumn, IGridRow } from '../../../types/grid.d';
import { setGridViewReference, getMeta } from '../../lib/util.js';

/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Grid Element
*/

export class GridView extends HTMLElement {

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
	UIScrollbar = {
		availableSize: {
			hRail: <number>0,
			vRail: <number>0,
		},
		ratio: {
			vSb_height: <number>1,
			hSb_width: <number>1,
		},
		show: {
			vThumb: <boolean>true,
			hThumb: <boolean>true,
		},
		size: {
			vThumb_height: <number>0,
			hThumb_width: <number>0,
		},
		positionRatio: {
			vSb_height: <number>1,
			hSb_width: <number>1,
		},
		minThumbSize: 20
	}


	layoutConfig = {
		serialColumnWidth: <number>60,
		tldocBarHeight: <number>40,
		headingBarHeight: <number>40,
		applyBarHeight: <number>0,
	}


	el = {
		gridLayout: <HTMLElement>null,
		gridTouchLayer: <HTMLElement>null,
		tldoc: {
			tldocGlue: <HTMLElement>null,
			tldocTitle: <HTMLElement>null,
			tldocHeadingView: <HTMLElement>null,
			tldocHeadingWrapper: <HTMLElement>null
		},
		reportIcon: <HTMLElement>null,
		fixedhead: {
			head1: <HTMLElement>null,
			head2: <HTMLElement>null,
			head3: <HTMLElement>null,
		},
		fixedHeadHolder: {
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
		scrollbar: {
			rail: {
				horizontal: <HTMLElement>null,
				vertical: <HTMLElement>null,
			},
			thumb: {
				horizontal: <HTMLElement>null,
				vertical: <HTMLElement>null,
			}
		}
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
		touchStopProp: false,
	}

	LastVirtualGRID: any[] | null = null;




	constructor() {

		super();

	}

	connectedCallback() {
		setGridViewReference(this);
		// this.style.display = "none";
		this.innerHTML = /* html */ `
			<div class="grid-touch-layer" data-render-el="grid-touch-layer"></div>
			<div class="grid-layout" data-render-el="grid-layout">
				<div class="grid-layout-child tldoc-row-item" style="grid-column:1/2;grid-row:1/2" data-render-el="grid-tldoc-glue">
					<div class="standalone-block sb-empty-block"></div>
				</div>
				<div class="grid-layout-child tldoc-row-item" style="grid-column:2/5;grid-row:1/2" data-render-el="grid-tldoc-title">
				<div class="standalone-block sb-tldoc-control">
					<div class="tldoc-list-name"> Document Title</div>
				</div>
				</div>
				<div class="grid-layout-child tldoc-row-item" style="grid-column:5/6;grid-row:1/2" data-render-el="grid-tldoc-heading-view">
					<div class="wrapper-dimension" data-render-el="grid-tldoc-heading-wrapper">
						<div class="standalone-block sb-tldoc-list">
								<div class="tldoc-list-name"> Document Name</div>
						</div>
					</div>
				</div>

				<div class="grid-layout-child head-row-item" style="grid-column:1/2;grid-row:2/3" data-render-el="grid-report-icon">
					<div class="standalone-block sb-sl-no" >
							<div class="sl-no-head">SL.NO</div>
					</div>
				</div>
				<div class="grid-layout-child head-row-item" style="grid-column:2/3;grid-row:2/3"  data-render-el="grid-fixed-head-1">
					<div class="standalone-block sb-fixed-head" data-render-el="grid-fixed-head-holder-1">
							head one
					</div>
				</div>
				<div class="grid-layout-child head-row-item " style="grid-column:3/4;grid-row:2/3" data-render-el="grid-fixed-head-2" >
					<div class="standalone-block sb-fixed-head"  data-render-el="grid-fixed-head-holder-2">
							head two
					</div>
				</div>
				<div class="grid-layout-child head-row-item" style="grid-column:4/5;grid-row:2/3" data-render-el="grid-fixed-head-3" >
					<div class="standalone-block sb-fixed-head"  data-render-el="grid-fixed-head-holder-3">
							head three
					</div>
				</div>
				<div class="grid-layout-child head-row-item hide-overflow-x" style="grid-column:5/6;grid-row:2/3" data-render-el="grid-heading-view">
					<div class="wrapper-dimension" data-render-el="grid-heading-wrapper">heading List</div>
				</div>

				<div class="grid-layout-child apply-row-item" style="grid-column:1/2;grid-row:3/4" data-render-el="grid-sl-no">
				<div class="standalone-block sb-empty-block"></div>
				</div>
				<div class="grid-layout-child apply-row-item" style="grid-column:2/5;grid-row:3/4" data-render-el="grid-apply-all">
					<div class="standalone-block sb-apply-for-all" >
							<div class="apply-for-all-head"> Apply for All.</div>
					</div>
				</div>
				<div class="grid-layout-child apply-row-item hide-overflow-x" style="grid-column:5/6;grid-row:3/4" data-render-el="grid-apply-heading-view">
					<div class="wrapper-dimension" data-render-el="grid-apply-heading-wrapper">
					</div>
				</div>

				<div class="grid-layout-child body-row-item hide-overflow-y" style="grid-column:1/2;grid-row:3/5" data-render-el="grid-fixed-body-serial-view">
					<div class="wrapper-dimension" data-render-el="grid-fixed-body-serial-wrapper"></diV>
				</div>
				<div class="grid-layout-child body-row-item  hide-overflow-y" style="grid-column:2/3;grid-row:3/5" data-render-el="grid-fixed-body1-view">
					<div class="wrapper-dimension" data-render-el="grid-fixed-body1-wrapper"></div>
				</div>
				<div class="grid-layout-child body-row-item hide-overflow-y" style="grid-column:3/4;grid-row:3/5" data-render-el="grid-fixed-body2-view">
					<div class="wrapper-dimension" data-render-el="grid-fixed-body2-wrapper"></div>
				</div>
				<div class="grid-layout-child body-row-item hide-overflow-y" style="grid-column:4/5;grid-row:3/5" data-render-el="grid-fixed-body3-view">
					<div class="wrapper-dimension" data-render-el="grid-fixed-body3-wrapper"></div>
				</div>
				<div class="grid-layout-child body-row-item border-left hide-overflow-x-y" style="grid-column:5/6;grid-row:3/5" data-render-el="grid-body-view">
					<div class="wrapper-dimension" data-render-el="grid-body-wrapper"></div>
				</div>
			</div>
			<div class="vertical-scroll-bar"  data-render-el="grid-scrollbar-rail-vertical">
				<div class="scroll-dragger" data-render-el="grid-scrollbar-thumb-vertical"></div>
			</div>
			<div class="horizontal-scroll-bar"  data-render-el="grid-scrollbar-rail-horizontal">
				<div class="scroll-dragger"  data-render-el="grid-scrollbar-thumb-horizontal"></div>
			</div>
			<div class="scroll-cross"></div>
		`;
		this.el.gridTouchLayer = this.querySelector('[data-render-el="grid-touch-layer"]');
		this.el.gridLayout = this.querySelector('[data-render-el="grid-layout"]');
		this.el.tldoc.tldocGlue = this.querySelector('[data-render-el="grid-tldoc-glue"]');
		this.el.tldoc.tldocTitle = this.querySelector('[data-render-el="grid-tldoc-title"]');
		this.el.tldoc.tldocHeadingView = this.querySelector('[data-render-el="grid-tldoc-heading-view"]');
		this.el.tldoc.tldocHeadingWrapper = this.querySelector('[data-render-el="grid-tldoc-heading-wrapper"]');

		this.el.reportIcon = this.querySelector('[data-render-el="grid-report-icon"]');

		this.el.fixedhead.head1 = this.querySelector('[data-render-el="grid-fixed-head-1"]');
		this.el.fixedhead.head2 = this.querySelector('[data-render-el="grid-fixed-head-2"]');
		this.el.fixedhead.head3 = this.querySelector('[data-render-el="grid-fixed-head-3"]');

		this.el.fixedHeadHolder.head1 = this.querySelector('[data-render-el="grid-fixed-head-holder-1"]');
		this.el.fixedHeadHolder.head2 = this.querySelector('[data-render-el="grid-fixed-head-holder-2"]');
		this.el.fixedHeadHolder.head3 = this.querySelector('[data-render-el="grid-fixed-head-holder-3"]');

		this.el.headingListView = this.querySelector('[data-render-el="grid-heading-view"]');
		this.el.headingListWrapper = this.querySelector('[data-render-el="grid-heading-wrapper"]');

		this.el.slNo = this.querySelector('[data-render-el="grid-sl-no"]');
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


		this.el.scrollbar.rail.horizontal = this.querySelector('[data-render-el="grid-scrollbar-rail-horizontal"]');
		this.el.scrollbar.rail.vertical = this.querySelector('[data-render-el="grid-scrollbar-rail-vertical"]');

		this.el.scrollbar.thumb.horizontal = this.querySelector('[data-render-el="grid-scrollbar-thumb-horizontal"]');
		this.el.scrollbar.thumb.vertical = this.querySelector('[data-render-el="grid-scrollbar-thumb-vertical"]');


		this.el.gridLayout.addEventListener('wheel', this.handleGridWheel);

		this.el.scrollbar.thumb.horizontal.addEventListener('mousedown', this.horizontal_thumb_mousedown, { capture: false });
		this.el.scrollbar.thumb.vertical.addEventListener('mousedown', this.vertical_thumb_mousedown, { capture: false });

		this.el.scrollbar.rail.horizontal.addEventListener('mousedown', this.horizontal_rail_mousedown, { capture: false });
		this.el.scrollbar.rail.vertical.addEventListener('mousedown', this.vertical_rail_mousedown, { capture: false })


		window.addEventListener('resize', this.resizeHandler);
		this.gridInit();
	}

	disconnectedCallback() {
		setGridViewReference(null);
		this.el.gridLayout.removeEventListener('wheel', this.handleGridWheel);
		this.el.scrollbar.thumb.horizontal.removeEventListener('mousedown', this.horizontal_thumb_mousedown, { capture: false });
		this.el.scrollbar.thumb.vertical.removeEventListener('mousedown', this.vertical_thumb_mousedown, { capture: false });


		this.el.scrollbar.rail.horizontal.removeEventListener('mousedown', this.horizontal_rail_mousedown, { capture: false });
		this.el.scrollbar.rail.vertical.removeEventListener('mousedown', this.vertical_rail_mousedown, { capture: false })

		window.removeEventListener('resize', this.resizeHandler);


	}

	attributeChangedCallback(attrName: any, oldVal: any, newVal: any) {

	}

	adoptedCallback() {

	}

	gridInit() {
		if (this.el.gridLayout && this.GRID_META) {
			this.style.display = 'block';
			this.updateLayout();
		}
	}

	public activeGridRender() {
		let meta = getMeta();
		this.GRID_META = {
			columns: meta.visibleColumns,
			rows: meta.rows,
			fixedColumns: meta.fixedColumns,
			showTitle: false,
		};
		this.gridInit();
	}


	updateLayout() {
		// When the layout is updated new fixed column row etc

		var layout_column_ar = [];
		var layout_row_ar = [];
		layout_column_ar.push(this.layoutConfig.serialColumnWidth + 'px');
		for (var x = 0; x < 3; x++) {
			if (this.GRID_META.fixedColumns[x]) {
				layout_column_ar.push(this.GRID_META.fixedColumns[x].width + 'px');
				((this.el.fixedhead as any)[('head' + (x + 1))] as HTMLElement).style.display = '';
				((this.el.fixedBody as any)[('body' + (x + 1) + 'View')] as HTMLElement).style.display = '';
			} else {
				((this.el.fixedhead as any)[('head' + (x + 1))] as HTMLElement).style.display = 'none';
				((this.el.fixedBody as any)[('body' + (x + 1) + 'View')] as HTMLElement).style.display = 'none';
				layout_column_ar.push(0 + 'px');
			}
		}

		if (this.GRID_META.fixedColumns.length === 0) {
			this.el.tldoc.tldocTitle.style.display = 'none';
			this.el.applyAll.style.display = 'none';
		} else {
			this.el.tldoc.tldocTitle.style.display = '';
			this.el.applyAll.style.display = '';
		}

		layout_column_ar.push('auto');


		if (this.GRID_META.showTitle) {
			layout_row_ar.push(this.layoutConfig.tldocBarHeight + 'px');
			this.el.tldoc.tldocGlue.style.display = '';
			if (this.GRID_META.fixedColumns.length === 0) {
				this.el.tldoc.tldocTitle.style.display = 'none';
			} else {
				this.el.tldoc.tldocTitle.style.display = '';
			}
			this.el.tldoc.tldocHeadingView.style.display = '';
		} else {
			layout_row_ar.push(0 + 'px');
			this.el.tldoc.tldocGlue.style.display = 'none';
			this.el.tldoc.tldocTitle.style.display = 'none';
			this.el.tldoc.tldocHeadingView.style.display = 'none';

		}
		layout_row_ar.push(this.layoutConfig.headingBarHeight + 'px');
		layout_row_ar.push(this.layoutConfig.applyBarHeight + 'px');

		this.el.slNo.style.display = 'none';
		this.el.applyAll.style.display = 'none';
		this.el.applyHeadingView.style.display = 'none';
		this.el.applyHeadingWrapper.style.display = 'none';

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

		let _tWidth = 0;
		let _tHeight = 0;

		let _arr_tl = this.GRID_META.columns.length;
		for (let col_index = 0; col_index < _arr_tl; col_index++) {
			_tWidth = _tWidth + this.GRID_META.columns[col_index].width;
		}
		_arr_tl = this.GRID_META.rows.length;
		for (let row_index = 0; row_index < _arr_tl; row_index++) {
			_tHeight = _tHeight + this.GRID_META.rows[row_index].height;
		}
		this.gridSize.width = _tWidth
		this.gridSize.height = _tHeight;
		this.updateViewPort();
	}


	updateViewPort() {
		//need to update on window resize  or view port size change
		this.renderGridSize.width = this.el.gridBodyView.clientWidth;
		this.renderGridSize.height = this.el.gridBodyView.clientHeight;

		this.UIScrollbar.availableSize.hRail = this.el.scrollbar.rail.horizontal.clientWidth;
		this.UIScrollbar.availableSize.vRail = this.el.scrollbar.rail.vertical.clientHeight;


		this.max.scrollLeft = (this.gridSize.width - this.renderGridSize.width);
		this.max.scrollTop = (this.gridSize.height - this.renderGridSize.height);

		if (this.max.scrollLeft < 0) {
			this.max.scrollLeft = 0;

			this.UIScrollbar.show.hThumb = false;
			this.el.scrollbar.thumb.horizontal.style.display = 'none';
		} else {
			this.max.scrollLeft = this.max.scrollLeft;

			this.UIScrollbar.show.hThumb = true;
			let part = this.gridSize.width / this.renderGridSize.width;
			let thumb_width = this.UIScrollbar.availableSize.hRail / part;
			if (thumb_width < this.UIScrollbar.minThumbSize) {
				this.UIScrollbar.ratio.hSb_width = this.UIScrollbar.minThumbSize / thumb_width
			} else {
				this.UIScrollbar.ratio.hSb_width = 1;
			}
			this.UIScrollbar.size.hThumb_width = thumb_width * this.UIScrollbar.ratio.hSb_width;
			this.el.scrollbar.thumb.horizontal.style.width = this.UIScrollbar.size.hThumb_width + 'px';
			this.el.scrollbar.thumb.horizontal.style.display = '';

			this.UIScrollbar.positionRatio.hSb_width = (this.UIScrollbar.availableSize.hRail - this.UIScrollbar.size.hThumb_width) / this.max.scrollLeft;
		}

		if (this.max.scrollTop < 0) {
			this.max.scrollTop = 0;

			this.UIScrollbar.show.vThumb = false;
			this.el.scrollbar.thumb.vertical.style.display = 'none';
		} else {
			this.max.scrollTop = this.max.scrollTop;

			this.UIScrollbar.show.vThumb = true;
			let part = this.gridSize.height / this.renderGridSize.height;
			var thumb_height = this.UIScrollbar.availableSize.vRail / part;
			if (thumb_height < this.UIScrollbar.minThumbSize) {
				this.UIScrollbar.ratio.vSb_height = this.UIScrollbar.minThumbSize / thumb_height
			} else {
				this.UIScrollbar.ratio.vSb_height = 1;
			}
			this.UIScrollbar.size.vThumb_height = thumb_height * this.UIScrollbar.ratio.vSb_height;
			this.el.scrollbar.thumb.vertical.style.height = this.UIScrollbar.size.vThumb_height + 'px';
			this.el.scrollbar.thumb.vertical.style.display = '';
			this.UIScrollbar.positionRatio.vSb_height = (this.UIScrollbar.availableSize.vRail - this.UIScrollbar.size.vThumb_height) / this.max.scrollTop;
		}



		this.gridPosition.XPOS = this.gridPosition.XPOS < this.max.scrollLeft ? this.gridPosition.XPOS : this.max.scrollLeft;
		this.gridPosition.YPOS = this.gridPosition.YPOS < this.max.scrollTop ? this.gridPosition.YPOS : this.max.scrollTop;
		this._updateBookMark()
		/*`
		 NOTE view port changes occur by many reason including  landscape/portrait switching
		 triggering  this.fullRender()   wouldn't be  nice for some situations

		*/

		this.fullRender();
		this.updateScrollBarUI();
	}




	private _updateBookMark() {

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

	private fixedColumnRender() {
		this.GRID_META.fixedColumns.forEach((col, index) => {
			let headingEl: ColumnHead = document.createElement('column-head') as ColumnHead;
			headingEl.isFixedColumn = true;
			headingEl.head = col;
			let el = ((this.el.fixedHeadHolder as any)['head' + (index + 1)] as HTMLElement);
			el.innerHTML = '';
			el.appendChild(headingEl);

		})
	}

	private fullRender() {
		//Update entire view
		let viewPortWidth = Math.min(this.renderGridSize.width, this.gridSize.width);
		let viewPortHeight = Math.min(this.renderGridSize.height, this.gridSize.height);
		let colFrag: IColFrag = this.lookup_col_fullRecursive(this.gridPosition.XPOS, this.gridPosition.XPOS + viewPortWidth);
		let rowFrag: IRowFrag = this.lookup_row_fullRecursive(this.gridPosition.YPOS, this.gridPosition.YPOS + viewPortHeight);
		let newVDOM: ICellPack[] = [];

		let colWidth: number[] = [];
		let rowHeight: number[] = [];

		let col_flag_length: number = colFrag.array.length;
		let row_flag_length: number = rowFrag.array.length;

		let gridDocFrag = document.createDocumentFragment();
		let seraiDocFrag = document.createDocumentFragment();
		let headingDocFrag = document.createDocumentFragment();
		let applyDocFrag = document.createDocumentFragment();
		let serialVM = [];

		let fixedColumMapper: IFCMapper[] = this.GRID_META.fixedColumns.map((col: IGridColumn, _ind: number): IFCMapper => {
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

				let element: GridCell = document.createElement('grid-cell-el') as GridCell;
				element.cellData = cell_object;

				gridDocFrag.appendChild(element);
			}

			for (let fragIndex: number = 0; fragIndex < fixedColumMapper.length; fragIndex++) {
				let cell_object: ICellPack = this.createCellPack(fixedColumMapper[fragIndex].col, rowFrag.array[row_index], fragIndex, row_index);
				fixedColumMapper[fragIndex].vDOM.push(cell_object);
				let element: GridCell = document.createElement('grid-cell-el') as GridCell;
				element.cellData = cell_object;
				fixedColumMapper[fragIndex].docFrag.appendChild(element);
			}
			serialVM.push(rowFrag.array[row_index].row_index + 1)
			let serial_span = document.createElement('span');
			serial_span.classList.add('serial-cell');
			serial_span.innerText = (rowFrag.array[row_index].row_index + 1) + '';
			seraiDocFrag.appendChild(serial_span);

		}
		for (let head_col_index = 0; head_col_index < col_flag_length; head_col_index++) {
			// FIXME RE WRITE THIS
			colFrag.array[head_col_index];
			let headingEl: ColumnHead = document.createElement('column-head') as ColumnHead;
			// let applyAdj: ColumnHeadApply = document.createElement('column-head-apply') as ColumnHeadApply;

			headingEl.isOnlyColumn = col_flag_length === 1;
			headingEl.head = colFrag.array[head_col_index];

			// applyAdj.head = colFrag.array[head_col_index];

			headingDocFrag.appendChild(headingEl);
			// applyDocFrag.appendChild(applyAdj);
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
		this.el.headingListWrapper.style.height = this.layoutConfig.headingBarHeight + 'px';
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


	private partialRender() {
		//Update partial view use Virtual DOM
		this.fullRender();
	}
	private createCellPack(col: IGridColumn, row: IGridRow, renderColOrder: number, renderRowOrder: number): ICellPack {
		let cell_object: ICellPack = {} as ICellPack;
		cell_object.uniqueId = 'c' + col.col_index + '_r' + row.row_index;
		cell_object.column = col;
		cell_object.row = row;
		cell_object.col_pos = renderColOrder;
		cell_object.row_pos = renderRowOrder;
		return cell_object;
	}


	private handleGridWheel = (event: WheelEvent) => {
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
		} else if (event.ctrlKey) {
			factor = factor / 5; //slower
		}
		xDelta = Math.round(xDelta * factor);
		YDelta = Math.round(YDelta * factor);
		// console.log(`${event.altKey ? '(boosted)' : ''} x = ${xDelta},  y = ${YDelta}`);
		this.gridMoveBy(xDelta, YDelta);
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

			if (abs_YDiff > 10 && abs_XDiff < 2 || abs_YDiff > 5 && abs_XDiff < 1) {
				XDiff = 0 // consider as noise
			}

			if (abs_XDiff > 10 && abs_YDiff < 2 || abs_XDiff > 5 && abs_YDiff < 1) {
				YDiff = 0 // consider as noise
			}


			if (abs_XDiff > 2) {
				this.touchState.totalX += XDiff;
			}
			if (abs_XDiff > 2) {
				this.touchState.totalY += YDiff;
			}
			let actualMoveX = (Math.abs(this.touchState.totalX) > 4) ? XDiff : 0;
			let actualMoveY = (Math.abs(this.touchState.totalY) > 4) ? YDiff : 0;

			//TODO Change boosted value fraction (10)
			actualMoveX = (Math.abs(actualMoveX) > 3 && secondDragActiveX) ? actualMoveX * 10 : actualMoveX;
			actualMoveY = (Math.abs(actualMoveY) > 3 && secondDragActiveY) ? actualMoveY * 10 : actualMoveY;
			this.gridMoveBy(actualMoveX, actualMoveY);

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
		console.log('gridHandleTouchStart', event);
		if (event.touches[0] && (window as any).enableOverlay) {
			event.preventDefault();
			this.el.gridTouchLayer.style.display = 'block';
		}
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
	}

	gridMoveBy(_mvX: number, _mvY: number) {

		//re write this

		let moveX = 0;
		let moveY = 0;
		let _xApplied = 0;
		let _yApplied = 0;

		if (
			(this.gridPosition.XPOS <= 0 && _mvX < 0) ||
			(this.gridPosition.XPOS >= this.max.scrollLeft && _mvX > 0)
		) {
			moveX = 0;
		} else {
			_xApplied = (this.gridPosition.XPOS + _mvX);

			if (_xApplied < 0) {
				moveX = _mvX + Math.abs(_xApplied);
			} else if (_xApplied > this.max.scrollLeft) {
				moveX = _mvX - (_xApplied - this.max.scrollLeft);
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
			_yApplied = (this.gridPosition.YPOS + _mvY);
			if (_yApplied < 0) {
				moveY = _mvY + Math.abs(_yApplied);
			} else if (_yApplied > this.max.scrollTop) {
				moveY = _mvY - (_yApplied - this.max.scrollTop);
			} else {
				moveY = _mvY;
			}
		}

		this.setGridPostionBy(
			this.gridPosition.XPOS + moveX,
			this.gridPosition.YPOS + moveY,
			// Less than 90% view port is moved partial render
			((moveX / this.renderGridSize.width) < 0.9 && (moveY / this.renderGridSize.height) < 0.9)
		);


	}
	setGridPostionBy(xPosValue: number, yPosValue: number, renderPartial: boolean) {
		this.gridPosition.XPOS = xPosValue;
		this.gridPosition.YPOS = yPosValue;
		this.updateScrollBarUI();
		if (renderPartial) {
			this.partialRender();
		} else {
			this.fullRender(); // else full render
		}
	}


	resizeHandler = (event?: any) => {
		if (document.activeElement.nodeName === "INPUT" || document.activeElement.nodeName === "GRID-CELL-EL") {
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
		// console.log(row_array, 'total len',_arr_tl);
		return {
			'firstLossAmount': _first_lost_amount,
			'indexStart': _arrIndexStart,
			'indexEnd': _arrIndexEnd,
			'array': row_array
		}
	}


	_columnBookmarkFind(position: number): IPositionMap {
		let lastItemIndex: IPositionMap = { index: 0, position: 0, lastpos: 0 };
		if (this.positionBookMark.XMap.length === 0) {
			return lastItemIndex;
		}
		let xMapLength: number = this.positionBookMark.XMap.length;
		for (let index = 0; index < xMapLength; index++) {
			if (this.positionBookMark.XMap[index].position > position) {
				return lastItemIndex;
			}
			lastItemIndex = this.positionBookMark.XMap[index];
		}
		return this.positionBookMark.XMap[xMapLength - 1];
	}
	_rowBookmarkFind(position: number): IPositionMap {
		let lastItemIndex: IPositionMap = { index: 0, position: 0, lastpos: 0 };
		if (this.positionBookMark.YMap.length === 0) {
			return lastItemIndex;
		}
		let yMapLength: number = this.positionBookMark.YMap.length;
		for (let index = 0; index < yMapLength; index++) {
			if (this.positionBookMark.YMap[index].position > position) {
				return lastItemIndex;
			}
			lastItemIndex = this.positionBookMark.YMap[index];
		}
		return this.positionBookMark.YMap[yMapLength - 1];
	}

	updateScrollBarUI() {

		if (this.UIScrollbar.show.hThumb) {
			this.el.scrollbar.thumb.horizontal.style.left = this.gridPosition.XPOS * this.UIScrollbar.positionRatio.hSb_width + 'px';
		}
		if (this.UIScrollbar.show.vThumb) {
			this.el.scrollbar.thumb.vertical.style.top = this.gridPosition.YPOS * this.UIScrollbar.positionRatio.vSb_height + 'px';
		}
	}

	horizontal_rail_mousedown = (event: MouseEvent) => {
		event.stopPropagation();
		event.stopImmediatePropagation();
		let width = this.el.scrollbar.rail.horizontal.offsetWidth;
		let xPos = event.offsetX
		xPos = Math.max(0, xPos);
		xPos = Math.min(xPos, width);


		let scrollLeftPosition = Math.round(this.gridSize.width * (xPos / width)) - Math.min(this.gridSize.width, this.renderGridSize.width);
		scrollLeftPosition = Math.max(0, scrollLeftPosition);
		this.setGridPostionBy(scrollLeftPosition, this.gridPosition.YPOS, false);
	}
	vertical_rail_mousedown = (event: MouseEvent) => {
		event.stopPropagation();
		event.stopImmediatePropagation();
		let height = this.el.scrollbar.rail.vertical.offsetHeight;
		let yPos = event.offsetY
		yPos = Math.max(0, yPos);
		yPos = Math.min(yPos, height);

		let scrollTopPosition = Math.round(this.gridSize.height * (yPos / height)) - Math.min(this.gridSize.height, this.renderGridSize.height);
		scrollTopPosition = Math.max(0, scrollTopPosition);
		this.setGridPostionBy(this.gridPosition.XPOS, scrollTopPosition, false);
	}


	horizontal_thumb_mousedown = (event: MouseEvent) => {
		event.stopPropagation();
		event.stopImmediatePropagation();
		document.documentElement.style.userSelect = 'none';
		document.addEventListener('mousemove', this.horizontal_thumb_body_mousemove, { capture: true })
		document.addEventListener('mouseup', this.horizontal_thumb_body_mouseup, { capture: true })
	}

	horizontal_thumb_body_mousemove = (event: MouseEvent) => {
		let move = event.movementX / this.UIScrollbar.positionRatio.hSb_width;
		this.gridMoveBy(move, 0);
	}

	horizontal_thumb_body_mouseup = (event: MouseEvent) => {
		document.documentElement.style.userSelect = '';
		document.removeEventListener('mousemove', this.horizontal_thumb_body_mousemove, { capture: true });
		document.removeEventListener('mouseup', this.horizontal_thumb_body_mouseup, { capture: true });
	}


	vertical_thumb_mousedown = (event: MouseEvent) => {
		event.stopPropagation();
		event.stopImmediatePropagation();
		document.documentElement.style.userSelect = 'none';
		document.addEventListener('mousemove', this.vertical_thumb_body_mousemove, { capture: true })
		document.addEventListener('mouseup', this.vertical_thumb_body_mouseup, { capture: true })
	}

	vertical_thumb_body_mousemove = (event: MouseEvent) => {
		let move = event.movementY / this.UIScrollbar.positionRatio.vSb_height;
		this.gridMoveBy(0, move);
	}

	vertical_thumb_body_mouseup = (event: MouseEvent) => {
		document.documentElement.style.userSelect = '';
		document.removeEventListener('mousemove', this.vertical_thumb_body_mousemove, { capture: true })
		document.removeEventListener('mouseup', this.vertical_thumb_body_mouseup, { capture: true })
	}
}
customElements.define('grid-view-el', GridView);
