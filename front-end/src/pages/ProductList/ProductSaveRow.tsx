import React, {useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from 'react';
import {Button, Divider, message, notification} from "antd";
import {getWmPoiId} from "api/meituanApi";
import LogoEditor from "components/LogoEditor";
import api from "api/index";
import {pick} from "lodash";
import {useRequest} from "ahooks";
import cls from 'classnames'
import styles from './index.module.less'
import {TemplateTypeEnum} from "api/logoApi";

const ProductSaveRow = React.forwardRef((props, ref) => {

	const { product, defaultTemplateId, defaultTemplateType } = props

	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState<string | undefined>()

	const pictureRef = useRef([])


	const generateProductImageList = async (): Promise<{
		isChanged: boolean
		urlList: string[]
	}> => {
		const promiseList = pictureRef.current.map(item => item.getResultImage())
		// const
		const resultImageList = (await Promise.all(promiseList)) as string[]
		const isChanged = resultImageList.some(url => !url.startsWith('http'))
		if(!isChanged) {
			return {
				isChanged,
				urlList: resultImageList
			}
		}
		const resultImageListPromise = resultImageList.map(async (url) => {
			if(url.startsWith('http')) {
				return url
			}
			const data = await api.meituanApi.uploadImage(url)
			return data.url
		})
		const urlList = await Promise.all(resultImageListPromise) as string[]
		return {
			urlList,
			isChanged
		}
	}

	/*const handleSave = async () => {
		try {
			setStatus(undefined)
			setLoading(true)
			const {isChanged, urlList} = await generateProductImageList()
			if(isChanged) {
				const productDetail = await api.meituanApi.getProductDetails(product.id)
				await api.meituanApi.saveProduct({
					...pick(productDetail, 'id',
						'name',
						'description',
						'picContent',
						'spPicContentSwitch',
						'shippingTimeX',
						'skus',
						'attrList',
						'labels',
						'isSp',
						'spId',
						'releaseType',
						'tagList',
						'limitSale',
						'categoryAttrMap',
						'spuSaleAttrMap',
						'upcImage',
						'sellStatus',
						'marketingPicture',
						'wmPoiId',
						'skipAudit',
						'validType',
						'missingRequiredInfo',
						'auditStatus',
						'spVideoStatus',
						'quaApprovalDate',
						'quaEffectiveDate'
					),
					picture: urlList.join(','),
					categoryId: productDetail.category.categoryId,
					categoryPath: productDetail.category.idPath,
					useSuggestCategory: false,
					auditScene: 0,
					saveType: 1,
					auditSource: 1,
					checkActivitySkuModify: true
				})
			}
			setStatus('success')
			return true
		} catch (e) {
			console.error(e)
			notification.error({
				message: `更新失败`,
				description: `${product.name}${e.message}`,
			});
			setStatus('fail')
			return false
		} finally {
			setLoading(false)
		}
	}*/

	const handleSave = async () => {
		const promiseList = pictureRef.current.map(item => item.getResultImage())
		const resultImageList = (await Promise.all(promiseList)) as string[]
		const isChanged = resultImageList.some(url => !url.startsWith('http'))
		if(!isChanged) {
			return true
		}
	 const resultImageListPromise = resultImageList.map(async (url) => {
			if(url.startsWith('http')) {
				return url
			}
			const data = await api.meituanApi.uploadImage(url)
			return data.url
		})
		const apiRequest = async () => {
			try {
				const urlList = await Promise.all(resultImageListPromise) as string[]
				if(isChanged) {
					/*const productDetail = await api.meituanApi.getProductDetails(product.id)
					await api.meituanApi.saveProduct({
						...pick(productDetail, 'id',
							'name',
							'description',
							'picContent',
							'spPicContentSwitch',
							'shippingTimeX',
							'skus',
							'attrList',
							'labels',
							'isSp',
							'spId',
							'releaseType',
							'tagList',
							'limitSale',
							'categoryAttrMap',
							'spuSaleAttrMap',
							'upcImage',
							'sellStatus',
							'marketingPicture',
							'wmPoiId',
							'skipAudit',
							'validType',
							'missingRequiredInfo',
							'auditStatus',
							'spVideoStatus',
							'quaApprovalDate',
							'quaEffectiveDate'
						),
						picture: urlList.join(','),
						categoryId: productDetail.category.categoryId,
						categoryPath: productDetail.category.idPath,
						useSuggestCategory: false,
						auditScene: 0,
						saveType: 1,
						auditSource: 1,
						checkActivitySkuModify: true
					})*/
					const pictures = {}
					for(let i = 0; i < 8; i++) {
						pictures[`pictures[${i}]`] = urlList[i]
					}
					await api.meituanApi.savePicture(product.id, pictures)
				}
			} catch (e) {
				console.error(e)
				notification.error({
					message: `更新失败`,
					description: `${product.name}${e.message}`,
					duration: -1
				});
				setStatus('fail')
				return false
			}
		}
		apiRequest()
		return true
	}


	useImperativeHandle(ref, () => ({
		handleSave
	}))

	const getDefaultTemplateId = (index) => {
		if(!defaultTemplateId) {
			return undefined
		}
		if(defaultTemplateType === TemplateTypeEnum.ALL) {
			return defaultTemplateId
		}
		if(index === 0) {
			return defaultTemplateId
		}
		return undefined
	}

	return (
		<div className={cls(styles[status])}>
			<div style={{marginBottom: 10}}>
				<Button type='link' referrerPolicy='noopener noreferrer' target='__blank' href={`https://yiyao.meituan.com/main/frame#/page/product/detail/product/${product.id}/edit?spuId=${product.id}&queryFrom=4&wmPoiId=${getWmPoiId()}`}>
					{product.name}
				</Button>
			</div>
			<div style={{display: 'flex', marginTop: 10, flexWrap: 'wrap'}}>
				{
					product.pictures?.filter(Boolean)?.map((item, index) => (
						<div style={{marginBottom: 10}} key={item}>
							<LogoEditor ref={ref => {
								pictureRef.current[index] = ref
							}} width={400} backgroundImageUrl={item} defaultTemplateId={getDefaultTemplateId(index)}/>
						</div>
					))
				}
				{/*<Button loading={loading} onClick={handleSave}>保存</Button>*/}
			</div>
			<Divider/>
		</div>
	);
});

export default ProductSaveRow;