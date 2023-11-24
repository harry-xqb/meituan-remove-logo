import React, {useState} from 'react';
import {Form, Input, message, Select, Space, Table} from "antd";
import {EditableCell, getColumns} from "pages/ProductList/columns";
import {useAntdTable} from "ahooks";
import api from "api/index";
import RemoveWaterMark from "pages/ProductList/RemoveWaterMark";
import TabSelect from "pages/ProductList/TabSelect";
import {pick} from "lodash";
import {saveProduct} from "pages/ProductList/util";

interface Result {
	total: number;
	list: any[];
}

const getTableData = async ({current, pageSize}: any, params : any): Promise<Result> => {
	const res = await api.meituanApi.getProductList({
		pageNum: current,
		pageSize: pageSize,
		...pick(params, 'searchWord', 'tagId', 'state'),
	})
	return {
		total: res.totalCount,
		list: res.productList
	}
}

const ProductList = () => {

	const [form] = Form.useForm<any>()
	const tableResult = useAntdTable(async (...rest: any) => {
		const data = await getTableData(...rest);
		const arr = data.list.map(item => ({
			name: item.name,
			upcCode: item.upcCode,
		}))
		const editRow = {}
		arr.forEach((item, index) => {
			editRow[index] = {
				name: item.name,
				upcCode: item.upcCode,
			}
		})
		form.setFieldsValue({
			editRow
		})
		const values = form.getFieldsValue()
		console.log(values)
		return data
	}, {
		form: form as any
	})


	const handleSave = async (record: any, index: string) => {
		const values = form.getFieldValue(['editRow', index] as any)
		await saveProduct(record.id, {
			name: values.name,
		})
		message.success('提交成功')
	}


	const {tableProps, search} = tableResult
	const [drawer, setDrawer] = useState<{ visible: boolean, skuId?: string }>({
		visible: false
	})

	const mergedColumns = getColumns({setDrawer, handleSave}).map((col: any) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record, rowIndex) => ({
				record,
				// dataIndex: `editRow_${rowIndex}_${col.dataIndex}`,
				dataIndex: ['editRow', rowIndex, col.dataIndex],
				title: col.title,
				editing: true
			}),
		};
	});

	return (
		<div>
			<Form initialValues={{
			}} preserve form={form} component={false} layout='inline' style={{marginBottom: 16}}>
				<Space>
					<Form.Item label='名称' name='searchWord'>
						<Input.Search placeholder='请输入商品名称' onSearch={search.submit}/>
					</Form.Item>
					<Form.Item label='状态' name='state'>
						<Select onChange={search.submit} style={{width: 200}} options={[
							{
								label: '全部',
								value: 0
							},
							{
								label: '售卖中',
								value: 1
							},
							{
								label: '已下架',
								value: 2
							},
							{
								label: '待优化',
								value: 5
							}
						]}/>
					</Form.Item>
					<Form.Item label='标签' name='tagId'>
						<TabSelect onChange={search.submit} />
					</Form.Item>
				</Space>
				<Table
					components={{
						body: {
							cell: EditableCell,
						},
					}} rowKey='id' size="small" columns={mergedColumns} {...tableProps} pagination={{
					...tableProps.pagination,
					showTotal: (total) => `${total}个商品`
				}}/>
				<RemoveWaterMark search={search} onClose={() => {
					setDrawer({visible: false})
					// search.submit()
				}} tableResult={tableResult} drawer={drawer}/>
			</Form>
		</div>
	);
};

export default ProductList;