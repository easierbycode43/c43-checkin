
import './close.scss'
import EventEmitter from 'eventemitter3';


export default class Close extends EventEmitter{
    private _closeButton: HTMLDivElement
    private _container: any

	constructor(container){
		super()

		this._closeButton = document.createElement('div')
		this._closeButton.id = 'closeButton'
		this._closeButton.innerText = '.: X :.'
		container.appendChild(this._closeButton)

		this._closeButton.addEventListener('click', (e) => {
			e.preventDefault()
			// this.end()
			this._closeButton.remove()
			this.emit('click')
		})

		this._container = container
	}

	hide(){
		this._closeButton.classList.remove('visible')
	}

	show(){
		this._closeButton.classList.add('visible')
	}

	end(){
		//put up a big blocking screen with the option to restart
		const end = document.createElement('div')
		end.id = 'end'
		this._container.appendChild(end)

		const textContainer = document.createElement('div')
		textContainer.id = 'text'
		end.appendChild(textContainer)


		const restText = document.createElement('div')
		restText.id = 'rest'
		restText.innerHTML = '<a onclick="window.location.reload()">restart</a> or <a href="/">learn about C43</a>'
		textContainer.appendChild(restText)
	}
}