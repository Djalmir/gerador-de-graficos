import newGraphicGenerator from './components/newGraphicGenerator.js'
import appGraphic from './components/appGraphic.js'
import colorSelector from './components/colorSelector.js'
import projectManager from './components/projectManager.js'

let graphicGenerator = document.querySelector('#graphicGenerator')
let graphic = document.querySelector('#appGraphic')
graphicGenerator.addEventListener('generateNewGraph', (e) => {
	localStorage.setItem('dimensions', e.detail)
	graphic.setAttribute('dimensions', e.detail)
})