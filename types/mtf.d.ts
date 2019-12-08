export interface IMTF {
	premiseList: IPremise[];
	responseList: IResponse[];
}
export interface IResponse {
	id: number;
	premiseRef?: IPremise;
	text: string;
	element?: HTMLElement;
	sortKey?: number;
	indexedID?: number;

}
export interface IPremise {
	id: number;
	responseRef?: IResponse;
	text: string;
	element?: HTMLElement;
	sortKey?: number;
	indexedID?: number;

}
export interface IBlockLayout{
	index: number;
	left:number;
	right:number;
	top:number;
	bottom:number;
	rect:DOMRect;
}

export type IMTFBlockType= 'premise' | 'response' | null;
