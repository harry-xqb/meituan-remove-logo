import React, {MutableRefObject, useRef, useState} from 'react';
import {Button, Image} from "antd";
import {useLogoEditor} from "components/LogoEditor/context";
import Decimal from "decimal.js";
import {fabric} from "fabric";
import gifshot from 'gifshot'
import {CanvasRefProps} from "components/LogoEditor/Canvas";
import {generateResultImage, loadFabricImage, resetLogoScale} from "components/LogoEditor/util";
import LogoEditor from "components/LogoEditor";
import {canvas} from "@typescript-eslint/eslint-plugin";

/**
 * 结果预览
 */
const Preview = () => {

	const { canvasRef } = useLogoEditor()
	const [result, setResult] = useState<string>()
	const [visible, setVisible] = useState<boolean>(false)

	const handleClick = async () => {
		const res = await generateResultImage(canvasRef)
		setVisible(true)
		setResult(res)
	}


	return (
		<>
			<Button size='small' onClick={handleClick}>
				预览
			</Button>
			<Image
			  style={{display: 'none'}}
			  preview={{
			  	src: result,
				  visible,
				  onVisibleChange: (visible) => {
			  		setVisible(visible)
				  }
			  }}
			/>
		</>
	);
};

export default Preview;