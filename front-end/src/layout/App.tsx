import {Layout, Menu, theme} from "antd";
import items from "./items";
import styles from './App.module.less'
import {ToolOutlined} from "@ant-design/icons";
import PageContent from "./PageContent";

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
      <Layout style={{ minHeight: '100vh', minWidth: '1020px', background: '#ffffff' }}>
        <Sider style={{ background: colorBgContainer }}>
          <div className={styles.title}>
            <ToolOutlined /> 美团商品批量去水印
          </div>
          <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} />
        </Sider>
        <Layout>
          <Content style={{ margin: '16px', background: '#ffffff', padding: 16 }}>
            {
              <PageContent/>
            }
          </Content>
        </Layout>
      </Layout>
  )
}

export default App
