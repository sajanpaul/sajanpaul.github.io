import { Controller } from './../lib/controller.js'
import { http } from './../lib/http.js'
export class TrailListController extends Controller {
	constructor() {
		super();
		this.loadData();

	}
	template() { return { 'name': 'list' } }
	cleanup() { console.log('list cleaup') }

	loadData() {

		http('https://dev.theezcaptureapp.com/api/public/api/v3/ezcapture/alltraitlist',
			{ "user_id": "2" },
			(response) => {
				console.log(response);
			}
		)


	}
}
