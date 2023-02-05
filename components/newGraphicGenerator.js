const style = document.createElement('style')
style.textContent = /*css*/`
	#container {
		display: flex;
		flex-direction: column;
		width: fit-content;
		gap: 13px;
		padding: 13px;
		background: #303030;
		box-shadow: 0 0 7px #0000008d;
		border-radius: 5px;
	}

	#dimensionsContainer {
		display: flex;
    justify-content: center;
    align-items: center;
		gap: 7px;
	}

	input{
		width: 140px;
	}

	#colorsContainer {
		display: flex;
    justify-content: flex-end;
    align-items: center;
		gap: 7px;
	}

	input[type="color"]{
		width: 42px;
		height: 23px;
		padding: 0 2px;
		cursor: pointer;
	}
`

const template = document.createElement('template')
template.innerHTML = /*html*/`
	<link rel="stylesheet" type="text/css" href="/app.css"/>
	<form id="container" action="javascript:void(0)">
		<div id="dimensionsContainer">
			<label>
				Largura
				<input type="number" id="widthInput" value="16">
			</label>
			<label>
				Altura
				<input type="number" id="heightInput" value="16">
			</label>
		</div>
		<div id="colorsContainer">
			<label>
				Cor de fundo
				<input type="color" id="bgColorSelector" value="#303030"/>
			</label>
			<label>
				Bordas
				<input type="color" id="borderColorSelector" value="#202020"/>
			</label>
		</div>
		<button type="submit" id="newGraphButton">Novo Gráfico</button>
</form>
`

export default class newGraphicGenerator extends HTMLElement {
	static get observedAttributes() {
		return ['hasChanges']
	}

	constructor() {
		super()
		this.attachShadow({mode: 'open'})
		this.shadowRoot.appendChild(style.cloneNode(true))
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		let newGraphButton = this.shadowRoot.querySelector('#newGraphButton')
		let widthInput = this.shadowRoot.querySelector('#widthInput')
		let heightInput = this.shadowRoot.querySelector('#heightInput')

		let bgColorSelector = this.shadowRoot.querySelector('#bgColorSelector')
		bgColorSelector.value = localStorage.getItem('backgroundColor')||'#303030'
		bgColorSelector.oninput = () => {
			localStorage.setItem('backgroundColor', bgColorSelector.value)
		}

		let borderColorSelector = this.shadowRoot.querySelector('#borderColorSelector')
		borderColorSelector.value = localStorage.getItem('borderColor')||'#202020'
		borderColorSelector.oninput = () => {
			localStorage.setItem('borderColor', borderColorSelector.value)
		}

		newGraphButton.onclick = () => {
			if (!widthInput.value || !heightInput.value)
				alert("Insira a largura e altura do gráfico a ser gerado.")
			else {
				if (document.body.querySelector('#appGraphic').shadowRoot.querySelector('#graphic').querySelector('[color]')) {
					if (confirm('Qualquer trabalho não salvo será perdido. Você quer mesmo criar um novo gráfico?')) {
						this.dispatchEvent(new CustomEvent('generateNewGraph', {detail: `${ widthInput.value }, ${ heightInput.value }`}))
					}
				}
				else {
					this.dispatchEvent(new CustomEvent('generateNewGraph', {detail: `${ widthInput.value }, ${ heightInput.value }`}))
				}
			}
		}
	}
}

customElements.define('new-graphic-generator', newGraphicGenerator)