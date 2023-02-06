const style = document.createElement('style')
style.textContent = /*css*/`
	#container {
		padding: 13px;
		background: #303030;
		box-shadow: 0 0 7px #0000008d;
		border-radius: 5px;
		display: flex;
		align-items: flex-end;
		gap: 13px;
	}

	label {
		display:flex;
		gap: 13px;
		align-items: center;
	}

	#colorSelector {
		padding: 0 2px;

	}

	fieldset{
		border: 1px solid #202020;
		padding: 1px 7px;
		position: relative;
	}

	#recentColorsWrapper {
		max-width: 400px;
		display: flex;
		overflow: auto;
	}

`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<link rel="stylesheet" type="text/css" href="./app.css"/>
	<div id="container">
		<label>
			Cor
			<input type="color" id="colorSelector" value="#cccccc">
		</label>
		<fieldset>
			<legend>Cores recentes</legend>
			<div id="recentColorsWrapper"></div>
		</fieldset>
		
	</div>
`

export default class ColorSelector extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({mode: 'open'})
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.updateRecentColors = (recentColors) => {
			while (this.shadowRoot.querySelector('#recentColorsWrapper').children.length)
				this.shadowRoot.querySelector('#recentColorsWrapper').removeChild(this.shadowRoot.querySelector('#recentColorsWrapper').firstElementChild)
			recentColors.forEach((color) => {
				let button = this.shadowRoot.querySelector('#recentColorsWrapper').appendChild(document.createElement('button'))
				button.style = `
						background: ${ color };
						min-width: 28px;
						min-height: 28px;
						margin: 7px;
					`
				button.onclick = () => {
					this.shadowRoot.querySelector('#colorSelector').value = color
					localStorage.setItem('currentColor', color)
					document.dispatchEvent(new CustomEvent('colorChanged', {detail: color}))
				}
				let rmBt = button.appendChild(document.createElement('button'))
				rmBt.textContent = 'x'
				rmBt.style = `
					background: #f31;
					color: #ccc;
					position: absolute;
					top: -8px;
					right: -8px;
					width: 16px;
					height: 16px;
					display: flex;
					align-items: center;
					justify-content: center;
					line-height: 0;
					border-radius: 50%;
				`
				rmBt.onclick = (e) => {
					let recentColors = localStorage.getItem('recentColors') ? JSON.parse(localStorage.getItem('recentColors')) : []
					recentColors = recentColors.filter(c => c != color)
					localStorage.setItem('recentColors', JSON.stringify(recentColors))
					this.updateRecentColors(recentColors)
					e.stopPropagation()
				}
			})
		}

		if (localStorage.getItem('recentColors')) {
			let recentColors = JSON.parse(localStorage.getItem('recentColors'))
			this.updateRecentColors(recentColors)
		}

		document.addEventListener('loadFile', () => {
			this.shadowRoot.querySelector('#colorSelector').value = localStorage.getItem('currentColor')
			this.updateRecentColors(JSON.parse(localStorage.getItem('recentColors')))
		})
	}

	connectedCallback() {
		let colorSelector = this.shadowRoot.querySelector('#colorSelector')
		if (localStorage.getItem('currentColor'))
			colorSelector.value = localStorage.getItem('currentColor')
		colorSelector.addEventListener('input', () => {
			localStorage.setItem('currentColor', colorSelector.value)
			document.dispatchEvent(new CustomEvent('colorChanged', {detail: colorSelector.value}))
		})

		colorSelector.addEventListener('change', () => {
			let recentColors = localStorage.getItem('recentColors') ? JSON.parse(localStorage.getItem('recentColors')) : []
			recentColors.unshift(colorSelector.value)
			localStorage.setItem('recentColors', JSON.stringify(recentColors))
			this.updateRecentColors(recentColors)
		})
	}
}

customElements.define('color-selector', ColorSelector)