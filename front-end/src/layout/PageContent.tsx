import React, {useEffect, useState} from 'react';
import {useLocalStorageState} from "ahooks";
import {message, Modal, Input} from "antd";
import api from "api/index";
import {Outlet, useNavigate} from 'react-router-dom'

const parseCookie = (val) => {
	const arr = val.split(';')
	arr.forEach(item => {
		document.cookie = item
	})
}

const PageContent = () => {

	const [wmPoiId, setWmPoiId] = useLocalStorageState<string | undefined>('meituan_wmPoiId');
	const [confirmLoading, setConfirmLoading] = useState(false)
	const [value, setValue] = useState<string>()
	const navigate = useNavigate()
	const handleOk = async () => {
		if(!value) {
			message.error('请输入商家cookie')
			return
		}
		setConfirmLoading(true)
		try {
			parseCookie(value)
			const { wmPoiId: id } = await api.meituanApi.getShopInfo(value)
			localStorage.setItem('meituan_wmPoiId', id)
			setTimeout(() => {
				setWmPoiId(id)
			}, 500)
		} catch (e) {
			console.error(e)
		} finally {
			setConfirmLoading(false)
		}
	}

	useEffect(() => {
		if( wmPoiId) {
			navigate('/productList')
		}
	}, [wmPoiId])

	if(!wmPoiId) {
		return (
			<Modal
				visible={true}
				title="请输入商家Cookie"
				onOk={handleOk}
				confirmLoading={confirmLoading}
			>
				<Input.TextArea autoSize={{
					minRows: 5,
					maxRows: 5
				}} placeholder='请复制商家Cookie到输入框' value={value} onChange={e => setValue(e.target.value)}/>
			</Modal>
		)
	}
	return (
		<Outlet />
	);
};

export default PageContent;