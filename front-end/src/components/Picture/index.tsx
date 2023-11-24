import React from 'react';
import {Image} from 'antd'

const Picture = (props) => {

	const { record, width = 50 } = props

	return (
		<Image.PreviewGroup
			items={record.pictures}
		>
			<Image
				width={width}
				src={record.picture}
			/>
		</Image.PreviewGroup>
	);
};

export default Picture;