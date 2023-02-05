import newGraphicGenerator from './components/newGraphicGenerator.js'
import appGraphic from './components/appGraphic.js'
import colorSelector from './components/colorSelector.js'
import projectManager from './components/projectManager.js'

let graphicGenerator = document.querySelector('#graphicGenerator')
let graphic = document.querySelector('#appGraphic')
let manager = document.querySelector('#projectManager')
graphicGenerator.addEventListener('generateNewGraph', (e) => {
	graphic.setAttribute('dimensions', e.detail)
	manager.setAttribute('dimensions', e.detail)
})