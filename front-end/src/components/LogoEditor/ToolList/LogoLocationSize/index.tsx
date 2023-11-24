import React, {useEffect, useState} from 'react';
import {Flex, Input, InputNumber, Space} from "antd";
import {left} from "@typescript-eslint/eslint-plugin";
import {useLogoEditor} from "components/LogoEditor/context";

const LogoLocationSize = () => {

	const [positionSize, setPositionSize] = useState({
		top: 0,
		left: 0,
		scaleX: 1,
		scaleY: 1
	})
	const [hasActiveObject, setHasActiveObject] = useState(false)
	const { canvasRef, templateId, isInitFinish } = useLogoEditor()
	useEffect(() => {
		if(!isInitFinish) {
			return
		}
		canvasRef.current.getFabricCanvas()?.on('object:modified', function(e) {
			console.log('???')
			setPositionSize({
				top: e.target.top!,
				left: e.target.left!,
				scaleX: e.target.scaleX!,
				scaleY: e.target.scaleY!
			})
		});
		const getActiveObjectPosition = () => {
			const object = canvasRef.current.getFabricCanvas().getActiveObject();
			setHasActiveObject(Boolean(object))
			if(object) {
				setPositionSize({
					top: object.top!,
					left: object.left!,
					scaleX: object.scaleX!,
					scaleY: object.scaleY!
				})
			}
		}
		canvasRef.current.getFabricCanvas().on('selection:updated', getActiveObjectPosition);
		canvasRef.current.getFabricCanvas().on('selection:created', getActiveObjectPosition)
	}, [isInitFinish, templateId])

	const handleChange = (key: string, value: number) => {
		setPositionSize({
			...positionSize,
			[key]: value
		})
		canvasRef.current.getFabricCanvas().getActiveObject()![key] = value
	}

	if(!hasActiveObject) {
		return null
	}

	return (
		<Space direction="vertical">
			<Space>
				<InputNumber size='small' style={{width: 140}} value={positionSize.top} prefix='上:' onChange={value => handleChange('top', Number(value) || 0)}/>
				<InputNumber size='small' style={{width: 140}} value={positionSize.left} prefix="左:" onChange={value => handleChange('left', Number(value) || 0)} />
			</Space>
			<Space>
				<InputNumber size='small' style={{width: 140}} value={positionSize.scaleX} prefix='缩放X:' onChange={value => handleChange('scaleX', Number(value) || 0)}/>
				<InputNumber size='small' style={{width: 140}} value={positionSize.scaleY} prefix='缩放Y:' onChange={value => handleChange('scaleY', Number(value) || 0)}/>
			</Space>
		</Space>
	);
};

export default LogoLocationSize;