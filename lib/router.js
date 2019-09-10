export class Router {
	constructor(_rDefault, _rConfig) {
		window.addEventListener('hashchange',(event) => {
			this.checkRoute(event.newURL);
		}, false)
		this.activeRoute = null;
		this.routerConfig = _rConfig;
		this.defultRoute = this.routerConfig.find(x => x.url === _rDefault);
		if (!this.defultRoute) {
			throw 'Error in  default  route name'
		}
		this.checkRoute();
	}

	checkRoute(url) {
		let checkHash = ''
		if (url) {
			checkHash = url.split('#')[1] || '';
		}else{
			let hash = window.location.hash
			checkHash = hash.slice(1, hash.length)
		}
		let targetRoute = this.routerConfig.find(x => x.url === checkHash);
		if (targetRoute && targetRoute.url) {
			if(this.activeRoute && this.activeRoute.cleanup){
				this.activeRoute.cleanup();
			}
			this.activeRoute = targetRoute;
		} else {
			window.location.hash = "#" + this.defultRoute.url;
		}
		if (this.activeRoute) {
			this.activeRoute.instance = new this.activeRoute.controller();
		}
	}
}
