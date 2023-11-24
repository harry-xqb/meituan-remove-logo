import SuperGif from 'libgif';
import {fabric} from "fabric";
import Decimal from "decimal.js";
import {CanvasRefProps} from "components/LogoEditor/Canvas";
import {MutableRefObject} from "react";
import gifshot from "gifshot";
import {divide} from "lodash";


const dataURLtoFile = (dataurl, filename) => {
	const arr = dataurl.split(',');
	const mime = arr[0].match(/:(.*?);/)[1];
	const bstr = atob(arr[1]);
	var n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
}
export const loadFabricImage = (url, scale = 1): Promise<fabric.Image> => {
	return new Promise(resolve => {
		fabric.Image.fromURL(
			url, // 参数1：图片路径
			img => { // 参数2：图片加载完成后的回调函数
				img.scaleX = scale
				img.scaleY = scale
				resolve(img as any)
			}, {crossOrigin: 'anonymous'})
	})
}

function convertImgToBase64(url){
	return new Promise(resolve => {
		let canvas = document.createElement('CANVAS'),
			ctx = canvas.getContext('2d'),
			img = new Image;
			img.crossOrigin = 'Anonymous';
			img.onload = function(){
				canvas.height = img.height;
				canvas.width = img.width;
				ctx.drawImage(img,0,0);
				const dataURL = canvas.toDataURL( 'image/png');
				resolve(dataURL)
				canvas = null;
			};
		img.src = url;
	})

}

// gif分帧
export const getGifUrls = (imageUrl: string): Promise<string[]> => {
	return new Promise(async (resolve) => {
		if(!imageUrl.includes('gif')) {
			const res = await convertImgToBase64(imageUrl)
			resolve({
				urlList: [res],
				speed: 0
			})
			return
		}
		const gifImg = document.createElement('img');
		// gif库需要img标签配置下面两个属性
		gifImg.setAttribute('rel:animated_src', imageUrl);
		gifImg.setAttribute('rel:auto_play', '0');
		const div = document.createElement('div');
		div.appendChild(gifImg); //防止报错
		// 新建gif实例
		const rub = new SuperGif({ gif: gifImg });
		rub.load( async () => {
			const urlList = [];
			for (let i = 1; i <= rub.get_length(); i++) {
				// 遍历gif实例的每一帧
				rub.move_to(i);
				// 将每一帧的canvas转换成file对象
				let cur_file = dataURLtoFile(rub.get_canvas().toDataURL('image/png'), `gif-${i}`);
				urlList.push(URL.createObjectURL(cur_file))
			}
			resolve({
				urlList,
				speed: Math.max(100, divide(rub.get_duration_ms(), urlList.length))
			})
		})

	})
}

// 根据urls获取fabric图片
export const getImagesByUrls = async (urls: string[], scale): Promise<fabric.Image[]> => {
	const images = await Promise.all( urls.map(url => loadFabricImage(url, scale)))
	return images
}

// 重置logo尺寸
export const resetLogoScale = (canvas: fabric.Canvas, scale: number) => {
	const objects = canvas?.getObjects()
	objects?.forEach(obj => {
		obj.scaleX = Decimal.div(obj.scaleX || 0, scale).toNumber()
		obj.scaleY = Decimal.div(obj.scaleY || 0, scale).toNumber()
		obj.top = Decimal.div(obj.top || 0, scale).toNumber()
		obj.left = Decimal.div(obj.left || 0, scale).toNumber()
		canvas.setActiveObject(obj)
	})
}

export const getCanvasSnapshot = (canvas: fabric.Canvas, url: string): Promise<string> => {
	return new Promise(async (resolve) => {
		const image = await loadFabricImage(url, 1)
		canvas.setBackgroundImage(image, () => {
			canvas.renderAll()
			const url = canvas.toDataURL({
				format: 'png',
				width: image.width,
				height: image.height
			})
			resolve(url)
		});
	})
}
// 生成绘图结果
export const generateResultImage =  (canvasRef: MutableRefObject<CanvasRefProps>): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		const virtualCanvas = document.createElement('canvas')
		const copyCanvas = new fabric.Canvas(virtualCanvas);
		const canvas = canvasRef.current.getFabricCanvas()
		const gifPlayer = canvasRef.current.getGifPlayer()
		const json = canvas.toJSON()
		const originScale = canvas.backgroundImage.scaleX || 0
		const scale =  Decimal.div(originScale ,1).toNumber()
		const width = canvas.backgroundImage.width
		const height = canvas.backgroundImage.height
		copyCanvas.width = width;
		copyCanvas.height = height
		copyCanvas.setWidth(width!)
		copyCanvas.setHeight(height!)
		if(json.objects.length === 0 && gifPlayer.speed === gifPlayer.originSpeed) {
			resolve(gifPlayer.originImageUrl)
			virtualCanvas.parentElement.removeChild(virtualCanvas)
			return
		}
		copyCanvas.loadFromJSON(json, async () => {
			resetLogoScale(copyCanvas, scale)
			const list = gifPlayer.urls.map(url => getCanvasSnapshot(copyCanvas, url))
			const urlList = await Promise.all(list)
			if(urlList.length === 1) {
				resolve(list[0])
				virtualCanvas.parentElement.removeChild(virtualCanvas)
				return
			}
			gifshot.createGIF({
				gifWidth: width,
				gifHeight: height,
				images: urlList,
				interval: gifPlayer.speed / 1000,
			}, function (obj) {
				if (!obj.error) {
					// 改成png能美团上传
					resolve(obj.image?.replace('image/gif', 'image/png'))
				} else {
					console.error(obj)
					reject(obj)
				}
				virtualCanvas.parentElement.removeChild(virtualCanvas)
				gifPlayer.play()
			});
		})
	})
}

