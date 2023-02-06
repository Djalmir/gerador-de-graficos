const style = document.createElement('style')
style.textContent = /*css*/`
	#container {
		padding: 13px;
		background: #303030;
		box-shadow: 0 0 7px #0000008d;
		border-radius: 5px;
	}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<link rel="stylesheet" type="text/css" href="./app.css"/>
	<div id="container">
		<button id="saveBt">Salvar projeto</button>
		<button id="openBt">Abrir projeto</button>
		<input type="file" id="filePicker" accept=".json" hidden>
		<button id="exportBt">Exportar Imagem</button>
	</div>
`

export default class projectManager extends HTMLElement {

	constructor() {
		super()
		this.attachShadow({mode: 'open'})
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.shadowRoot.querySelector('#saveBt').onclick = () => {
			let fileName = prompt('Informe o nome do projeto')
			let project = {
				dimensions: localStorage.getItem('dimensions') || '16,16',
				backgroundColor: localStorage.getItem('backgroundColor') || '#303030',
				borderColor: localStorage.getItem('borderColor') || '#202020',
				currentColor: localStorage.getItem('currentColor') || '#ccc',
				recentColors: localStorage.getItem('recentColors') || '[]',
				children: Array.from(document.querySelector('#appGraphic').shadowRoot.querySelector('#graphic').children).map((child) => {
					return child.getAttribute('color') || ''
				})
			}
			let a = document.createElement('a')
			a.href = `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify(project)) }`
			a.download = `${ fileName }.json`
			a.click()
		}

		this.filePicker = this.shadowRoot.querySelector('#filePicker')
		const openFile = () => {
			if (this.filePicker.files.length) {
				fetch(URL.createObjectURL(this.filePicker.files[0]))
					.then(res => res.json())
					.then((res) => {
						localStorage.setItem('dimensions', res.dimensions)
						this.setAttribute('dimensions', res.dimensions)
						localStorage.setItem('backgroundColor', res.backgroundColor)
						localStorage.setItem('borderColor', res.borderColor)
						localStorage.setItem('currentColor', res.currentColor)
						localStorage.setItem('recentColors', res.recentColors)
						localStorage.setItem('children', JSON.stringify(res.children))
						document.dispatchEvent(new CustomEvent('loadFile'))
					})
			}
		}
		this.filePicker.onchange = () => {openFile()}

		this.shadowRoot.querySelector('#openBt').onclick = () => {
			this.filePicker.click()
		}

		this.shadowRoot.querySelector('#exportBt').onclick = () => {
			document.querySelector('#appGraphic').currentZoom = 1
			let container = document.querySelector('#appGraphic').shadowRoot.querySelector('#container')
			container.scrollTo(0, 0)
			let graphic = container.querySelector('#graphic')
			graphic.style.transform = `scale(1)`
			let canvas = document.createElement('canvas')
			let columns = Number(localStorage.getItem('dimensions').split(',')[0].trim()) || 16
			let rows = Number(localStorage.getItem('dimensions').split(',')[1].trim()) || 16
			canvas.width = columns * 32 + 1
			canvas.height = rows * 32
			let ctx = canvas.getContext('2d')
			ctx.fillStyle = localStorage.getItem('borderColor') || '#202020'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			let squares = document.querySelector('#appGraphic').shadowRoot.querySelectorAll('graphic-square')
			squares.forEach((square) => {
				let boundings = square.getBoundingClientRect()
				ctx.fillStyle = square.getAttribute('color') || localStorage.getItem('backgroundColor') || '#202020'
				ctx.fillRect(boundings.x + 2 - square.parentElement.offsetLeft, boundings.y + 1 - square.parentElement.offsetTop, 30, 30)
			})

			let img = new Image()
			img.src = canvas.toDataURL()
			img.style.width = '100%'
			img.style.height = '100%'
			let a = document.createElement('a')
			a.href = img.src
			a.download = `Graphic_${ new Date() }.png`
			a.click()
			a.remove()
		}
	}

}

customElements.define('project-manager', projectManager)