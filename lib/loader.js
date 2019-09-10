
var element = null;
var percentageEl = null
var isVisible = false;
var animationTimer = 0;
var lastPercentage = 0
export function loader(percentage) {
	// console.log('loaded', percentage);
	if (!(element && percentageEl)) {
		init();
	}
	if (percentage >= 0 && percentage <= 100) {
		animateValue(lastPercentage, percentage);
		lastPercentage = percentage;
		if (percentage === 100) {
			setTimeout(() => {
				setVisibility(false)
			}, 700);
		} else {
			if (!isVisible) {
				setVisibility(true)
			}
		}
	} else {
		setVisibility(false)
	}
}


function animateValue(start, end) {
	clearInterval(animationTimer);
	if (start === end) {
		return
	}
	var range = end - start;
	var minTimer = 50;
	var duration = 700;
	var stepTime = Math.abs(Math.floor(duration / range));
	stepTime = Math.max(stepTime, minTimer);
	var startTime = new Date().getTime();
	var endTime = startTime + duration;

	function run() {
		var now = new Date().getTime();
		var remaining = Math.max((endTime - now) / duration, 0);
		var value = Math.round(end - (remaining * range));
		percentageEl.innerHTML = value + '%';
		if (value >= end) {
			clearInterval(animationTimer);
		}
	}
	animationTimer = setInterval(run, stepTime);
	run();
}

function init() {
	element = document.querySelector('[data-element="loader"]');
	percentageEl = document.querySelector('[data-element="loader-text"]');
	if (!(element && percentageEl)) {
		throw 'Cant find elements'
	}
	setVisibility(false)
	lastPercentage = 0;
	percentageEl.innerText = '0%';
}

function setVisibility(flag) {
	isVisible = flag;
	element.style.visibility = flag ? '' : 'hidden';
}


