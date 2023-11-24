import {filterUndefined, request} from "api/request";
import { v4 as uuidv4 } from 'uuid';

interface GetProductListParams {
	pageSize: number
	pageNum: number
	searchWord?: string
}
export const getWmPoiId = () => {
	return localStorage.getItem('meituan_wmPoiId')
}
const wrapperFormUrlencoded = (json) => {
	return new URLSearchParams(filterUndefined(json, true) as any)
}

export const getProductList = (params: GetProductListParams) => {
	const json = {
		...params,
		wmPoiId: getWmPoiId(),
	}
	return request(`/api/reuse/health/product/retail/r/searchListPage`, {
		method: 'post',
		headers: {
			contentType: "application/x-www-form-urlencoded",
		},
		body: wrapperFormUrlencoded(json)
	})
}
export const getProductProblemList = (params: GetProductListParams) => {
	const json = {
		...params,
		wmPoiId: getWmPoiId()
	}
	return request(`/api/health/product/b/quality/r/searchList`, {
		method: 'post',
		headers: {
			contentType: "application/x-www-form-urlencoded",
		},
		body: wrapperFormUrlencoded(json)
	})
}
// 获取商品详情
export const getProductDetails = async (spuId: string) => {
	return request(`/api/reuse/health/product/shangou/r/detailProductAndMedicine?spuId=${spuId}&wmPoiId=${getWmPoiId()}`, {
		method: 'post',
	})
}

export const uploadImage = async (base64Url: string) => {
	return request('/api/reuse/health/product/uploadTool/w/uploadImg', {
		method: 'post',
		headers: {
			contentType: "application/x-www-form-urlencoded",
		},
		body: wrapperFormUrlencoded({
			picName: `${uuidv4()}.png`,
			submissionKey: uuidv4(),
			multipart: base64Url,
			wmPoiId: getWmPoiId(),
		})
	})
}


export const saveProduct = async (productInfo) => {
	return request('/api/reuse/health/product/retail/w/uniSave', {
		method: 'post',
		headers: {
			contentType: "application/x-www-form-urlencoded",
		},
		body: wrapperFormUrlencoded(productInfo)
	})
}

// 获取标签列表
export const getTagList = async () => {
	return request('/api/reuse/health/product/retail/r/tagList', {
		method: 'post',
		headers: {
			contentType: "application/x-www-form-urlencoded",
		},
		body: wrapperFormUrlencoded({
			needSmartSort: true,
			wmPoiId: getWmPoiId()
		})
	})
}

export const updateUPC = async (productId: string, upcCode: string) => {
	return request('/api/health/product/b/quality/w/batchUpdate', {
		method: 'post',
		headers: {
			contentType: "application/x-www-form-urlencoded",
		},
		body: wrapperFormUrlencoded({
			wmPoiId: getWmPoiId(),
			details: [{"spuId": productId,"values":[{"dimensionId":2,"updateValue": upcCode}]}],
			opFrom: 'PC'
		})
	})
}

export const getShopInfo = async (cookie: string): Promise<{ wmPoiId: string }> => {
	return request('/api/v2/common/r/getRegionId', {
		method: 'get',
		headers: {
			contentType: "application/json",
		},
	})
}

export const savePicture = async (spuId: string, pictures: Object) => {
	return request('/api/reuse/health/product/retail/w/picture', {
		method: 'post',
		headers: {
			contentType: "application/x-www-form-urlencoded",
		},
		body: wrapperFormUrlencoded({
			spuId,
			wmPoiId: getWmPoiId(),
			...pictures
		})
	})
}