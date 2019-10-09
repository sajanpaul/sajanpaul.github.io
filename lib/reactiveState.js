export class ReactiveState {
	constructor(init_state) {
		this._listners = [];
		this.value = init_state;
		this.trigger();

	}
	state(value) {
		this.state = value;
		this.trigger();
	}
	trigger() {
		this._listners.forEach( x => x.fn &&  x.fn(this.state));
	}
	on(keyOrFn, func) {
		var _fn = null;
		var name = null;

		if (typeof keyOrFn === 'function') {
			_fn = keyOrFn;
		} else if (typeof keyOrFn === 'string') {
			name = keyOrFn;
			if (typeof func === 'function') {
				_fn = func;
			} else {
				this.err();
			}
		} else {
			this.err();
		}
		this._listners.push({name:name, fn:_fn });
	}
	off(keyOrFn, func) {
		var _fn = null;
		var name = null;

		if (typeof keyOrFn === 'function') {
			_fn = keyOrFn;
		} else if (typeof keyOrFn === 'string') {
			name = keyOrFn;
			if (typeof func === 'function') {
				_fn = func;
			} else {
				this.err();
			}
		} else {
			this.err();
		}
		var _index = this._listners.findIndex(x => x.name === name && x.fn===_fn);
		if(_index > -1){
			this._listners.splice(_index,1)
		}
	}
	err(e) {
		throw 'Invalid params in Reactive State Object';
	}
}
