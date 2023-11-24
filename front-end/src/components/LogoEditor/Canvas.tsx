import React, {useEffect, useImperativeHandle, useRef} from 'react';
import {fabric} from 'fabric'
import {getGifUrls, getImagesByUrls, loadFabricImage, resetLogoScale} from "components/LogoEditor/util";
import GifPlayer from "components/LogoEditor/GifPlayer";
import {useLogoEditor} from "components/LogoEditor/context";
import api from "api/index";
import Decimal from "decimal.js";
import {useRequest} from "ahooks";
import { TemplateJSONProps } from "api/logoApi";

/**
 * 画布
 * @constructor
 */
export interface CanvasRefProps {
	getFabricCanvas: () => fabric.Canvas
	addImage: (url: string, name: string, id: string) => Promise<void>
	getGifPlayer: () => GifPlayer
}
interface CanvasProps {
	width: number
	backgroundImageUrl: string
	templateJSON?: TemplateJSONProps
	onCanvasInitFinish?: () => void
}
const Canvas = React.forwardRef<CanvasRefProps, CanvasProps>((props, ref) => {
	const canvasRef = useRef<HTMLCanvasElement | null >(null)
	const fabricCanvasRef = useRef<fabric.Canvas>()
	const { width, backgroundImageUrl, templateJSON, onCanvasInitFinish } = props
	const isGifImage = backgroundImageUrl.endsWith('gif')
	const scaleRef = useRef<number>(1)
	const gifPlayerRef = useRef<GifPlayer>()
	const { templateId } = useLogoEditor()
	// 加载背景图
	const loadBackingImage = async (image: string) => {
		gifPlayerRef.current?.pause()
		const bgImage = await loadFabricImage(image)
		const scale = Decimal.div(width, bgImage.width || 0).toNumber()
		bgImage.scaleX = scale;
		bgImage.scaleY = scale;
		scaleRef.current = scale
		fabricCanvasRef.current?.setBackgroundImage(bgImage, fabricCanvasRef.current!.renderAll.bind(fabricCanvasRef.current))
		fabricCanvasRef.current?.backgroundImage.set({
			hasControls: false,
			selectable: false,
			evented: false,
			/**
			 * 设置背景图层在最底层
			 */
			objectCaching: false,
			zIndex: -1
		});
		// 循环播放gif背景
		const {urlList, speed = 0} = await getGifUrls(image)
		const images = await getImagesByUrls(urlList, scale)
		gifPlayerRef.current = new GifPlayer({
			images,
			urls: urlList,
			fabricCanvas: fabricCanvasRef.current!,
			isGif: isGifImage,
			originImageUrl: backgroundImageUrl,
			speed: speed
		})
		gifPlayerRef.current?.play()
		return scale
	}

	const { data: templateData } = useRequest(async () => {
		const template = await api.logoApi.getTemplateById(templateId!)
		return template?.json
	}, {
		ready: Boolean(templateId),
		refreshDeps: [templateId]
	})


	const canvasJson = (templateData || templateJSON) as TemplateJSONProps
	const initFabric = async (imageUrl: string, canvasJson?: TemplateJSONProps) => {
		if(canvasJson) {
			const originScale = canvasJson.backgroundImage?.scaleX
			fabricCanvasRef.current?.loadFromJSON(canvasJson, async () => {
				const targetScale = await loadBackingImage(imageUrl)
				const scale =  Decimal.div(originScale, targetScale).toNumber()
				resetLogoScale(fabricCanvasRef.current!, scale)
				onCanvasInitFinish?.()
			})
			return
		}
		await loadBackingImage(imageUrl)
		onCanvasInitFinish?.()
	}

	useEffect(() => {
		if(!backgroundImageUrl) {
			return
		}
		fabricCanvasRef.current?.dispose()
		fabricCanvasRef.current?.removeListeners()
		fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);
		initFabric(backgroundImageUrl, canvasJson)

		return () => {
			gifPlayerRef.current?.pause()
		}
	}, [backgroundImageUrl, canvasJson])

	useImperativeHandle(ref, () => ({
		getFabricCanvas: () => fabricCanvasRef.current!,
		addImage: async (url: string, name: string, id: string) => {
			const image = await loadFabricImage(url, scaleRef.current)
			image.name = name
			image.id = id
			fabricCanvasRef.current?.add(image)
			fabricCanvasRef.current?.setActiveObject(image)
		},
		// 获取背景图片
		getGifPlayer: () => gifPlayerRef.current!
	}))

	return (
		<canvas ref={canvasRef} width={width} height={width}/>
	);
});

export default Canvas;