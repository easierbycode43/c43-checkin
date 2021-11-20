<script type='ts'>

// import './camera.scss';

import * as THREE from 'three';
import TWEEN from 'tween.js';
import * as Tone from 'tone';
import { onMount } from 'svelte';

import Config from './config';
import Music from './music';
import StartAudioContext from 'startaudiocontext';


const CAMERA_DIST = 10


class Canvas {
    private _camera: any;
    private _scene: any;
    private _renderer: any;
    private _plane: any;
    private _bouncing: boolean;
    private _bounceStart: number;
    private _bounceRate: number;
    private _changingColor: boolean;
    private _colorChangeTime: number;
    private _colors: any[];
    private _colorChangeIndex: number;
    private _interval: NodeJS.Timer;
    constructor(container){

        this._camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 )
        this._camera.position.z = CAMERA_DIST


        this._scene = new THREE.Scene()

        this._renderer = new THREE.WebGLRenderer({ antialias: false })
        container.appendChild(this._renderer.domElement)
        this._renderer.domElement.id = 'three'

        // make a test plane
        const material = new THREE.MeshBasicMaterial({ color : 0xffffff })
        // material.side = THREE.DoubleSide
        this._plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)

        // @ts-ignore
        window.plane = this._plane
        
        this._scene.add(this._plane)

        this._bouncing = false

        this._bounceStart = 0

        this._bounceRate = Tone.Time('4n').toMilliseconds()

        this._changingColor = false

        this._colorChangeTime = 0

        this._colorChangeTime = 0

        this._colors = [[7,222,0],[9,51,255],[93,17,255],[101,177,255],[255,42,2],[255,181,115],[250,196,0],[5,153,0],[255,251,83],[46,220,0],[246,168,0],[182,87,255],[194,208,0]]
            .map((rgb) => new THREE.Color(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255))

        this._loop()
    }

    _loop(time?){
        requestAnimationFrame(this._loop.bind(this))

        let now = Date.now()

        if (this._bouncing){
            // let bounceAmount = Math.sin(this._bounceRate * TWO_PI * (now - this._bounceStart) / 1000)
            // bounceAmount = (bounceAmount + 1)
            let bounceAmount = (now - this._bounceStart) % this._bounceRate
            bounceAmount /= this._bounceRate
            this._camera.position.z = CAMERA_DIST - (1 - bounceAmount) / 2
        }

        if (this._changingColor && ((now - this._colorChangeTime) > (this._bounceRate))){
            this._plane.material.color = this._colors[this._colorChangeIndex]
            this._colorChangeIndex = (this._colorChangeIndex + 1) % this._colors.length
            this._colorChangeTime = now
        }

        this._renderer.render( this._scene, this._camera )

        TWEEN.update(time);
    }

    changeColor(){
        this._changingColor = true
        this._colorChangeTime = Date.now()
    }

    repeatTexture(){
        const texture = this._plane.material.map
        // @ts-ignore
        window.texture = texture
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        const repeats = [1, 2, 4, 8]
        let index = 0
        this._interval = setInterval(() => {
            texture.repeat.x = repeats[index]
            texture.repeat.y = repeats[index]
            index = (index + 1) % repeats.length
        }, this._bounceRate)
    }

    endChangeColor(){
        this._changingColor = false
        this._plane.material.color = new THREE.Color(1, 1, 1)
        // clearInterval(this._interval)
        // this._plane.material.map.repeat.x = 1
        // this._plane.material.map.repeat.y = 1
    }

    /**
     * mirror the display for front facing cameras
     */
    mirror(){
        this._plane.scale.x *= -1
        this._plane.material.side = THREE.BackSide
        this._plane.material.needsUpdate = true
    }

    resize(vidWidth, vidHeight){



        //set the video plane size
        const vidAspect = vidWidth / vidHeight
        const camAspect = window.innerWidth / window.innerHeight

        this._plane.scale.x = vidAspect

        //http://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
        if (vidAspect > camAspect){
            this._camera.fov = 2 * Math.atan( 1 / ( 2 * CAMERA_DIST ) ) * ( 180 / Math.PI )
        } else {
            this._camera.fov = 2 * Math.atan( ( vidAspect / camAspect ) / ( 2 * CAMERA_DIST ) ) * ( 180 / Math.PI )
        }

        //THREE resize
        this._renderer.setPixelRatio( window.devicePixelRatio )
        this._renderer.setSize( window.innerWidth, window.innerHeight )

        const windowHalfX = window.innerWidth / 2
        const windowHalfY = window.innerHeight / 2
        this._camera.aspect = camAspect
        this._camera.updateProjectionMatrix()
        this._renderer.setSize( window.innerWidth, window.innerHeight )
    }

    setVideo(video){

        this._renderer.domElement.classList.add('visible')

        const texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        this._plane.material.map = texture
        this._plane.material.needsUpdate = true
    }

    bounce(){
        this._bouncing = true
        this._bounceStart = Date.now()
    }

    endBounce(){
        this._bouncing = false
    }

    fail(time = 4000){
        this._bouncing = false
        return new Promise((end) => {
            let plane = this._plane
            let scene = this._scene
            var tween = new TWEEN.Tween({scale : 1})
                .to({scale : 0}, time)
                .onUpdate(function(){
                    plane.scale.y = this.scale
                })
                .onComplete(function(){
                    scene.remove(plane)
                    end( void( 0 ) )
                })
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
        })
    }
}

class Camera {
    private _canvas: Canvas;
    private _video: HTMLVideoElement;
    private _constraints: { audio: boolean; video: { facingMode: { ideal: string; }; }; };
    private _frontFacing: boolean;
	constructor(container) {

		this._canvas = new Canvas(container)

		this._video = document.createElement('video')
		// @ts-ignore
		window.video = this._video

		this._constraints = { 
			audio: false, 
			video: {
				facingMode : { ideal: 'environment' }
			}
		}

		this._frontFacing = false;  // !mobile()
	}
	
	open(){

		let tries = 0
		return navigator.mediaDevices.getUserMedia(this._constraints).then((stream) => {

			// @ts-ignore
			window.stream = stream

			// stream.
			this._video.srcObject = stream
			this._video.autoplay = true

			this._video.classList.add('visible')
			this._canvas.setVideo(this._video)

			window.addEventListener('resize', this._resize.bind(this))
			//size it initially
			this._resize()
		})
	}

    error(){
		this.close()
		this._canvas.fail()
	}

	end(){
		return this._canvas.fail(Config.fadeOutTime * 1000)
	}

	close(){
		this._video.pause()
		return this._canvas.fail().then( () => {
			// @ts-ignore
			this._video.srcObject.getVideoTracks()[0].stop()
		})
	}

	_getImage(){
		const video = this._video
		if (video){
			const w = video.videoWidth
			const h = video.videoHeight
			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')
			// take a snapshot of the incoming image
			canvas.width = w
			canvas.height = h
			context.drawImage(video, 0, 0, w, h)
			return canvas
		}
	}

	label() {
		// return Label(this._getImage())
	}

	/**
	 * Set the sizing of the video box
	 */
	_resize(){
		let aspectRatio = this._video.videoWidth / this._video.videoHeight
		if (isNaN(aspectRatio)){
			setTimeout(() => this._resize(), 100)
		} else {
			let windowRatio = window.innerWidth / window.innerHeight
			this._video.classList.add('active')
			if (aspectRatio > windowRatio){
				this._video.classList.add('wide')
				this._video.classList.remove('tall')
			} else {
				this._video.classList.add('tall')
				this._video.classList.remove('wide')
			}
			this._canvas.resize(this._video.videoWidth, this._video.videoHeight)

			if (this._frontFacing){
				this._canvas.mirror()
			}
		}
	}

	takePicture(){
		this._video.pause()
		this._canvas.changeColor()
	}

	resume(){
		this._canvas.endBounce()
		this._canvas.endChangeColor()
		const promise = this._video.play()
		if (promise){
			return promise
		} else {
			return Promise.resolve()
		}
	}

	bounce(){
		this._canvas.bounce()
	}

	changeColor(){
		this._canvas.changeColor()
	}

	giorgioBreak(){
		this._canvas.changeColor()
	}
}




onMount(() => {

    // splash
    // ..
    // loader
    const loader = document.createElement('div')
    StartAudioContext( Tone.context, loader )



    if ( window.location.search.indexOf('fullscreen') !== -1 )  Config.fullscreen = true;
    Config.fadeOutTime = Tone.Time('4m').toSeconds();

    const camera = new Camera( document.body );
    const music = new Music()

    new Tone.ToneAudioBuffers(music.buffers, () => {
        camera.open().then(() => {
            console.log( '!! huzzah !!' );
            // closeButton.show()
            const time = music.start()
            // return voice.intro(time)
        });
    });

})
</script>