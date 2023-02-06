const template = document.createElement('template')
template.innerHTML = /*html*/`
	<abbr title="">
		<div></div>
	</abbr>
`

export default class GraphicSquare extends HTMLElement {
	constructor(x, y, bg) {
		super()
		this.x = x
		this.y = y
		this.attachShadow({mode: 'open'})
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.currentColor = localStorage.getItem('currentColor') || '#ccc'

		this.shadowRoot.querySelector('abbr').setAttribute('title', `Linha: ${ this.y }, Coluna: ${ this.x }`)

		this.shadowRoot.querySelector('div').style = `
			width: 32px;
			height: 32px;
			margin: 0;
			background: ${ bg || localStorage.getItem('backgroundColor') || 'transparent' };
			border: 1px solid ${ localStorage.getItem('borderColor') || '#202020' };
			box-sizing: border-box;
		`

		if (bg)
			this.setAttribute('color', bg)

		this.draw = (e) => {
			switch (e.which) {
				case 1:
					this.shadowRoot.querySelector('div').style.background = this.currentColor
					this.setAttribute('color', this.currentColor)
					break
				case 3:
					this.shadowRoot.querySelector('div').style.background = localStorage.getItem('backgroundColor') || 'transparent'
					this.removeAttribute('color')
					break
			}
		}

		this.onmouseenter = (e) => this.draw(e)
		this.onmousedown = (e) => this.draw(e)

		document.addEventListener('colorChanged', (e) => {
			this.currentColor = e.detail
		})
	}
}

customElements.define('graphic-square', GraphicSquare)