
import * as Tone from 'tone';
const Player = Tone.Player;
// import Text from './text';
import './shutter.scss';
import EventEmitter from 'eventemitter3';

export default class Shutter extends EventEmitter{
    private _shutterButton: HTMLDivElement;
    private _flashEl: HTMLDivElement;
    _shutterSound: Tone.Player;

	constructor(container){
		super()

		this._shutterButton = document.createElement('div')
		this._shutterButton.id = 'shutterButton'
		container.appendChild(this._shutterButton)

		const innerFill = document.createElement('div')
		innerFill.id = 'innerShutter'
		this._shutterButton.appendChild(innerFill)

		this._flashEl = document.createElement('div')
		this._flashEl.id = 'flash'
		container.appendChild(this._flashEl)

		this._shutterSound = new Player('/shutter.mp3').toDestination()

		this._shutterButton.addEventListener('click', (e) => {
			e.preventDefault()
			this._flash()
			this.hide()
			this.emit('click')
		})
	}

	/**
	 * flash the screen
	 * on the screen like you're taking a pic
	 */
	_flash(){
		this._shutterSound.start()
		this._flashEl.className = 'visible'
		setTimeout(() => {
			this._flashEl.className = ''
		}, 250)
	}

	hide(){
		this._shutterButton.classList.remove('visible')
		// Text.shiftDown()
	}

	remove(){
		this._shutterButton.remove()
	}

	show(){
		this._shutterButton.classList.add('visible')
		// Text.shiftUp()
	}
}