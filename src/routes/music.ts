
import * as Tone from 'tone'
const Transport = Tone.Transport
const Loop = Tone.Loop
import Background from './background'
// const Time = Tone.Time
import Fill from './fill'
import Config from './config'
import type { ToneAudioBuffer, ToneAudioBuffers, ToneAudioBuffersUrlMap } from 'tone'
const Master = Tone.Destination
// import MusicPosition from './position'

// Transport.bpm.value = 128

export default class Music{
    private _bgMusic: Background
    private _fill: Fill
    private _speaker: any

	public buffers: ToneAudioBuffersUrlMap

	constructor(){

		this._bgMusic = new Background()

		this._fill = new Fill()

		let buffers = this._fill.buffers.concat( this._bgMusic.buffers );
		buffers.forEach(( buffer, idx ) => {
			if ( idx === 0 )  return this.buffers = {}, this.buffers[0] = buffer;
			this.buffers[idx] = buffer;
		});

		return this;

	}

	start(){
		let startTime = Transport.now() + 0.7
		Transport.start(startTime)
		this._bgMusic.start(startTime)
		Master.mute = false
		return startTime
	}

	stop(){
		this._bgMusic.stop()
		this._fill.stop()
		// Master.volume.rampTo(-Infinity, 2)
		Transport.stop()
		Transport.clear(0)
	}

	fill(){
		if (Transport.state === 'started'){
			this._bgMusic.fill()
			this._fill.fill()
		}
	}

	endFill(){
		if (Transport.state === 'started'){
			this._bgMusic.fillEnd()
			this._fill.fillEnd()
		}
		return new Promise((done) => {
			Transport.scheduleOnce( (time) => {
				done(time)
			}, `@${Config.quantizeLevel}`)
		})
	}

	/**
	 * load the text line from the server
	 */
	loadLine(labels){
		return this._speaker.loadLine(labels)
	}

	end(){
		return this._bgMusic.end()
	}
	 
}