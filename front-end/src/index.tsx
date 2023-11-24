import React from 'react'
import ReactDOM from 'react-dom'
import {RouterProvider} from 'react-router-dom'
import './index.css'
import router from "./router";
import zhCN from "antd/es/locale/zh_CN";
import {ConfigProvider} from 'antd'

ReactDOM.render(
	<ConfigProvider locale={zhCN}>
		<RouterProvider router={router} />
	</ConfigProvider>,
	document.getElementById('root')
);