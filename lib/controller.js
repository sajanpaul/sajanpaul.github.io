export class Controller {
	constructor() {
		const templateConfig = this.template();
		if (templateConfig) {

			const page = document.querySelector('template[template-name="'+templateConfig.name+'"]');
			const outlet = document.querySelector('[router-outlet]')
			outlet.innerHTML = page.innerHTML;
		}
	}
}
