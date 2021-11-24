
import Config from './config';


export default function Label(canvas){

	if (Config.quotaLimit){
		return new Promise((success, fail) => {
			setTimeout(() => {
				fail('quota')
			}, 2000)
		})
	} else if (Config.cloudVision){
		let formData = new FormData();
		formData.append('image', canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));


		return new Promise((success, fail) => {
			let request = new XMLHttpRequest();
			request.timeout = 20000
			request.open('POST', '/see');
			request.addEventListener('load', () => {
				if (request.status == 200) {
					const response = JSON.parse(request.response)
					if (Array.isArray(response)){
						success(JSON.parse(request.response))
					} else if (response.error){
						fail(response.error)
					}
				} else {
					fail(request.status)
				}
			})
			request.addEventListener('error', fail)
			request.addEventListener('timeout', fail)
			request.send(formData)
		})
	} else {
		return new Promise((success) => {
			setTimeout(() => {
				// success([{
				// 	label : 'this is a very long multi word label',
				// 	score : 0.8
				// }, {
				// 	label : 'this is another very long multi word label multi word',
				// 	score : 0.8
				// }])
				success([{
					label : models[Math.floor(Math.random() * models.length)],
					score : 0.8
				}, {
					label : models[Math.floor(Math.random() * models.length)],
					score : 0.8
				}])
			}, 200)
		})
	}

}


let models = [
	'person',
	'bicycle',
	'car',
	'motorbike',
	'aeroplane',
	'bus',
	'train',
	'truck',
	'boat',
	'traffic light',
	'fire hydrant',
	'stop sign',
	'parking meter',
	'bench',
	'bird',
	'cat',
	'dog',
	'horse',
	'sheep',
	'cow',
	'elephant',
	'bear',
	'zebra',
	'giraffe',
	'backpack',
	'umbrella',
	'handbag',
	'tie',
	'suitcase',
	'frisbee',
	'skis',
	'snowboard',
	'sports ball',
	'kite',
	'baseball bat',
	'baseball glove',
	'skateboard',
	'surfboard',
	'tennis racket',
	'bottle',
	'wine glass',
	'cup',
	'fork',
	'knife',
	'spoon',
	'bowl',
	'banana',
	'apple',
	'sandwich',
	'orange',
	'broccoli',
	'carrot',
	'hot dog',
	'pizza',
	'donut',
	'cake',
	'chair',
	'sofa',
	'pottedplant',
	'bed',
	'diningtable',
	'toilet',
	'tvmonitor',
	'laptop',
	'mouse',
	'remote',
	'keyboard',
	'cell phone',
	'microwave',
	'oven',
	'toaster',
	'sink',
	'refrigerator',
	'book',
	'clock',
	'vase',
	'scissors',
	'teddy bear',
	'hair drier',
	'toothbrush'
]