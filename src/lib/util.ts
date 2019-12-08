/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Cross component utility collection 
*/


import { ConfigPopupPanel } from './../app/panels/config-popup-panel';
import { IDataReference } from './../../types/grid.d';
import { GridView } from './../app/elements/grid-view-el';
import { RouterElement } from './router';

export function deepCopy<T>(input: T): T {
	return JSON.parse(JSON.stringify(input))
}
export let RouterUtil = {
	target: null as RouterElement,
	navigate: (url: string, replace?: boolean, forceReload?: boolean) => {
		if (RouterUtil.target) {
			RouterUtil.target.navigate(url, replace, forceReload);
		}
	},
	reload: () => {
		if (RouterUtil.target) {
			RouterUtil.target.reload();
		}
	},
	castParam: (input: any): string => {
		if (typeof input === 'object') {
			return encodeURIComponent(btoa(JSON.stringify(input)));
		} else {
			return encodeURIComponent(btoa((input + '')));
		}
	},
	readParam: (input: string): any => {
		let str = atob(decodeURIComponent(input));
		try {
			return JSON.parse(str);
		} catch (e) {
			return str;
		}
	}
};







export function setMeta(meta: IDataReference) {
	if (!(window as any)['__store']) {
		(window as any)['__store'] = {};
	}
	(window as any)['__store']['__meta'] = meta
}

export function getMeta(): IDataReference {
	try {
		return (window as any)['__store']['__meta'] as IDataReference;
	} catch (e) {
		console.error('Meta View lookup error');
		return null;
	}
}


export function setGridViewReference(Ref: GridView | null) {
	if (!(window as any)['__elRef']) {
		(window as any)['__elRef'] = {};
	}
	(window as any)['__elRef']['__GridViewElRef'] = Ref
}


export function gridRender(): GridView {
	try {
		var view: GridView = (window as any)['__elRef']['__GridViewElRef'] as GridView;
	} catch (e) {
		console.error('Grid View lookup error');
	}
	if (view) {
		view.activeGridRender();
	}
	return view;
}


export function setColumnConfigReference(Ref: ConfigPopupPanel | null) {
	if (!(window as any)['__elRef']) {
		(window as any)['__elRef'] = {};
	}
	(window as any)['__elRef']['__ColumnConfigRef'] = Ref
}


export function getColumnConfigReference(): ConfigPopupPanel {
	try {
		return (window as any)['__elRef']['__ColumnConfigRef'] as ConfigPopupPanel;
	} catch (e) {
		console.error('ColumnConfig View lookup error');
		return null;
	}
}




export function updateFixedAndScrollColumns() {
	let meta = getMeta();
	meta.fixedColumns = [];
	meta.scrollColumns = [];
	meta.columns.forEach((x) => {
		if (x.isFixedInfoColumn) {
			x.width = 200;
			x.isVisible = true;
			meta.fixedColumns.push(x);
		} else {
			meta.scrollColumns.push(x);
		}
	});
}

export function updateVisibleColumns() {
	let meta = getMeta();
	let colIndex = 0;
	meta.visibleColumns = [];
	meta.scrollColumns.forEach((x) => {
		if (x.isVisible) {
			x.col_index = colIndex++;
			meta.visibleColumns.push(x);
		}
	});

}

export function updateColumnOrder() {
	let meta = getMeta();
	let colIndex = 0;
	meta.visibleColumns.sort((a, b) => a.order - b.order);
	meta.visibleColumns.forEach((x) => {
		colIndex++;
		x.col_index = colIndex;
		x.order = colIndex;
	});

}
