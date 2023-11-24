import React, {useEffect, useState} from 'react';
import {Button, message, Upload} from "antd";
import styles from './index.module.less'
import {DeleteOutlined} from "@ant-design/icons";
import {useLogoEditor} from "components/LogoEditor/context";
import {useRequest} from "ahooks";
import api from "api/index";
import { v4 as uuidv4 } from 'uuid';

const LogoUploader = () => {

	const [logoList, setLogoList] = useState<{name: string, url: string, id: string}[]>([])
	const { templateId } = useLogoEditor()

	useRequest(async () => {
		const template = await api.logoApi.getTemplateById(templateId!)
		const json = template?.json
		if(!json) {
			return
		}
		setLogoList(json.objects.filter(item => item.type === 'image').map((item: any) => ({
			name: item.name as string,
			url: item.src as string,
			id: item.id as string,
		})))
	}, {
		ready: Boolean(templateId),
		refreshDeps: [templateId]
	})

	const store  = useLogoEditor()
	const handleUpload = async (originFile) => {
		const reader = new FileReader();
		reader.onloadend = async () => {
			const uuid = uuidv4()
			setLogoList([...logoList, {
				name: originFile.name as string,
				url: reader.result as string,
				id: uuid
			}])
			store.canvasRef.current.addImage(reader.result as string, originFile.name, uuid)
		};
		reader.readAsDataURL(originFile);
		return false
	}

	const handleDelete = (id, name) => {
		setLogoList(logoList.filter(item => {
			if(item.id) {
				return item.id !== id
			}
			return item.name !== name
		}))
		const object = store.canvasRef.current.getFabricCanvas().getObjects('image').find(item => {
			if(item.id) {
				return item.id === id
			}
			return item.name === name
		})
		store.canvasRef.current.getFabricCanvas().remove(object)
	}

	const handleChoose = (id, name) => {
		const object = store.canvasRef.current.getFabricCanvas().getObjects('image').find(item => item.id === id)
		store.canvasRef.current.getFabricCanvas().setActiveObject(object)
		message.success(`已选中${name}`)
	}

	return (
		<div>
			{
				Boolean(logoList.length) && (
					<div className={styles.logoList}>
						{logoList.map(item => (
							<div key={item.id} className={styles.item} onClick={() => handleChoose(item.id, item.name)}>
								<Button type="dashed" size='small'>
									<div className={styles.name}>
										{item.name}
									</div>
								</Button>
									<DeleteOutlined className={styles.logo} onClick={(e) => {
										e.stopPropagation();
										handleDelete(item.id, item.name);
									}}/>
							</div>
						))}
					</div>
				)
			}
			<Upload showUploadList={false} accept='image/*' beforeUpload={handleUpload}>
				<Button size='small'>上传覆盖logo</Button>
			</Upload>
		</div>

	);
};

export default LogoUploader;