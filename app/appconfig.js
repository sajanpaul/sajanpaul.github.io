import './../lib/handler.js'
import { Router } from './../lib/router.js'
import { TrailViewController } from './trail-view-controller.js';
import { TrailListController } from './trail-list-controller.js';
const route = new Router('trail-list', [
	{ url: 'trail-list', controller: TrailListController },
	{ url: 'trail-view', controller: TrailViewController }
])
