

import type { ToneAudioBuffer } from 'tone';
import * as Tone from 'tone';
import Config from './config';
import MusicPosition from './position';

export default class Fill{
    private _beats: { 0: any; 1: any; 2: any }
    private _currentPlaying: any
    private _crash: any

	public buffers: ToneAudioBuffer[]

	constructor(){
		this._beats = {
			0 : new Tone.Player('/fill0.mp3').toDestination(),
			1 : new Tone.Player({ url : '/fill1.mp3', volume : -2}).toDestination(),
			2 : new Tone.Player({ url : '/fill2.mp3', volume : -3}).toDestination(),
		}

		this.buffers = Object.values( this._beats ).map(player => player.buffer);

		this._currentPlaying = this._beats[0]

		//loop all of them
		for (let b in this._beats){
			this._beats[b].loop = true
			this._beats[b].loopStart = '5m'
			this._beats[b].loopEnd = '6m'
		}

		this._crash = new Tone.Player('/crash.mp3').toDestination()
	}

	fill(){
		this._currentPlaying = this._beats[MusicPosition.fillPosition]
		this._currentPlaying.start(`@${Config.quantizeLevel}`, MusicPosition.end ? '2m' : 0)
	}

	fillEnd(){
		this._currentPlaying.stop(`@${Config.quantizeLevel}`)
		this._crash.start(`@${Config.quantizeLevel} - 8n`)
	}

	stop(){
		this._currentPlaying.stop()
		this._crash.stop()
	}
}