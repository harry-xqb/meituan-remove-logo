import React from 'react';
import {Menu} from "antd";
import {AccountBookOutlined, BugOutlined, GiftOutlined, MailOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

const items = [
	{
		label: (
			<Link to='/productList'>
				商品列表
			</Link>
		),
		key: '/productList',
		icon: <AccountBookOutlined />,
	},
	{
		label: (
			<Link to='/productOptimize'>
				商品优化
			</Link>
		),
		key: '/productOptimize',
		icon: <AccountBookOutlined />,
	},
	{
		label: (
			<Link to='/logoManage'>
				水印模板
			</Link>
		),
		key: '/logoManage',
		icon: <GiftOutlined />,
	},
	{
		label: (
			<Link to='/editorDebug'>
				编辑器调试
			</Link>
		),
		key: '/editorDebug',
		icon: <BugOutlined />,
	},
]
export default items