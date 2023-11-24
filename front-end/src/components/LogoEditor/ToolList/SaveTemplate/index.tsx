import React, {useState} from 'react';
import {Button, Input, message, Modal} from "antd";
import {useLogoEditor} from "components/LogoEditor/context";
import api from "api/index";
import {useRequest} from "ahooks";
import {getTemplateById} from "api/logoApi";

interface Props {
	templateId?: string
}

const SaveTemplate = (props: Props) => {

	const { templateId } = props
	const [name, setName] = useState<string | undefined>()
	const [modalVisible, setModalVisible] = useState(false)
	const text = templateId ? '编辑' : '新增'
	const { canvasRef, afterCreateSuccess, backgroundImageUrl } = useLogoEditor()

	useRequest(async () => {
		const template = await api.logoApi.getTemplateById(templateId!)
		setName(template!.name)
	}, {
		ready: Boolean(templateId),
		refreshDeps: [templateId]
	})

	const handleConfirm = async () => {
		const json = canvasRef.current.getFabricCanvas().toJSON(['name', 'id'])
		if(!name) {
			message.warning('请输入名称')
			return
		}
		await api.logoApi.saveTemplate({
			name: name!,
			backgroundImageUrl,
			json,
			id: templateId
		})
		reset()
		message.success(`${text}模板成功`)
		afterCreateSuccess?.(name)
	}

	const reset = () => {
		setName(null)
		setModalVisible(false)
	}

	return (
		<>
			<Button size='small' onClick={() => setModalVisible(true)}>
				{templateId ? '编辑模板' : '另存为新模板'}
			</Button>
			<Modal open={modalVisible} title={`${text}水印模板`} onOk={handleConfirm} onCancel={reset}>
				<div>
					请输入模板名称：
					<Input placeholder='模板名称' value={name} onChange={e => setName(e.target.value)}/>
				</div>
			</Modal>
		</>
	);
};

export default SaveTemplate;