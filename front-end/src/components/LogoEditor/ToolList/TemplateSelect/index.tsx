import React, {useImperativeHandle} from 'react';
import {Select} from "antd";
import {useRequest} from "ahooks";
import api from "api/index";
import {useLogoEditor} from "components/LogoEditor/context";
import {RedoOutlined} from "@ant-design/icons";


export interface TemplateSelectRefProps {
	refresh: () => void
}

const TemplateSelect = React.forwardRef<any, TemplateSelectRefProps>((_, ref) => {

	const { data = [], run } = useRequest(api.logoApi.getTemplateList);
	const { setTemplateId, setIsInitFinish } = useLogoEditor()

	useImperativeHandle(ref, () => ({
		refresh: () => {
			run()
		}
	}))

	const options = data.map((item) => ({
		label: item.name,
		value: item.id
	}))

	const handleSelect = (id) => {
		setIsInitFinish(false)
		setTemplateId(id)
	}

	return (
		<>
			<Select size='small' empty='暂无模板' placeholder='选择模板' style={{width: 200, marginBottom: 10}} onSelect={handleSelect} options={options}/>
			<RedoOutlined style={{marginLeft: 10}} onClick={run} />
		</>
	);
});

export default TemplateSelect;