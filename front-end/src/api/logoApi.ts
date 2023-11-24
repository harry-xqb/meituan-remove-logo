import {fabric} from "fabric";
import { v4 as uuidv4 } from 'uuid';


const templateKey = 'LOGO_TEMPLATE_LIST'
const DEFAULT_TEMPLATE_KEY = 'LOGO_TEMPLATE_DEFAULT'
const DEFAULT_TEMPLATE_TYPE_KEY = 'LOGO_TEMPLATE_TYPE_DEFAULT'

export interface TemplateJSONProps {
	version: string
	objects: fabric.Object[]
	backgroundImage?: any
}
interface TemplateProps {
	name: string
	id: string
	json: TemplateJSONProps
	backgroundImageUrl: string
}

export enum TemplateTypeEnum {
	// 所有图片
	ALL = 'ALL',
	// 主图
	FIRST = 'FIRST'
}

export const saveTemplate = async (params: Omit<TemplateProps, 'id'> & {
	id?: string
}) => {
	const {name, id, json, backgroundImageUrl} = params
	const templateList = await getTemplateList()
	// 编辑模板
	if(id) {
		const item = templateList.find(item => item.id === id)
		item.name = name
		item.json = json
		item.backgroundImageUrl = backgroundImageUrl
		localStorage.setItem(templateKey, JSON.stringify(templateList))
		return
	}
	// 新增模板
	if(templateList.some(item => item.name === name)) {
		throw new Error('模板名称重复')
		return
	}
	templateList.push({
		id: uuidv4(),
		name,
		backgroundImageUrl,
		json
	})
	localStorage.setItem(templateKey, JSON.stringify(templateList))
}
export const getTemplateList = async (): Promise<TemplateProps[]> => {
	const itemStr = localStorage.getItem(templateKey)
	return JSON.parse(itemStr || '[]')
}

export const getTemplateById = async (id: string): Promise<TemplateProps | undefined>  => {
	const templateList = await getTemplateList()
	return templateList.find(item => item.id === id)
}

export const deleteTemplateById = async (id: string): Promise<void> => {
	const templateList = await getTemplateList();
	const list = templateList.filter(item => item.id !== id)
	localStorage.setItem(templateKey, JSON.stringify(list))
}

export const setDefaultTemplateId = async (id: string, templateType?: TemplateTypeEnum): Promise<void> => {
	const defaultId = localStorage.getItem(DEFAULT_TEMPLATE_KEY)
	if(defaultId === id) {
		localStorage.removeItem(DEFAULT_TEMPLATE_KEY)
		localStorage.removeItem(DEFAULT_TEMPLATE_TYPE_KEY)
		return
	}
	localStorage.setItem(DEFAULT_TEMPLATE_KEY, id)
	localStorage.setItem(DEFAULT_TEMPLATE_TYPE_KEY, String(templateType))
}
export const getDefaultTemplateId = async (): Promise<string | null> => {
	return localStorage.getItem(DEFAULT_TEMPLATE_KEY) || null
}
export const getDefaultTemplateType = async (): Promise<string> => {
	return localStorage.getItem(DEFAULT_TEMPLATE_TYPE_KEY) || TemplateTypeEnum.ALL
}