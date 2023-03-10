const style = document.createElement('style')
style.textContent = /*css*/`
	#container {
		margin: 8.5px 17px;
		background: #303030;
		padding: 17px;
		height: calc(100vh - 170px);
		border-radius: 5px;
		box-shadow: 0 0 7px #0000008d;
		overflow: auto;
	}

  #graphic {
		display: grid;
		transform-origin: top left;
	}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<link rel="stylesheet" type="text/css" href="./app.css"/>
	<div id="container">
		<div style="margin: auto; width: fit-content;">
			<div id="graphic"></div>
		</div>
	</div>
`

import graphicSquare from './graphicSquare.js'
export default class AppGraphic extends HTMLElement {
	static get observedAttributes() {
		return ['dimensions']
	}

	constructor() {
		super()
		this.attachShadow({mode: 'open'})
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.onmousedown = (e) => {
			return false
		}

		this.oncontextmenu = (e) => {
			return false
		}

		this.qtt = 0
		this.timer = null
		this.generateNewGraph = (dimensions, children) => {
			clearTimeout(this.timer)
			this.qtt = 0
			if (document.querySelector('#appLoading')) {
				document.body.removeChild(this.loading)
				this.loading = null
			}
			this.loading = document.body.appendChild(document.createElement('div'))
			this.loading.id = 'appLoading'
			this.loading.style = `
				position: fixed;
				bottom: 0;
				right: 0;
				padding: 17px 33px;
				background: #0000008d;
				display: flex;
				align-items: center;
				justify-content: center;
				border-top-left-radius: 5px;
				font-size: 2em;
				z-index: 9999;
			`
			let b = this.loading.appendChild(document.createElement('b'))
			b.id = 'loadingProgress'
			b.textContent = 'Gerando gráfico...'

			this.currentZoom = 1
			let graphic = this.shadowRoot.querySelector('#graphic')
			graphic.style.transform = `scale(${ this.currentZoom })`
			while (graphic.children.length)
				graphic.removeChild(graphic.firstElementChild)
			let width = Number(dimensions.split(',')[0].trim())
			let height = Number(dimensions.split(',')[1].trim())
			graphic.style.gridTemplateColumns = `repeat(${ width }, 32px)`
			this.qtt = width * height
			const appendChildren = () => {
				let y = Math.floor(graphic.children.length / width)
				let x = graphic.children.length - width * y
				graphic.appendChild(new graphicSquare(x, y, children ? children[graphic.children.length] : null))

				document.body.querySelector('#loadingProgress').innerHTML = `Gerando gráfico... ${ Math.ceil(graphic.children.length / (this.qtt / 100)) }%`
				if (graphic.children.length < this.qtt) {
					this.timer = setTimeout(() => {
						appendChildren()
					}, 16)
				}
				else {
					document.body.removeChild(this.loading)
					this.loading = null
				}
			}
			appendChildren()
		}

		this.currentZoom = 1
		this.onmousewheel = (e) => {
			if (e.ctrlKey) {
				if (e.wheelDeltaY > 0) {
					this.currentZoom += .1
				}
				else {
					this.currentZoom -= .1
					if (this.currentZoom < 0.1)
						this.currentZoom = 0.1
				}
				this.shadowRoot.querySelector('#graphic').style.transform = `scale(${ this.currentZoom })`

				return false
			}
		}

		document.addEventListener('loadFile', () => {
			this.loadingFile = true
			this.setAttribute('dimensions', localStorage.getItem('dimensions') || '16,16')
			this.generateNewGraph(this.getAttribute('dimensions'), JSON.parse(localStorage.getItem('children')))
			this.loadingFile = false
		})
	}

	get dimensions() {
		return this.getAttribute('dimensions')
	}

	connectedCallback() {
		this.setAttribute('dimensions', localStorage.getItem('dimensions') || '16,16')
	}

	attributeChangedCallback(attribute, oldValue, newValue) {
		if (attribute === 'dimensions') {
			if (!this.loadingFile)
				this.generateNewGraph(newValue)
		}
	}
}

customElements.define('app-graphic', AppGraphic)