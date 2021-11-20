
import type { ToneAudioBuffer } from 'tone'
import * as Tone from 'tone'
const Player = Tone.Player
import Config from './config'
const Time = Tone.Time
import MusicPosition from './position'
const Transport = Tone.Transport

const backgroundVolume = -8

export default class BackgroundMusic {
    private _player: Tone.Player
    private _outro: Tone.Player
    private _applause: Tone.Player
    private _ended: boolean

	public buffers: ToneAudioBuffer[] = []

	constructor(){
		this._player = new Player('/racer.mp3').toDestination()
		this.buffers.push( this._player.buffer );
		this._player.volume.value = backgroundVolume

		const startLoop = MusicPosition.backgroundLoop
		// set it to loop
		this._player.loopStart = startLoop.loopStart
		this._player.loopEnd = startLoop.loopEnd
		this._player.loop = true

		//the outro music		
		this._outro = new Player('/end.mp3').toDestination()
		this.buffers.push( this._outro.buffer );
		this._outro.volume.value = -2

		this._applause = new Player('/applause.mp3').toDestination()
		this.buffers.push( this._applause.buffer );
		this._applause.volume.value = -4

		this._ended = false

	}

	start(time){
		this._player.start(time, MusicPosition.backgroundLoop.start)
	}

	fill(){
		// duck the volume out immediately
		let stopTime = Time(`@${Config.quantizeLevel}`).toSeconds()
		this._player.stop(`${stopTime} + 4n`)
		this._player.volume.rampTo(-Infinity, '4n', stopTime)
	}

	fillEnd(){
		if (!this._ended){
			let startTime = Time(`@${Config.quantizeLevel}`).toSeconds()
			const loopPosition = MusicPosition.backgroundLoop
			// set it to loop
			this._player.loopStart = loopPosition.loopStart
			this._player.loopEnd = loopPosition.loopEnd
			this._player.start(startTime, loopPosition.start)
			this._player.volume.rampTo(backgroundVolume, 0.01, startTime)
		}
	}

	stop(){
		this._ended = true
		const outTime = Time('@4n')
		this._outro.start(+outTime, 0)
		this._outro.volume.rampTo(-Infinity, '4m', +outTime)
		this._player.volume.rampTo(-Infinity, '2n')
	}

	end(){
		this._ended = true
		this._player.volume.rampTo(-Infinity, Config.fadeOutTime)
		this._applause.start()
	}
}