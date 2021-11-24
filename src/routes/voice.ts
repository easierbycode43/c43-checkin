
import Lyrics from './lyrics';
import * as Tone from 'tone';
const {
	Time,
	ToneAudioBuffer: Buffer
 } = Tone;
 import SpeakBuffer from './speakbuffer';


export default class Voice {
	constructor(){
		// this._intro = new Intro()

		// this._filler = new Filler()

		// this._wait = new Wait()
	}

	// intro(time){
	// 	return this._intro.start(time)
	// }

	// fill(){
	// 	this._filler.start()
	// }

	// endFill(){
	// 	this._filler.stop()
	// 	this.wait()
	// }

	// wait(){
	// 	this._wait.start()
	// }

	// endWait(){
	// 	this._wait.stop()
	// }

	// stop(){
	// 	VoiceEffects.stop()
	// 	const endLines = Lines.end
	// 	return SpeakBuffer.play(endLines[1].text, endLines[1].buffer, Time(), 'end')
	// }

	// //speak the error lines
	// error(){
	// 	const errorLines = Lines.end
	// 	return SpeakBuffer.play(errorLines[0].text, errorLines[0].buffer, Time('+0:3'), 'end')
	// 		.then(() => {
	// 			// add a little time at the end
	// 			return new Promise((done) => {
	// 				setTimeout(done, 3000)
	// 			})
	// 		})
	// }

	// tryAgain(time){
	// 	const errorLines = Lines.end
	// 	return SpeakBuffer.play(errorLines[2].text, errorLines[2].buffer, time, 'line')
	// 		.then(() => {
	// 			// add a little time at the end
	// 			return new Promise((done) => {
	// 				setTimeout(done, 600)
	// 			})
	// 		})
	// }

	// openCamera(){
	// 	const errorLines = Lines.end
	// 	return SpeakBuffer.play(errorLines[3].text, errorLines[3].buffer, Time('+0.1'), 'dry')
	// 		.then(() => {
	// 			// add a little time at the end
	// 			return new Promise((done) => {
	// 				setTimeout(done, 1200)
	// 			})
	// 		})
	// }

    getApiUrl( line ) {
        // return `http://localhost:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=${encodeURIComponent( line )}%0A&OUTPUT_TEXT=&effect_Volume_selected=&effect_Volume_parameters=amount%3A2.0%3B&effect_Volume_default=Default&effect_Volume_help=Help&effect_TractScaler_selected=&effect_TractScaler_parameters=amount%3A1.5%3B&effect_TractScaler_default=Default&effect_TractScaler_help=Help&effect_F0Scale_selected=&effect_F0Scale_parameters=f0Scale%3A2.0%3B&effect_F0Scale_default=Default&effect_F0Scale_help=Help&effect_F0Add_selected=&effect_F0Add_parameters=f0Add%3A50.0%3B&effect_F0Add_default=Default&effect_F0Add_help=Help&effect_Rate_selected=&effect_Rate_parameters=durScale%3A1.5%3B&effect_Rate_default=Default&effect_Rate_help=Help&effect_Robot_selected=&effect_Robot_parameters=amount%3A100.0%3B&effect_Robot_default=Default&effect_Robot_help=Help&effect_Whisper_selected=&effect_Whisper_parameters=amount%3A100.0%3B&effect_Whisper_default=Default&effect_Whisper_help=Help&effect_Stadium_selected=&effect_Stadium_parameters=amount%3A100.0&effect_Stadium_default=Default&effect_Stadium_help=Help&effect_Chorus_selected=&effect_Chorus_parameters=delay1%3A466%3Bamp1%3A0.54%3Bdelay2%3A600%3Bamp2%3A-0.10%3Bdelay3%3A250%3Bamp3%3A0.30&effect_Chorus_default=Default&effect_Chorus_help=Help&effect_FIRFilter_selected=&effect_FIRFilter_parameters=type%3A3%3Bfc1%3A500.0%3Bfc2%3A2000.0&effect_FIRFilter_default=Default&effect_FIRFilter_help=Help&effect_JetPilot_selected=&effect_JetPilot_parameters=&effect_JetPilot_default=Default&effect_JetPilot_help=Help&HELP_TEXT=&exampleTexts=&VOICE_SELECTIONS=cmu-slt%20en_US%20female%20unitselection%20general&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&AUDIO=WAVE_FILE`
        return `http://localhost:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=${encodeURIComponent( line )}&AUDIO_OUT=WAVE_FILE&LOCALE=en_US&AUDIO=WAVE_FILE`
    }

    getBuffer(line, rate=1, pitch=0){
        return new Promise((done, err) => {
            // const buff = new Buffer(`speak/?text=${encodeURIComponent(line)}&rate=${rate}&pitch=${pitch}`, () => {
            const buff = new Buffer(this.getApiUrl( line ), () => {
                done(buff)
            }, err)
        })
    }

	/**
	 * Formats the return promise
	 * {
	 * 		text : 'text here',
	 * 		buffer : Tone.Buffer,
	 * 		label : {} // label obj
	 * 	}
	 */
	_loadLine(text, label){
		// return SpeakBuffer.getBuffer(text, 1.1, 1).then( (buffer) => {
        return this.getBuffer(text, 1.1, 1).then( (buffer) => {
			return { text, label, buffer }
		})

        // 
	}

	/**
	 * Loads the lines, resolves the promise at the beginning of the next phrase. 
	 * Returns both lines in this format:
	 * [
	 * 	{
	 * 		text : 'text here',
	 * 		buffer : Tone.Buffer,
	 * 		label : {} // label obj
	 * 	}
	 * ]
	 */
	load(labels){
		let lyrics = Lyrics.getLine(labels)
		return Promise.all([
			this._loadLine(lyrics.lines[0], lyrics.labels[0]),
			this._loadLine(lyrics.lines[1], lyrics.labels[1])
		])
	}

	_speakLine(line, time){
		return SpeakBuffer.play(line.text, line.buffer, time, 'line', line.label)
	}

	speak(lines, time){
		this._speakLine(lines[0], Time(time))
		// return this._speakLine(lines[1], Time(time).add('2m')).then( () => {
		return this._speakLine(lines[1], Time(time)).then( () => {
			// add a short timeout at the end
			return new Promise((done) => {
				setTimeout(done, 1400)
			})
		})
	}
}