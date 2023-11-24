import Picture from "components/Picture";
import {Button, Input, Form, Space} from "antd";
import {useState} from "react";


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

export const getColumns = ({setDrawer, handleSave}) => {
	return [
		{
			title: '图片',
			dataIndex: 'image',
			width: 50,
			editable: false,
			render: (_, record) => (
				<Picture record={record} width={50}/>
			)
		},
		{
			title: '名称',
			dataIndex: 'name',
			editable: false,
			render: (name, record) => {
				return (
					<a type='link' target='__blank'
					   href={`https://yiyao.meituan.com/main/frame#/page/product/detail/product/${record.id}/edit?spuId=${record.id}&queryFrom=4&wmPoiId=19556633`}>
						{name}
					</a>
				)
			}
		},
		{
			title: '操作',
			width: 100,
			render: (_, record, index) => {
				return (
					<Space>
						{/*<SubmitBtn record={record} index={index} handleSave={handleSave}/>*/}
						{/*<a type='link' target='__blank'
						        href={`https://yiyao.meituan.com/main/frame#/page/product/detail/product/${record.id}/edit?spuId=${record.id}&queryFrom=4&wmPoiId=19556633`}>
								去美团
						</a>*/}
						<a type='link' onClick={() => setDrawer({
							visible: true,
							index,
							skuId: record.id
						})}>去水印</a>
					</Space>
				)
			}
		}
	]
}