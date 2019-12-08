/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Route Element
*/

import { IRoute, IRouteMeta, IRouteInstance, IRoutePage } from '../../types/route.d';
export class RouterElement extends HTMLElement {

	public currentRequestURL: string = null;
	public currentActiveURL: string = null;
	public lastRequestURL: string = null;
	public lastActiveURL: string = null;

	private _configuration: IRoute[] = null;
	private _routeList: IRouteMeta[] = null;
	private _defaultRoute: IRouteMeta = null;

	private _readyState: boolean = false;

	constructor() {
		super()
	}
	navigate(url: string, replace?: boolean, forceReload?:boolean) {
		let _url = url.replace(/\#/gi,'')
		history[replace ? 'replaceState' : 'pushState']({url:_url},'','/#/'+_url)
		this.check(forceReload);
	}

	reload() {
		this.check(true);
	}




	check(reload: boolean) {

		let guardResolved = () => {
			if (matchedRouteInfo.resolve instanceof Function) {
				matchedRouteInfo.resolve(matchedRouteInfo, (state: boolean, value: any) => {
					matchedRouteInfo.data_resolvedValues = value;
					if (state) {
						dataResolved();
					}
				});
			} else {
				dataResolved();
			}
		}

		let dataResolved = () => {
			if (matchedRouteInfo.redirectTo === null) {
				var routerDataObject: IRouteInstance = {} as IRouteInstance;
				routerDataObject.activeUrl = matchedRouteInfo.url;
				routerDataObject.paramsMap = matchedRouteInfo.activeParam;
				routerDataObject.guardInfo = matchedRouteInfo.guard_resolvedValues;
				routerDataObject.data = matchedRouteInfo.data_resolvedValues;
				routerDataObject = JSON.parse(JSON.stringify(routerDataObject)) as IRouteInstance;

				var element: any = document.createElement(matchedRouteInfo.element);
				(element as IRoutePage).activeRouter = routerDataObject;
				this.innerHTML = '';
				this.lastActiveURL = this.currentActiveURL;
				this.currentActiveURL = matchedRouteInfo.url;
				this.appendChild(element);
			} else {
				window.location.hash = matchedRouteInfo.redirectTo;
			}
		}

		var matchedRouteInfo: IRouteMeta = null;
		let _hash: string = window.location.hash;
		_hash = _hash.replace(/^(#\/|#|\/)/i, '').replace(/\/$/i, '').trim();
		this.lastRequestURL = this.currentRequestURL;
		this.currentRequestURL = _hash;
		if (this.currentActiveURL !== this.currentRequestURL || reload) {

			let tokens = _hash.split('/').map(_tkn => decodeURI(_tkn.trim()))
			if (this._readyState && this._routeList !== null) {
				for (var x_index = 0; x_index < this._routeList.length; x_index++) {
					if (
						tokens[0] === this._routeList[x_index].url &&
						(tokens.length - 1) === this._routeList[x_index].params.length) {
						matchedRouteInfo = this._routeList[x_index];
						matchedRouteInfo._collectedParam = tokens.slice(1)
						break;
					}
				}
				if (matchedRouteInfo === null) {
					this._defaultRoute._collectedParam = [];
					matchedRouteInfo = this._defaultRoute;
				}
				matchedRouteInfo.activeParam = {}
				matchedRouteInfo._collectedParam.forEach((tk, index) => {
					matchedRouteInfo.activeParam[matchedRouteInfo.params[index]] = tk;
				});
				if (matchedRouteInfo.guard instanceof Function) {
					matchedRouteInfo.guard(matchedRouteInfo, (state, value) => {
						matchedRouteInfo.guard_resolvedValues = value;
						if (state) {
							guardResolved();
						}
					});
				} else {
					guardResolved();
				}


			}
		}
	}




	set config(_cnf: IRoute[]) {
		//validate _cnf
		//normalize _cnf
		this._configuration = _cnf;
		this._routeList = [];
		for (let x in _cnf) {
			let route: IRouteMeta = {} as IRouteMeta;
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

			if (_cnf[x].guard instanceof Function) {
				route.guard = _cnf[x].guard;
			} else {
				route.guard = null;
			}

			if (_cnf[x].resolve instanceof Function) {
				route.resolve = _cnf[x].resolve;
			} else {
				route.resolve = null;
			}

			if (route.url === '**') {
				this._defaultRoute = route;
				this._defaultRoute.resolve = null;
				this._defaultRoute.guard = null;

			} else {
				this._routeList.push(route);
			}
		}
		this.check(false);
	}

	get config(): IRoute[] {
		return this._configuration;
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
	_hashChangeEvent = (event: HashChangeEvent) => {
		this.check(false);
	}

	attributeChangedCallback(attrName: string, oldVal: string, newVal: string) { }

	adoptedCallback() { }

}
customElements.define('router-el', RouterElement);
