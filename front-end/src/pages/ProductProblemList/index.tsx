import React from 'react';
import {Form, Input, message, Select, Space, Table} from "antd";
import {EditableCell, getColumns} from "./columns";
import {useAntdTable} from "ahooks";
import api from "api/index";
import {pick} from "lodash";

interface Result {
	total: number;
	list: any[];
}

const getTableData = async ({current, pageSize}: any, params : any): Promise<Result> => {
	let problem = {}
	if (params.problemLabelId) {
		problem = {
			status: -1,
			problemLabelId: params.problemLabelId
		}
	}
	const res = await api.meituanApi.getProductProblemList({
		pageNum: current,
		pageSize: pageSize,
		...pick(params, 'searchWord', 'state'),
		...problem
	})
	return {
		total: res.total,
		list: res.productList
	}
}

const ProductProblemList = () => {

	const [form] = Form.useForm<any>()
	const tableResult = useAntdTable(async (...rest: any) => {
		const data = await getTableData(...rest);
		const arr = data.list.map(item => ({
			name: item.name,
			upc: item.upc,
		}))
		const editRow = {}
		arr.forEach((item, index) => {
			editRow[index] = {
				spuName: item.name,
				upc: item.upc,
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
		await api.meituanApi.updateUPC(record.spuId, values.upc)
		message.success('提交成功')
	}


	const {tableProps, search} = tableResult

	const mergedColumns = getColumns({handleSave}).map((col: any) => {
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
				problemLabelId: '51539690553'
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
					<Form.Item label='商品问题' name='problemLabelId'>
						<Select onChange={search.submit} style={{width: 200}} options={[
							{
								label: '全部问题',
								value: '-1'
							},
							{
								label: '条码为空',
								value: '51539690553'
							},
							{
								label: '条码错误',
								value: '51539677555'
							},
							{
								label: '类目为空',
								value: '51539689553'
							},
							{
								label: '类目错误',
								value: '51539686554'
							},
							{
								label: '价格虚低',
								value: '90002'
							},
							{
								label: '价格虚高',
								value: '90001'
							},

						]}/>
					</Form.Item>
				</Space>
				<Table
					components={{
						body: {
							cell: EditableCell,
						},
					}} rowKey='spuId' size="small" columns={mergedColumns} {...tableProps} pagination={{
					...tableProps.pagination,
					showTotal: (total) => `${total}个商品`
				}}/>
			</Form>
		</div>
	);
};

export default ProductProblemList;