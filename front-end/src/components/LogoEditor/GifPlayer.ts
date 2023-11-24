import {fabric} from "fabric";

class GifPlayer {

	images: fabric.Image[] = []
	urls: string[]
	fabricCanvas: fabric.Canvas
	isPlaying: boolean = false
	timer: number = 0
	isGif: boolean = false
	originImageUrl: string
	originSpeed: number = 0
	speed: number = 0
	constructor({
		            images, urls, fabricCanvas, isGif, originImageUrl, speed
	            }: {
		images: fabric.Image[], urls: string[], fabricCanvas: fabric.Canvas, isGif: boolean, originImageUrl: string, speed: number
	}) {
		this.images = images
		this.fabricCanvas = fabricCanvas
		this.urls = urls
		this.isGif = isGif
		this.originImageUrl = originImageUrl
		this.speed = speed
		this.originSpeed = speed
	}

	play = () => {
		if(!this.isGif) {
			return
		}
		if (this.isPlaying) {
			return
		}
		this.isPlaying = true
		const loopPlay = (index = 0) => {
			this.fabricCanvas.setBackgroundImage(this.images[index], () => {
				this.fabricCanvas.renderAll()
				this.timer = setTimeout(() => {
					loopPlay((index + 1) % this.images.length)
				}, this.speed)
			})
		}
		loopPlay()
	}
	pause = () => {
		this.isPlaying = false
		if(this.timer) {
			clearTimeout(this.timer)
		}
	}

}

export default GifPlayer