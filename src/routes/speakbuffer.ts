
import * as Tone from 'tone';
const {
    Time,
    ToneAudioBuffer: Buffer,
    ToneBufferSource: BufferSource
} = Tone;
import Text from './text'
import VoiceEffects from './voiceeffects';


const currentPlaying = []

function play(text, buffer, time, effect='dry', label){
	let source;
	return new Promise( (done) => {
		if (time instanceof Time) {
            // @ts-ignore
			time = time.toSeconds()
		}

		source = new BufferSource(buffer)
		currentPlaying.push(source)
		source.fadeIn = 0.01
		source.fadeOut = 0.01
		let duration = buffer.duration
		if (effect === 'line' || effect === 'end'){
			// let landTime = time + Time('4n').mult(4.67).toSeconds()
			let landTime = time + Time('4n').toSeconds()
			let startTime = landTime - buffer.duration
			VoiceEffects[effect](source, time + Time('1m').toSeconds())
			time = startTime
			if (time < Tone.now()){
				time = Tone.now()
			}
			if (effect === 'end'){
				duration *= 1.3
			}
		} else if (VoiceEffects.hasOwnProperty(effect)){
			VoiceEffects[effect](source)
		}

		source.start(time)
		source.onended = done
		Text.show(text, time, duration, label)
	}).then(() => {
		currentPlaying.splice(currentPlaying.indexOf(source), 1)
	})
}

function stop(time){
	currentPlaying.forEach((src) => {
		src.stop(time)
	})
	// Text.clear()
}

function getApiUrl( line ) {
    return `http://localhost:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=${encodeURIComponent( line )}&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&AUDIO=WAVE_FILE`
}

function getBuffer(line, rate=1, pitch=0){
	return new Promise((done, err) => {
        const buff = new Buffer(getApiUrl( line ), () => {
			done(buff)
		}, err)
	})
}

export default {
	play, getBuffer, stop
}