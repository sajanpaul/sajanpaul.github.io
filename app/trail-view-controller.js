import { Controller } from './../lib/controller.js'
export class TrailViewController extends Controller{
	constructor(){
		super();
	}
	template(){return {'name':'view'}}
	cleanup(){console.log('view cleaup')}

}
