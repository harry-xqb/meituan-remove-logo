import React, {useState} from 'react';
import {useRequest} from "ahooks";
import api from "api/index";
import LogoEditor from "components/LogoEditor";
import {Button, Flex, message, Modal, Radio} from "antd";
import {TemplateTypeEnum} from "api/logoApi";


/**
 * 模板管理页
 */
const TemplateManage = () => {

	const { data = [], run } = useRequest(api.logoApi.getTemplateList)
	const { data: defaultTemplateId, run: refreshDefault } = useRequest(api.logoApi.getDefaultTemplateId)
	const { data: defaultTemplateType, run: refreshDefaultType } = useRequest(api.logoApi.getDefaultTemplateType)
	const [templateTypeModal, setTemplateTypeModal] = useState<{
		visible: boolean
		type: TemplateTypeEnum
		id?: string
	}>({
		visible: false,
		type: TemplateTypeEnum.ALL,
	})

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: "确认删除该模板",
			onOk: async () => {
				await api.logoApi.deleteTemplateById(id)
				message.success('删除成功')
				run()
			}
		})
	}

	const handleSetDefault = async (id: string) => {
		await api.logoApi.setDefaultTemplateId(id, templateTypeModal.type)
		message.success(defaultTemplateId === id ? '取消成功' : '设置成功')
		refreshDefault()
		refreshDefaultType()
	}

	return (
		<div style={{display: 'flex', flexWrap: 'wrap'}}>
			{
				data.map(item => (
					<div key={item.id} style={{marginRight: 10, marginBottom: 10}}>
						{
							item.id === defaultTemplateId && `默认模板-${defaultTemplateType === TemplateTypeEnum.FIRST ? '主图' : '所有图片'}`
						}
						<div>
							<LogoEditor
								templateSelectable={false}
								afterTemplateCreate={run}
								width={400}
								showSpeed={false}
								defaultTemplateId={item.id}
								backgroundImageUrl={item.backgroundImageUrl}
							/>
						</div>
						<Flex style={{justifyContent: 'center'}}>
							<Button style={{marginTop: 12, marginRight: 6}} onClick={() => handleDelete(item.id)}>删除模板</Button>
							<Button style={{marginTop: 12}} onClick={() => {
								if(defaultTemplateId !== item.id) {
									setTemplateTypeModal({
										visible: true,
										type: TemplateTypeEnum.ALL,
										id: item.id
									})
									return
								}
								handleSetDefault(item.id)
							}}>
								{defaultTemplateId === item.id ? '取消默认模板' : '设为默认模板'}
							</Button>
						</Flex>
					</div>
				))
			}
			<Modal title='请选择默认模板作用类型' visible={templateTypeModal.visible} onCancel={() => setTemplateTypeModal({
				...templateTypeModal,
				visible: false,
			})} onOk={() => {
				handleSetDefault(templateTypeModal.id)
				setTemplateTypeModal({
					...templateTypeModal,
					visible: false,
				})
			}}>
				<Radio.Group value={templateTypeModal.type} onChange={e => setTemplateTypeModal({
					...templateTypeModal,
					type: e.target.value
				})}>
					<Radio value={TemplateTypeEnum.ALL}>所有图片</Radio>
					<Radio value={TemplateTypeEnum.FIRST}>主图（第一张图）</Radio>
				</Radio.Group>
			</Modal>
		</div>
	);
};

export default TemplateManage;