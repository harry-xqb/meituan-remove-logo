import {Button, Input, Form, Space} from "antd";
import {useState} from "react";
import Picture from "components/Picture";


const SubmitBtn = (props) => {

	const {handleSave, record, index} = props

	const [loading, setLoading] = useState(false)

	const handleClick = async () => {
		try {
			setLoading(true)
			await handleSave(record, index)
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Button style={{padding: 0}} loading={loading} type='link' onClick={() =>handleClick()}>
			提交
		</Button>
	)
}

export const EditableCell = ({
                         editing,
	                      dataIndex,
	                      title,
	                      inputType,
	                      record,
	                      index,
	                      children,
	                      ...restProps
                      }) => {
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{ margin: 0 }}
				>
					<Input/>
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

export const getColumns = ({ handleSave}) => {
	return [
		{
			title: '图片',
			dataIndex: 'image',
			width: 100,
			editable: false,
			render: (_, record) => (
				<Picture width={100} record={record}/>
			)
		},
		{
			title: '名称',
			dataIndex: 'spuName',
			editable: false,
		},
		{
			title: '条形码',
			dataIndex: 'upc',
			width: 200,
			editable: true,
		},
		{
			title: '操作',
			width: 200,
			render: (_, record, index) => {
				return (
					<Space>
						<SubmitBtn record={record} index={index} handleSave={handleSave}/>
						<a type='link' target='__blank'
						        href={`https://yiyao.meituan.com/main/frame#/page/product/detail/product/${record.spuId}/edit?spuId=${record.spuId}&queryFrom=4&wmPoiId=19556633`}>
								去美团
						</a>
					</Space>
				)
			}
		}
	]
}