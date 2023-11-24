import api from "api/index";
import {pick} from "lodash";


export const saveProduct = async (productId, params) => {
	const productDetail = await api.meituanApi.getProductDetails(productId)
	await api.meituanApi.saveProduct({
		...pick(productDetail, 'id',
			'picture',
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
		categoryId: productDetail.category.categoryId,
		categoryPath: productDetail.category.idPath,
		useSuggestCategory: false,
		auditScene: 0,
		saveType: 1,
		auditSource: 1,
		checkActivitySkuModify: true,
		...params
	})
}