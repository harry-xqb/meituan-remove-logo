import {createBrowserRouter, createHashRouter} from "react-router-dom";
import App from "./layout/App";
import EditorDebug from "./pages/EditorDebug/index";
import TemplateManage from "pages/TemplateManage";
import ProductList from "pages/ProductList";
import ProductProblemList from "pages/ProductProblemList";

const router = createHashRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/productList",
				Component: ProductList,
			},
			{
				path: "/productOptimize",
				Component: ProductProblemList,
			},
			{
				path: "/logoManage",
				Component: TemplateManage,
			},
			{
				path: "/editorDebug",
				Component: EditorDebug,
			},
		],
	},
]);
export default router