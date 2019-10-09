export interface IGridMeta {
	'trail_details': any;
	'information_trait': any;
	'columns': IGridColumn[];
	'rows': IGridRow[];
	'showpestBAR': boolean;
	'showApplyAll': boolean,
	'fixedCol': IGridColumn[];
}
export interface IGridColumn {
	col_index: number;
	column_name: string;
	type: 'infocol' | 'datacol';
	width: number;
}
export interface IGridRow {
	row_index: number;
	row_name: string;
	type: 'row';
	height: number;
}

export interface IColFrag {
	firstLossAmount: number,
	indexStart: number,
	indexEnd: number,
	array: IGridColumn[]
}
export interface IRowFrag {
	firstLossAmount: number,
	indexStart: number,
	indexEnd: number,
	array: IGridRow[]
}
export interface IPositionMap {
	position: number;
	index: number;
	lastpos: number;
}

export interface ICellPack {
	uniqueId: string;
	column: IGridColumn,
	row: IGridRow
	col_pos: number
	row_pos: number
}
export interface IFCMapper {
	vDOM: ICellPack[],
	col: IGridColumn,
	elView: HTMLElement,
	elWrapper: HTMLElement,
	docFrag:DocumentFragment,
}
