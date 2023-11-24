import React from 'react';
import {Select} from "antd";
import {useRequest} from "ahooks";
import api from "api/index";

const TabSelect = (props) => {

	const { data: options = [] } = useRequest(async () => {
		const { tagList } = await api.meituanApi.getTagList()
		return tagList.map(tag => ({
			label: tag.name,
			value: tag.id
		}))
	})


	return (
		<Select allowClear optionFilterProp='label' options={options} style={{width: 200}} {...props}/>
	);
};

export default TabSelect;