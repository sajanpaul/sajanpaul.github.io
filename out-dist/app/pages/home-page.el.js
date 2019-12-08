export class HomePage extends HTMLElement {
    /**
    @author: Sajan Paul,
    @since:  2019-12-07,
    @description : First Landing page
    */
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = /*html*/ `
		<div class="card-container" data-element="card-holder-page">
			<div class="menu-area">
			
				<ol>
					<li>
						<a href="#/mtf"> Match the following</a>
						<div><samp>MouseOnly</samp> <samp>NoAutoScroll</samp> <samp>Testing</samp></div>
					</li>
					<li>
						<a href="#/grid">DataGrid (10 Million Cells)</a>
						<div><samp>MouseOnly</samp> <samp>InProgress</samp> <samp>NoTabSupport</samp>
							<samp>NoFocusSupport</samp></div>
					</li>
					<li>
						<a href="#crop" disabled="disabled">Image Cropping</a>
						<div><samp>MouseOnly</samp> <samp>InProgress</samp></div>
					</li>
					<li>
						<a href="https://github.com/sajanpaul/sajanpaul.github.io"><img class="github-icon" src="./assets/icons/github.svg"> Source Code</a>
						<div><samp>Github</samp> <samp>Source Code</samp></div>
					</li>
				</ol>
				<p class="main-content">
					The site is entirely handcrafted with JS(TS), CSS(SCSS), and HTML,
					<br>
					check my <a  href="https://github.com/sajanpaul/sajanpaul.github.io" target="_blank">GitHub repository</a> for more information.
				</p>
				<p class="remarks">
					The website and its contents are not intended to be in production quality, 
					<br>
					its created for a prototype purpose,
					<br>
					The site works fine in Google Chrome with a mouse.
				<p>
			</div>
			<div class="greeting">
				<div class="greeting-bubble">
					<h1 class="bubble-title">Hey</h1>
				</div>
				<div class="greeting-box">
					<h1 class="greeting-box-title">Welcome</h1>
					<div class="greeting-box-desc">Click right side links to open my sample prototype works ;)</div>
				</div>
			</div>
		</div>
		`;
    }
    disconnectedCallback() {
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
    }
    adoptedCallback() {
    }
}
customElements.define('home-page-el', HomePage);
//# sourceMappingURL=home-page.el.js.map