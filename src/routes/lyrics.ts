
import MusicPosition from './position';


const couplets = [
	['Is that % I see?', 'Looks like % to me'],
	['Is that % or not?', 'Got % in this spot'],
	// ['%, that\'s what I say', 'Looks like % to me'],
	// ['I see %, right?', 'Got % in my sight'],
	['That\'s % on my screen', 'I think % is what I\'ve seen'],
	['Looks like % to me', 'I\'m seeing %, probably'],
	['I think % is what we\'ve got', 'Could be %, but maybe not'],
]

const confused = [
	['What is that i see?', 'This image is confusing me'],
	// ['Take another pic, okay?', 'Rocking Google Cloud Vision all day'],
	['I D K', 'Take another pic, okay?'],
	['I\'m not quite sure what we\'ve got', 'Please take another shot']
]

let history = []
let lastLineIndex = -1

/**
 * Get a random line which includes the labels.
 * Make sure it has a different index than the last one.
 */
function randomLine(labels){
	let randIndex = Math.floor(Math.random() * couplets.length)
	//make sure you don't repeat the line
	if (randIndex === lastLineIndex){
		return randomLine(labels)
	}
	lastLineIndex = randIndex
	let randLine = couplets[randIndex]
	randLine = randLine.slice()
	randLine[0] = randLine[0].replace(/%/g, labels[0].label)
	randLine[1] = randLine[1].replace(/%/g, labels[1].label)
	return randLine
}

/**
 * Given the array of labels in this form:
 * [ {
 * 	label : 'label text',
 * 	score : Number
 * }, ...]
 * Returns two lines which includes one of those labels and the labels 
 * that it used
 * @returns {Object} {lines : [], labels : []}
 */
function getLine(labels){
	if (labels.length > 1){
		//choose a label that haven't been used in a while 
		//reverse sort the labels by their position in the history
		labels = labels.sort((a, b) => {
			let aIndex = history.findIndex((l) => l.label === a.label) + 1
			let bIndex = history.findIndex((l) => l.label === b.label) + 1
			return aIndex - bIndex
		})
		let retLabels = labels.slice(0, 2)
		history = history.concat(retLabels)
		// put it in the line
		return { lines : randomLine(retLabels), labels : retLabels}
	} else {
		let randLine = confused[Math.floor(Math.random() * confused.length)]
		if (MusicPosition.end){
			//doesn't make sense to say take another shot at the very end
			randLine = confused[0]
		}
		return {lines: randLine.slice(), labels : []}
	}
}


export default {getLine}