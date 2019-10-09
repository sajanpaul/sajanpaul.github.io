
import { IRoute } from '../../types/sajan';
import '../lib/router.js'

import '../app/pages/grid-page.el.js'
import '../app/pages/home-page.el.js'
import '../app/pages/not-found-page.el.js'
import '../app/pages/mtf-page.el.js';


import '../app/elements/mtf.el.js';


const Routes: IRoute[] = [
	{ url: 'mtf', params: [], gurad: null, resolve: null, element: 'mtf-page-el' },
	{ url: 'home', params: [], gurad: null, resolve: null, element: 'home-page-el' },
	{ url: '', params: [], gurad: null, resolve: null, redirectTo: 'home' },
	{ url: '**', params: [], gurad: null, resolve: null, element: 'not-found-page-el' },
]


customElements.whenDefined("router-el").then(() => {
	(document.querySelector('router-el') as any).config = Routes;
});

