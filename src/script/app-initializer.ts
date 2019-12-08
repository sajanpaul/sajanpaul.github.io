
import { IRoute } from '../../types/route';
import '../lib/router.js'

import '../app/pages/grid-page.el.js'
import '../app/pages/home-page.el.js'
import '../app/pages/not-found-page.el.js'
import '../app/pages/mtf-page.el.js';


import '../app/elements/mtf.el.js';
import '../app/elements/grid-view-el.js';
import '../app/elements/grid-cell.el.js';
import '../app/elements/column-head.el.js';

import '../app/panels/column-sort-panel.js';
import '../app/panels/visibility-panel.js';
import '../app/panels/config-popup-panel.js';

/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Entry Script File 
*/

const Routes: IRoute[] = [
	{ url: 'mtf', params: [], guard: null, resolve: null, element: 'mtf-page-el' },
	{ url: 'home', params: [], guard: null, resolve: null, element: 'home-page-el' },
	{ url: 'grid', params: [], guard: null, resolve: null, element: 'grid-page-el' },
	{ url: '', params: [], guard: null, resolve: null, redirectTo: 'home' },
	{ url: '**', params: [], guard: null, resolve: null, element: 'not-found-page-el' },
]


customElements.whenDefined("router-el").then(() => {
	(document.querySelector('router-el') as any).config = Routes;
});

