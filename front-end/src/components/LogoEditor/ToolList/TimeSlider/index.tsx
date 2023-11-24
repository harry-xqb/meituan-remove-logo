import React, {useEffect, useState} from 'react';
import {Col, Flex, InputNumber, Row, Slider, Space} from "antd";
import {useLogoEditor} from "components/LogoEditor/context";

const TimeSlider = () => {
	const { canvasRef, isInitFinish } = useLogoEditor()
	const [inputValue, setInputValue] = useState(0);
	const onChange = (newValue: number) => {
		canvasRef.current.getGifPlayer().speed = newValue
		setInputValue(newValue);
	}
	useEffect(() => {
		if(isInitFinish) {
			setInputValue(canvasRef.current?.getGifPlayer().speed || 0)
		}
	}, [isInitFinish])

	if(!isInitFinish) {
		return null
	}
	if(canvasRef.current?.getGifPlayer()?.urls?.length <= 1) {
		return null
	}

	return (
		<Row>
			<Space>
				<div>
					速度：
				</div>
				<Slider
					style={{width: 100}}
					min={100}
					max={1000}
					step={100}
					onChange={onChange}
					value={typeof inputValue === 'number' ? inputValue : 0}
				/>
				<InputNumber
					min={100}
					max={1000}
					style={{ margin: '0 16px' }}
					value={inputValue}
					onChange={onChange}
					suffix='毫秒'
				/>
			</Space>
		</Row>
	);
};

export default TimeSlider;