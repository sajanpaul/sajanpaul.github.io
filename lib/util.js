/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Cross component utility collection
*/
export function deepCopy(input) {
    return JSON.parse(JSON.stringify(input));
}
export let RouterUtil = {
    target: null,
    navigate: (url, replace, forceReload) => {
        if (RouterUtil.target) {
            RouterUtil.target.navigate(url, replace, forceReload);
        }
    },
    reload: () => {
        if (RouterUtil.target) {
            RouterUtil.target.reload();
        }
    },
    castParam: (input) => {
        if (typeof input === 'object') {
            return encodeURIComponent(btoa(JSON.stringify(input)));
        }
        else {
            return encodeURIComponent(btoa((input + '')));
        }
    },
    readParam: (input) => {
        let str = atob(decodeURIComponent(input));
        try {
            return JSON.parse(str);
        }
        catch (e) {
            return str;
        }
    }
};
export function setMeta(meta) {
    if (!window['__store']) {
        window['__store'] = {};
    }
    window['__store']['__meta'] = meta;
}
export function getMeta() {
    try {
        return window['__store']['__meta'];
    }
    catch (e) {
        console.error('Meta View lookup error');
        return null;
    }
}
export function setGridViewReference(Ref) {
    if (!window['__elRef']) {
        window['__elRef'] = {};
    }
    window['__elRef']['__GridViewElRef'] = Ref;
}
export function gridRender() {
    try {
        var view = window['__elRef']['__GridViewElRef'];
    }
    catch (e) {
        console.error('Grid View lookup error');
    }
    if (view) {
        view.activeGridRender();
    }
    return view;
}
export function setColumnConfigReference(Ref) {
    if (!window['__elRef']) {
        window['__elRef'] = {};
    }
    window['__elRef']['__ColumnConfigRef'] = Ref;
}
export function getColumnConfigReference() {
    try {
        return window['__elRef']['__ColumnConfigRef'];
    }
    catch (e) {
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
        }
        else {
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
//# sourceMappingURL=util.js.map