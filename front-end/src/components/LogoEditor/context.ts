import React, {MutableRefObject} from "react";
import {CanvasRefProps} from "components/LogoEditor/Canvas";
import {TemplateJSONProps} from "api/logoApi";


export interface LogoEditorProviderProps {
	canvasRef: MutableRefObject<CanvasRefProps>
	backgroundImageUrl: string
	afterTemplateCreate?: (templateName: string) => void
	setTemplateId: (name: string) =>  void,
	templateId?: string,
	isInitFinished?: boolean
}

export const LogoEditorContext = React.createContext<LogoEditorProviderProps | null>(null)

export const useLogoEditor = (): LogoEditorProviderProps => {

	const store = React.useContext(LogoEditorContext)
	if(!store) {
		throw new Error('useLogoEditor上下文获取失败')
	}
	return store
}
