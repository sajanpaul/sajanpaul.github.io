/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Match the following Element
*/
export class MtfEl extends HTMLElement {
    constructor() {
        super();
        this.el = {
            premiseList: null,
            responseList: null,
            viewBoundEl: this,
            scrollableElement: window.document.documentElement
        };
        this.autoScrollState = null;
        this.autoScrollDuration = 500;
        this.autoScrollValue = 0;
        this.config = {
            pageYFixedValue: 50,
        };
        this.dragMeta = {
            dragType: null,
            activeElementIndex: null,
            activeElement: null,
            dragStart: false,
            placeHolder: null,
            ghost: null,
            targetEl: null,
            totalMouseMovementY: 0,
            totalMouseMovementX: 0,
            leftAdjust: 0,
            topAdjust: 0,
            elSize: {
                width: 0,
                height: 0,
            }
        };
        this.layoutMAP = [];
        this.connectionDetails = [];
        this.premiseMouseDown = (event) => {
            // console.log('premises mousedown')
            this.dragReset();
            this.dragMeta.activeElement = event.currentTarget;
            this.dragMeta.dragType = 'premise';
            this.updateLayoutPost(this.MTF.responseList, 'response'); //UPDATE response layout on premise mousedown
        };
        this.responseMouseDown = (event) => {
            // console.log('response mousedown')
            this.dragReset();
            this.dragMeta.activeElement = event.currentTarget;
            this.dragMeta.dragType = 'response';
            this.updateLayoutPost(this.MTF.premiseList, 'premise'); //UPDATE response layout on premise mousedown
        };
        this.mousemove = (event) => {
            // let rxe = <HTMLElement>this.querySelector('.response.mtf-block')
            // console.log(rxe.offsetLeft , event.pageX, rxe.offsetTop , event.pageY);
            if (this.dragMeta.activeElement) { // has element
                this.dragMeta.totalMouseMovementY += Math.abs(event.movementY);
                this.dragMeta.totalMouseMovementX += Math.abs(event.movementX);
                if ((!this.dragMeta.dragStart) &&
                    (this.dragMeta.totalMouseMovementY > 5 || this.dragMeta.totalMouseMovementX > 5)) { // for initing actual start
                    this.dragMeta.dragStart = true;
                    this.setConnection(this.dragMeta.activeElement.dataset.indexedID, false);
                    this.generatePlaceHolderAndGhost(this.dragMeta.activeElement, event);
                }
                if (this.dragMeta.dragStart) {
                    this.dragMeta.ghost.style.top = (event.clientY - this.dragMeta.topAdjust) + 'px';
                    this.dragMeta.ghost.style.left = (event.clientX - this.dragMeta.leftAdjust) + 'px';
                    // this.dragMeta.ghost.style.top = (event.clientY ) + 'px';
                    // this.dragMeta.ghost.style.left = (event.clientX) + 'px';
                    // const top_scroll_area_start = this.el.autoScrollElement.offsetTop;
                    // const bottom_scroll_area_end = top_scroll_area_start + this.el.viewBoundEl.offsetHeight;
                    const rect = this.el.viewBoundEl.getClientRects()[0];
                    if (rect) {
                        const horizontalInside = (event.clientX > rect.left) && (event.clientY < rect.right);
                        if (horizontalInside) {
                            const top_scroll_area_start = rect.top - 50;
                            const bottom_scroll_area_end = rect.bottom;
                            const top_scroll_area_end = top_scroll_area_start + 150;
                            const bottom_scroll_area_start = bottom_scroll_area_end - 100;
                            // console.log(event.clientY, top_scroll_area_start, bottom_scroll_area_end);
                            const OnTop = (event.clientY > top_scroll_area_start) && (event.clientY < top_scroll_area_end);
                            const OnBottom = (event.clientY > bottom_scroll_area_start) && (event.clientY < bottom_scroll_area_end);
                            if (OnTop && !OnBottom) {
                                // console.log('top scroll');
                                this.autoScrollValue = -100;
                            }
                            else if (!OnTop && OnBottom) {
                                this.autoScrollValue = -100;
                                // console.log('bottom scroll');
                            }
                            if ((OnTop && OnBottom) || (!OnTop && !OnBottom)) {
                                this.clearAutoScroll();
                            }
                            else {
                            }
                        }
                        else {
                            this.clearAutoScroll('No Drag Element');
                        }
                    }
                    else {
                        this.clearAutoScroll('No rect');
                    }
                    const targetEl = event.target.closest('.mtf-block');
                    if (targetEl &&
                        targetEl !== this.dragMeta.activeElement &&
                        !targetEl.classList.contains('drag-place-holder') &&
                        !targetEl.classList.contains('drag-ghost-element')) {
                        let verifiedTarget = 0;
                        let nodeList = this.dragMeta.dragType === 'premise' ? this.MTF.premiseList : this.MTF.responseList;
                        nodeList.forEach((node) => {
                            if (targetEl === node.element) {
                                verifiedTarget++;
                            }
                        });
                        if (verifiedTarget === 1) {
                            // console.log(targetEl, targetEl.parentElement);
                            // this.dragMeta.placeHolder.remove();
                            // if (event.movementY > 0) {
                            // 	if (targetEl.parentElement.lastElementChild === targetEl) {
                            // 		targetEl.parentElement.appendChild(this.dragMeta.placeHolder);
                            // 	} else {
                            // 		targetEl.parentElement.insertBefore(this.dragMeta.placeHolder, targetEl.nextElementSibling);
                            // 	}
                            // } else {
                            // 	targetEl.parentElement.insertBefore(this.dragMeta.placeHolder, targetEl);
                            // }
                            this.dragMeta.targetEl = targetEl;
                        }
                        else {
                            this.dragMeta.targetEl = null;
                        }
                    }
                    else {
                        this.dragMeta.targetEl = null;
                    }
                }
            }
        };
        this.mouseup = (event) => {
            const mousedownOrginated = !!this.dragMeta.activeElement;
            const isAfterSuccessfullDrag = this.dragMeta.activeElement && this.dragMeta.dragStart;
            if (this.dragMeta.activeElement && this.dragMeta.placeHolder) {
                let top = (event.clientY - this.dragMeta.topAdjust) + 5;
                let bottom = top + this.dragMeta.elSize.height - 5;
                let left = null, right = null;
                if (this.dragMeta.dragType === 'response') {
                    left = (event.clientX - this.dragMeta.leftAdjust) - 10;
                    right = left + 20;
                }
                else if (this.dragMeta.dragType === 'premise') {
                    right = ((event.clientX - this.dragMeta.leftAdjust) + this.dragMeta.elSize.width) + 10;
                    left = right - 20;
                }
                var layoutObject = this.layoutMAP.find((layout) => {
                    return (layout.left < left && right < layout.right &&
                        layout.top < top && bottom < layout.bottom);
                });
                // let mark = document.createElement('div');
                // mark.classList.add('active-marker', 'overlay-mark')
                // mark.style.top =top+'px';
                // mark.style.left = left+'px';
                // mark.style.width =  (right - left)+'px';
                // mark.style.height = (bottom - top)+'px';
                // document.body.appendChild(mark)
                // if (layoutObject) {
                // 	if (this.dragMeta.dragType === 'premise') {
                // 		var _premiseEl = this.dragMeta.activeElement;
                // 		var _responseEl = <HTMLElement>this.el.responseList.children.item(layoutObject.index);
                // 	} else if (this.dragMeta.dragType === 'response') {
                // 		var _responseEl = this.dragMeta.activeElement;
                // 		var _premiseEl = <HTMLElement>this.el.premiseList.children.item(layoutObject.index);
                // 	}
                // }
                if (this.dragMeta.targetEl) {
                    this.setConnection(this.dragMeta.targetEl.dataset.indexedID, !!layoutObject);
                    this.dragMeta.targetEl.replaceWith(this.dragMeta.activeElement);
                    this.dragMeta.placeHolder.replaceWith(this.dragMeta.targetEl);
                    let childrenArray = Array.from(this.dragMeta.targetEl.parentElement.children);
                    // let key  = (childrenArray.indexOf(this.dragMeta.targetEl)  > 	childrenArray.indexOf(this.dragMeta.activeElement)) ? '-20px' :'20px';
                    let key = (childrenArray.indexOf(this.dragMeta.activeElement) - childrenArray.indexOf(this.dragMeta.targetEl)) * 20;
                    let keyFrameApprear = [
                        { opacity: 0, transform: `translateY(${key}px)` },
                        { opacity: 1, transform: 'translateY(0)' }
                    ];
                    let drop = [
                        { transform: `scaleX(0.9) scaleY(1)` },
                        { transform: 'scaleX(1) scaleY(1)' }
                    ];
                    // this.dragMeta.activeElement.animate(drop, { duration: 200 });
                    this.dragMeta.targetEl.animate(keyFrameApprear, { duration: 600 });
                }
                else {
                    this.dragMeta.placeHolder.replaceWith(this.dragMeta.activeElement);
                    this.setConnection(this.dragMeta.activeElement.dataset.indexedID, !!layoutObject);
                }
            }
            this.dragReset();
            if (isAfterSuccessfullDrag) {
                let premiseLn = this.el.premiseList.children.length;
                for (var index = 0; index < premiseLn; index++) {
                    let pre_el = this.el.premiseList.children.item(index);
                    let res_el = this.el.responseList.children.item(index);
                    let pre_obj = this.MTF.premiseList[parseInt(pre_el.dataset.indexedID)];
                    let res_obj = this.MTF.responseList[parseInt(res_el.dataset.indexedID)];
                    pre_obj.indexedID = index;
                    res_obj.indexedID = index;
                    pre_obj.element = pre_el;
                    res_obj.element = res_el;
                    pre_el.dataset.indexedID = index + '';
                    res_el.dataset.indexedID = index + '';
                    this.connectionDetails[index] = !!this.connectionDetails[index];
                    if (this.connectionDetails[index]) {
                        pre_el.classList.add('join');
                        res_el.classList.add('join');
                    }
                    else {
                        pre_el.classList.remove('join');
                        res_el.classList.remove('join');
                    }
                }
                this.MTF.premiseList.sort((a, b) => a.indexedID - b.indexedID);
                this.MTF.responseList.sort((a, b) => a.indexedID - b.indexedID);
            }
            if (mousedownOrginated) {
            }
        };
        this.autoScroll = () => {
            // this.scrollInstance.scroll({ y: this.autoScrollValue }, 500);
            this.el.scrollableElement.scrollTop += this.autoScrollValue;
        };
        this.clearAutoScroll = (from) => {
            if (this.autoScrollState) {
                // console.log('timer cleared', from ? ('from ' + from) : '');
                clearInterval(this.autoScrollState);
                this.autoScrollState = null;
            }
        };
    }
    connectedCallback() {
        this.innerHTML = /* html */ `
		<div class="premise-list" id="premise-list"></div>
		<div class="response-list" id="response-list"></div>
		`;
        this.el.premiseList = this.querySelector('#premise-list');
        this.el.responseList = this.querySelector('#response-list');
        document.addEventListener('mousemove', this.mousemove);
        document.addEventListener('mouseup', this.mouseup);
    }
    disconnectedCallback() {
        document.removeEventListener('mousemove', this.mousemove);
        document.removeEventListener('mouseup', this.mouseup);
    }
    attributeChangedCallback(attrName, oldVal, newVal) { }
    adoptedCallback() { }
    set mtfData(_data) {
        this.MTF = _data;
        this.renderBlocks();
        this.shuffleList();
    }
    renderBlocks() {
        let duplicateFilter = (_arr) => {
            let mapObj = {};
            _arr.forEach((x) => mapObj[x.id] = x);
            let unique = Object.values(mapObj);
            if (_arr.length !== unique.length) {
                throw 'the id should be unique';
            }
            return unique;
        };
        this.el.premiseList.innerHTML = '';
        this.el.responseList.innerHTML = '';
        this.MTF.premiseList = duplicateFilter(this.MTF.premiseList);
        this.MTF.responseList = duplicateFilter(this.MTF.responseList);
        if (this.MTF.premiseList.length > 10 || this.MTF.responseList.length > 10) {
            throw 'Premise and Response length should be less than 10';
        }
        else if (this.MTF.premiseList.length !== this.MTF.responseList.length) {
            throw 'Premise and Response length should be equal';
        }
        else {
            for (let premise of this.MTF.premiseList) {
                // premise
                let response = this.MTF.responseList.find(_res => _res.id === premise.id);
                if (response) {
                    premise.responseRef = response;
                    response.premiseRef = premise;
                }
                else {
                    throw 'Failed to find the Response of premise, id =' + premise.id;
                }
                if (!(premise && !Number.isNaN(parseInt(premise.id + '')) && (premise.text || '').trim() !== '')) {
                    throw 'invalid ID or  text in thePremise, id =' + premise.id;
                }
                else if (!(response && !Number.isNaN(parseInt(response.id + '')) && (response.text || '').trim() !== '')) {
                    throw 'invalid ID or text in the Response, id =' + response.id;
                }
                else {
                    premise.element = document.createElement('div');
                    premise.element.classList.add('premise', 'mtf-block');
                    this.updateBlockHtml(premise.element, premise.text);
                    premise.element.addEventListener('mousedown', this.premiseMouseDown);
                    response.element = document.createElement('div');
                    response.element.classList.add('response', 'mtf-block');
                    this.updateBlockHtml(response.element, response.text);
                    response.element.addEventListener('mousedown', this.responseMouseDown);
                    premise.sortKey = Math.random() * 100;
                    response.sortKey = Math.random() * 100;
                }
            }
        }
    }
    updateBlockHtml(element, title) {
        element.title = title;
        element.innerHTML = /* html */ `
		<div class="mtf-block-connect">
			<div class="connect-block connect-top"></div>
			<div class="connect-block connect-middle"></div>
			<div class="connect-block connect-bottom"></div>
		</div>
		<div class="mtf-block-label"></div>`;
        element.querySelector('.mtf-block-label').innerText = title;
    }
    shuffleList() {
        //shuffle and update lists
        this.MTF.premiseList.sort((a, b) => a.sortKey - b.sortKey);
        this.MTF.responseList.sort((a, b) => a.sortKey - b.sortKey);
        this.MTF.premiseList.forEach((ent, index) => {
            this.setConnection(index, false);
            ent.indexedID = index;
            ent.sortKey = Math.random() * 100;
            ent.element.dataset.indexedID = ent.indexedID + '';
            this.el.premiseList.appendChild(ent.element);
        });
        this.MTF.responseList.forEach((ent, index) => {
            ent.indexedID = index;
            ent.sortKey = Math.random() * 100;
            ent.element.dataset.indexedID = ent.indexedID + '';
            this.el.responseList.appendChild(ent.element);
        });
    }
    updateLayoutPost(list, blockType) {
        this.layoutMAP = [];
        // document.querySelectorAll('.overlay-mark').forEach(x => x.remove());
        list.forEach((itx, index) => {
            let pos = {};
            pos.rect = itx.element.getClientRects()[0];
            pos.index = index;
            pos.top = pos.rect.top - 10;
            pos.bottom = pos.rect.bottom + 10;
            if (blockType === 'premise') {
                pos.right = pos.rect.right + 30;
                pos.left = pos.right - 80;
            }
            else if (blockType === 'response') {
                pos.left = pos.rect.left - 30;
                pos.right = pos.left + 80;
            }
            // let mark = document.createElement('div');
            // mark.classList.add('targeted-marker', 'overlay-mark')
            // mark.style.top = pos.top+'px';
            // mark.style.left = pos.left+'px';
            // mark.style.width =  (pos.right - pos.left)+'px';
            // mark.style.height = (pos.bottom - pos.top)+'px';
            // document.body.appendChild(mark);
            this.layoutMAP.push(pos);
        });
    }
    check() {
        let premiseLn = this.el.premiseList.children.length;
        for (var index = 0; index < premiseLn; index++) {
            let pre_el = this.el.premiseList.children.item(index);
            let res_el = this.el.responseList.children.item(index);
            let pre_obj = this.MTF.premiseList[parseInt(pre_el.dataset.indexedID)];
            let res_obj = this.MTF.responseList[parseInt(res_el.dataset.indexedID)];
            pre_el.classList.remove('status-correct', 'status-wrong', 'status-skip');
            res_el.classList.remove('status-correct', 'status-wrong', 'status-skip');
            if (pre_el.classList.contains('join') && res_el.classList.contains('join')) {
                if (pre_obj.id === res_obj.id) {
                    pre_el.classList.add('status-correct');
                    res_el.classList.add('status-correct');
                }
                else {
                    pre_el.classList.add('status-wrong');
                    res_el.classList.add('status-wrong');
                }
            }
            else {
                pre_el.classList.add('status-skip');
                res_el.classList.add('status-skip');
            }
        }
    }
    setConnection(index, state) {
        this.connectionDetails[index + ''] = state;
    }
    dragReset() {
        if (this.dragMeta.placeHolder) {
            this.dragMeta.placeHolder.remove();
        }
        if (this.dragMeta.ghost) {
            this.dragMeta.ghost.remove();
        }
        this.dragMeta.elSize.width = null;
        this.dragMeta.elSize.height = null;
        this.dragMeta.targetEl = null;
        this.dragMeta.dragType = null;
        this.dragMeta.activeElement = null;
        this.dragMeta.dragStart = null;
        this.dragMeta.placeHolder = null;
        this.dragMeta.ghost = null;
        this.dragMeta.totalMouseMovementY = 0;
        this.dragMeta.totalMouseMovementX = 0;
        this.dragMeta.leftAdjust = 0;
        this.dragMeta.topAdjust = 0;
        this.clearAutoScroll('Reset');
    }
    generatePlaceHolderAndGhost(el, event) {
        if (this.dragMeta.placeHolder) {
            this.dragMeta.placeHolder.remove();
        }
        if (this.dragMeta.ghost) {
            this.dragMeta.ghost.remove();
        }
        this.dragMeta.placeHolder = el.cloneNode();
        this.dragMeta.elSize.height = el.offsetHeight;
        this.dragMeta.elSize.width = el.offsetWidth;
        this.dragMeta.placeHolder.style.height = this.dragMeta.elSize.height + 'px';
        this.dragMeta.placeHolder.style.width = this.dragMeta.elSize.width + 'px';
        this.dragMeta.placeHolder.classList.add('drag-place-holder');
        this.dragMeta.placeHolder.classList.remove('join');
        this.dragMeta.ghost = el.cloneNode(true);
        this.dragMeta.ghost.style.height = this.dragMeta.elSize.height + 'px';
        this.dragMeta.ghost.style.width = this.dragMeta.elSize.width + 'px';
        this.dragMeta.ghost.classList.remove('join');
        this.dragMeta.leftAdjust = Math.round(event.pageX - el.offsetLeft);
        this.dragMeta.topAdjust = Math.round((event.pageY - this.config.pageYFixedValue) - el.offsetTop);
        // console.log(this.dragMeta.leftAdjust , this.dragMeta.topAdjust)
        this.dragMeta.ghost.classList.add('drag-ghost-element');
        this.dragMeta.activeElement.replaceWith(this.dragMeta.placeHolder);
        document.body.appendChild(this.dragMeta.ghost);
    }
}
customElements.define('mtf-el', MtfEl);
//# sourceMappingURL=mtf.el.js.map