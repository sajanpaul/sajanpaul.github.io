export class RouterElement extends HTMLElement {
	constructor() {
		super()
		this.currentRequestURL = null;
		this.currentActiveURL = null;
		this.lastRequestURL = null;
		this.lastActiveURL = null;
		this._configration = null;
		this._routeList = null;
		this._defaultRoute = null;
		this._readyState = false;
	}

	check(reload) {
		let guradResolved = () => {
			if (mactchedRouteInfo.resolve instanceof Function) {
				mactchedRouteInfo.resolve(mactchedRouteInfo, (state, value) => {
					mactchedRouteInfo.data_resolvedValues = value;
					if (state) {
						dataResolved();
					}
				});
			} else {
				dataResolved();
			}
		}

		let dataResolved = () => {
			if (mactchedRouteInfo.redirectTo === null) {
				var routerDataObject = {};
				routerDataObject.url = mactchedRouteInfo.url;
				routerDataObject.params = mactchedRouteInfo.activeParam;
				routerDataObject.guard = mactchedRouteInfo.gurad_resolvedValues;
				routerDataObject.data = mactchedRouteInfo.data_resolvedValues;
				routerDataObject = JSON.parse(JSON.stringify(routerDataObject));

				var element = document.createElement(mactchedRouteInfo.element)
				element.activeRouter = routerDataObject;
				this.innerHTML = '';
				this.lastActiveURL = this.currentActiveURL;
				this.currentActiveURL = mactchedRouteInfo.url;
				this.appendChild(element);
			} else {
				window.location.hash = mactchedRouteInfo.redirectTo;
			}
		}

		var mactchedRouteInfo = null;
		var _hash = window.location.hash;
		_hash = _hash.replace(/^(#\/|#|\/)/i, '').replace(/\/$/i, '').trim(); 
		this.lastRequestURL = this.currentRequestURL;
		this.currentRequestURL = _hash;
		if (this.currentActiveURL !== this.currentRequestURL || reload) { //no route change

			let tokens = _hash.split('/').map(_tkn => decodeURI(_tkn.trim()))
			if (this._readyState && this._routeList !== null) {
				for (var x_index = 0; x_index < this._routeList.length; x_index++) {
					if (
						tokens[0] === this._routeList[x_index].url &&
						(tokens.length - 1) === this._routeList[x_index].params.length) {
						mactchedRouteInfo = this._routeList[x_index];
						mactchedRouteInfo._collectedParam = tokens.slice(1)
						break;
					}
				}
				if (mactchedRouteInfo === null) {
					this._defaultRoute._collectedParam = [];
					mactchedRouteInfo = this._defaultRoute;
				}
				mactchedRouteInfo.activeParam = {};
				mactchedRouteInfo._collectedParam.forEach((tk, index) => {
					mactchedRouteInfo.activeParam[mactchedRouteInfo.params[index]] = tk;
				});
				if (mactchedRouteInfo.gurad instanceof Function) {
					mactchedRouteInfo.gurad(mactchedRouteInfo, (state, value) => {
						mactchedRouteInfo.gurad_resolvedValues = value;
						if (state) {
							guradResolved();
						}
					});
				} else {
					guradResolved();
				}
			}
		}
	}



	set config(_cnf) {
		this._configration = _cnf;
		this._routeList = [];
		for (var x in _cnf) {
			var route = {};
			route.element = _cnf[x].element || 'div';
			route.url = _cnf[x].url;

			if (typeof _cnf[x].redirectTo === 'string') {
				route.redirectTo = _cnf[x].redirectTo
			} else {
				route.redirectTo = null;
			}

			if (_cnf[x].params instanceof Array) {
				route.params = _cnf[x].params;
			} else {
				route.params = [];
			}

			if (_cnf[x].gurad instanceof Function) {
				route.gurad = _cnf[x].gurad;
			} else {
				route.gurad = null;
			}

			if (_cnf[x].resolve instanceof Function) {
				route.resolve = _cnf[x].resolve;
			} else {
				route.resolve = null;
			}

			if (route.url === '**') {
				this._defaultRoute = route;
				this._defaultRoute.resolve = null;
				this._defaultRoute.gurad = null;

			} else {
				this._routeList.push(route);
			}
		}
		this.check(false);
	}

	get config() {
		return this._configration;
	}
	get parsedRouteList() {
		return this._routeList;
	}

	connectedCallback() {
		window.addEventListener('hashchange', this._hashChangeEvent);
		this._readyState = true;
		this.check(false);
	}

	disconnectedCallback() {
		window.removeEventListener('hashchange', this._hashChangeEvent);
		this._readyState = false;
	}
	_hashChangeEvent = (event) => {
		this.check(false);
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
	}

	adoptedCallback() {
	}
}


customElements.define('router-el', RouterElement);
