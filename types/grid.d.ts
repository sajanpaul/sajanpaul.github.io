
export interface IGridMeta {
	fixedColumns?: IGridColumn[];
	rows: IGridRow[];
	columns: IGridColumn[];
	showTitle: boolean,
}
export interface IDataReference {
	columns: IGridColumn[],
	fixedColumns: IGridColumn[],
	scrollColumns: IGridColumn[],
	visibleColumns: IGridColumn[],
	rows: IGridRow[],
	cellData: ICellData[],
	activeFocus: {
		column_unique_id: string,
		row_unique_id: string,
	} | null

}
export interface ICellData {
	column_unique_id: string,
	row_unique_id: string,
	value: string,
}


export interface IGridColumn {
	col_index: number; //index of current view exclude fixed column
	column_unique_id: string;// unique id of column include column type for lookup purpose
	column_name: string; // display name
	isVisible: boolean;
	isFixedInfoColumn: boolean;
	order: number; // 0 for neutral
	isReadOnly: boolean,
	showEmpty: boolean,
	width: number;
}





export interface IGridRow { //includes sample rows
	row_index: number; // index of current view - include all rows sample rows
	row_unique_id: string
	height: number; //height of row
}



export interface IColFrag {
	firstLossAmount: number;
	indexStart: number;
	indexEnd: number;
	array: IGridColumn[]
}
export interface IRowFrag {
	firstLossAmount: number;
	indexStart: number;
	indexEnd: number;
	array: IGridRow[]
}
export interface IPositionMap {
	position: number;
	index: number;
	lastpos: number;
}

export interface ICellPack {
	uniqueId: string;
	column: IGridColumn;
	row: IGridRow;
	col_pos: number;
	row_pos: number;
}
export interface IFCMapper {
	vDOM: ICellPack[];
	col: IGridColumn;
	elView: HTMLElement;
	elWrapper: HTMLElement;
	docFrag: DocumentFragment;
}
