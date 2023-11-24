import React from 'react'
import {message, Modal} from "antd";
// http处理

export const request = (url: string, config: RequestInit) => {
	return fetch(url, {
		...config,
		headers: {
			Accept: 'application/json',
			...(config.headers || {} as any),
		}
	}).then(res => res.json()).then(json => {
		if(json.code !== 0) {
			throw new Error(json.msg)
		}
		return json.data
	}).catch(error => {
		message.warning(  error.message || '系统异常')
		throw new Error(error)
	})
}

export const filterUndefined = (json, objAsString = false) => {
	const result = {}
	Object.keys(json).forEach(key => {
		if(json[key] != null) {
			if(objAsString && typeof json[key] === 'object') {
				result[key] = JSON.stringify(json[key])
			} else {
				result[key] = json[key]
			}
		} else {
			// result[key] = json[key]
		}
	})
	return result
}
