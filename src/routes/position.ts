
import Config from './config';
let position = Config.startingPosition

const LoopPosition = [{
	start : 0,
	loopStart : '10m',
	loopEnd : '18m',
},
{
	start : '10m',
	loopStart : '10m',
	loopEnd : '18m',
},
{
	start : '18m',
	loopStart : '18m',
	loopEnd : '26m',
},
{
	start : '42m',
	loopStart : '42m',
	loopEnd : '50m',
},
{
	start : '42m',
	loopStart : '42m',
	loopEnd : '50m',
},
{
	start : '50m',
	loopStart : '50m',
	loopEnd : '58m',
}]

const FillIndices = [0, 0, 1, 1, 2, 2]

const FillerTextIndices = [0, 1, 2, 3, 4, 5]

class MusicPosition {

	get position(){
		return position
	}
	set position(val){
		position = val
	}

	get max(){
		return LoopPosition.length
	}

	get progress(){
		return position / (this.max - 1)
	}

	get backgroundLoop(){
		return LoopPosition[position]
	}

	get fillPosition(){
		return FillIndices[position]
	}

	get fillerTextPosition(){
		return FillerTextIndices[position]
	}

	get giorgioBreak(){
		return false
		// return position === 5
	}

	get end(){
		return position === (this.max - 1)
	}

	get quantizationTime(){
		if (position >= 3){
			return '@1m'
		} else {
			return '@4n'
		}
	}
}

export default new MusicPosition