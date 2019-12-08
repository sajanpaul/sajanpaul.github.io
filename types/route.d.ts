export interface IRoute {
	url: string;
	params?: string[];
	guard?: null | GuardFunction;
	resolve?: null | ResolverFunction;
	element?: string;
	redirectTo?: string;
}
export interface IRouteMeta {
	url: string;
	params: string[];
	guard: null | GuardFunction;
	resolve: null | ResolverFunction;
	element: string;
	redirectTo: string;
	_collectedParam: string[];
	activeParam: any;
	data_resolvedValues: any;
	guard_resolvedValues: any;
}

interface IRouteInstance {
	activeUrl: string;
	paramsMap: any;
	guardInfo: any;
	data: any;
}

export type ResolverFunctionCallback = (state: boolean, value: any) => void;
export type GuardFunctionCallBack = (state: boolean, value: any) => void;
export type GuardFunction = (matchedRouteInfo: IRouteMeta, callaback: GuardFunctionCallBack) => void;
export type ResolverFunction = (matchedRouteInfo: IRouteMeta, callaback: ResolverFunctionCallback) => void;

export interface IRoutePage {
	 activeRouter: IRouteInstance;
}
