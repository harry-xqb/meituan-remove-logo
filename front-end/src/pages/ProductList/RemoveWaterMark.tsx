import React, {useEffect, useRef, useState} from 'react';
import {Button, Drawer, message, Modal, Space} from "antd";
import {useRequest, useUpdateEffect} from "ahooks";
import api from "api/index";
import {AntdTableResult, Data, Params} from "ahooks/lib/useAntdTable/types";
import ProductSaveRow from "pages/ProductList/ProductSaveRow";
import { v4 as uuidv4 } from 'uuid';
import {isNil} from "lodash";

interface Props<TData extends Data = Data, TParams extends Params = Params> {
	tableResult: AntdTableResult<TData, TParams>
	drawer: {
		visible: boolean
		index?: number
		skuId?: string
	}
}

/**
 * 去水印
 */
const RemoveWaterMark = (props: Props) => {

	const {drawer, tableResult, onClose, search} = props;
	const productListRef = useRef<any>()
	const handleClose = () => {
		onClose()
		setAutoSave(null)
	}
	const [index, setIndex] = useState(0)
	const [autoSave, setAutoSave] = useState({
		key: null,
		num: 0
	})
	const {total = 0, pageSize = 0, current= 0} = tableResult.tableProps?.pagination || {}
	const currentIndex = (current - 1) * pageSize + (index + 1)
	const containerRef = useRef<HTMLDivElement>()

	useEffect(() => {
		if(drawer.visible) {
			setIndex(drawer.index!)
		}
	}, [drawer.visible, drawer.index])

	useEffect(() => {
		if(tableResult.tableProps.dataSource && isNil(index)) {
			setIndex(0)
		}
	}, [tableResult.tableProps.dataSource])

	const [submitAllLoading, setSubmitAllLoading] = useState(false)
	const {data: templateData } = useRequest(async () => {
		const templateId = await api.logoApi.getDefaultTemplateId()
		const templateType = await api.logoApi.getDefaultTemplateType()
		return {templateId, templateType}
	})
	const { templateId, templateType } = templateData || {}

	const handleSaveAll = async () => {
		try {
			setSubmitAllLoading(true)
			const isSuccess = await productListRef.current.handleSave()
			if(isSuccess) {
				handleNext()
			}
			containerRef.current!.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		} catch (e) {
			console.error(e)
		} finally {
			setSubmitAllLoading(false)
		}
	}

	const handleRefresh = async () => {
		tableResult.tableProps.onChange({
			pageSize: tableResult.tableProps.pagination.pageSize,
			current: tableResult.tableProps.pagination.current,
		})
	}
	const handleNext = () => {
		if(index === tableResult.tableProps.dataSource.length - 1) {
			if(tableResult.tableProps.pagination.current * tableResult.tableProps.pagination.pageSize >= tableResult.tableProps.pagination.total) {
				if(autoSave.key) {
					message.success({
						content: '批量处理完成',
						key: autoSave.key,
						duration: 1
					})
					return
				}
				message.success('处理完成')
				return
			}
			tableResult.tableProps.onChange({
				current: tableResult.tableProps.pagination.current + 1,
				pageSize: tableResult.tableProps.pagination.pageSize
			})
			setIndex(null)
		} else {
			setIndex(pre => pre + 1)
		}
	}

	const product = tableResult.tableProps?.dataSource?.[index]

	const handleAutoSave = () => {
		if(autoSave?.key) {
			message.success({
				content: `取消成功`,
				duration: 1,
				key: autoSave?.key
			})
			setAutoSave(null)
			return
		}
		if(!templateId) {
			message.error('请先设置默认模板')
			return
		}
		Modal.confirm({
			title: '提示',
			content: '该操作将使用默认模板批量运用到所有商品图片，处理过程请勿关闭页面',
			onOk: () => {
				const key = uuidv4()
				message.loading({
					content: `自动处理中`,
					duration: -1,
					key
				})
				setAutoSave({
					key,
					num: 0
				})
			}
		})
	}




	useEffect(() => {
		if(autoSave?.key && !isNil(index)) {
			handleSaveAll()
		}
	}, [autoSave, index])

	return (
		<>
			<Drawer title={`${currentIndex}/${total}`} destroyOnClose onClose={handleClose} width={1500} open={drawer.visible} footer={(

				<Space>
					<Button type='primary' loading={submitAllLoading} onClick={handleSaveAll}>保存并下一个</Button>
					<Button type='primary' onClick={handleAutoSave}>
						{autoSave?.key ? '取消自动批量保存' : '开启自动批量保存'}
					</Button>
					<Button onClick={handleRefresh}>刷新</Button>
					{
						index > 0 && (
							<Button onClick={() => setIndex(index - 1)}>上一个</Button>
						)
					}
					<Button onClick={handleNext}>下一个</Button>

				</Space>
			)}>
				<div ref={containerRef}>
					{
						product && !tableResult.tableProps.loading && (
							<ProductSaveRow key={product.id} product={product} ref={productListRef} defaultTemplateId={templateId} defaultTemplateType={templateType}/>
						)
					}
				</div>
			</Drawer>
		</>

	);
};

export default RemoveWaterMark;