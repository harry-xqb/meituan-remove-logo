import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import styles from './index.module.less'
import Canvas, {CanvasRefProps} from "components/LogoEditor/Canvas";
import {Button, Space} from "antd";
import {LogoEditorContext} from "components/LogoEditor/context";
import {LogoLocationSize, LogoUploader, SaveTemplate, TemplateSelect} from "components/LogoEditor/ToolList";
import {TemplateSelectRefProps} from "components/LogoEditor/ToolList/TemplateSelect";
import Preview from "components/LogoEditor/ToolList/Preview";
import {generateResultImage} from "components/LogoEditor/util";
import {TemplateJSONProps} from "api/logoApi";
import {canvas} from "@typescript-eslint/eslint-plugin";
import TimeSlider from "components/LogoEditor/ToolList/TimeSlider";

/**
 * logo编辑器
 * @constructor
 */

interface Props {
	backgroundImageUrl?: string;
	width?: number
	defaultTemplateId?: string
	templateSelectable?: boolean
	afterTemplateCreate?: (templateName: string) => void
	showToolbar?: boolean
	templateJSON?: TemplateJSONProps
	showSpeed?: boolean
}
export interface LogoEditorRefProps {
	getResultImage: () => Promise<string>
}

const LogoEditor = React.forwardRef<LogoEditorRefProps ,Props>((props: Props, ref) => {

	const { width = 500, templateSelectable = true, showSpeed = true, showToolbar = true, templateJSON, backgroundImageUrl = 'http://p0.meituan.net/scproduct/d55b619c624727186145bfc6af41c0f7436646.gif', defaultTemplateId } = props
	const canvasRef = useRef<CanvasRefProps>()
	const [templateId, setTemplateId] = useState(defaultTemplateId)
	const [isInitFinish, setIsInitFinish] = useState(false)
	const templateSelectRef = useRef<TemplateSelectRefProps>()
	// 初始化完成前的等待队列
	const waitListRef = useRef([])

	const afterTemplateCreate = (name: string) => {
		templateSelectRef.current?.refresh?.()
		props.afterTemplateCreate?.(name)
	}

	useEffect(() => {
		if(defaultTemplateId) {
			setTemplateId(defaultTemplateId)
		}
	}, [defaultTemplateId])

	useImperativeHandle(ref, () => ({
		getResultImage: async () => {
			if(!isInitFinish) {
				await new Promise(resolve => {
					waitListRef.current.push(resolve)
				})
			}
			return await generateResultImage(canvasRef as any)
		}
	}))

	// canvas完成，清空等待队列
	const handleCanvasInitFinish = () => {
		setIsInitFinish(true)
		waitListRef.current.forEach(callback => {
			callback()
		})
	}

	return (
		<div style={{display: 'inline-block', textAlign: 'center'}}>
			<LogoEditorContext.Provider value={{
				canvasRef: canvasRef,
				backgroundImageUrl,
				setTemplateId,
				templateId,
				afterTemplateCreate,
				isInitFinish,
				setIsInitFinish
			}}>
				<Space align='center'>
					{
						templateSelectable && (
							<TemplateSelect ref={templateSelectRef}/>
						)
					}
					<Button type='link' target="__black" href={backgroundImageUrl}>图片链接</Button>
				</Space>
				<div className={styles.container}>
					<Canvas onCanvasInitFinish={handleCanvasInitFinish} ref={canvasRef} width={width} backgroundImageUrl={backgroundImageUrl} templateJSON={templateJSON} />
					{
						showToolbar && (
							<Space direction='vertical' className={styles.toolList}>
								<LogoLocationSize/>
								<LogoUploader/>
								<Space>
									{
										templateId && (
											<SaveTemplate templateId={templateId}/>
										)
									}
									<SaveTemplate/>
									<Preview/>
								</Space>
								{
									showSpeed && (
										<TimeSlider/>
									)
								}
							</Space>
						)
					}
				</div>
			</LogoEditorContext.Provider>
		</div>
	);
});

export default LogoEditor;