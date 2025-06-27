"use client";

import { Layout, Flex } from "antd";
import "@ant-design/v5-patch-for-react-19";

const { Content } = Layout;

const AuthLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body style={{ margin: 0 }}>
      <Layout style={{ minHeight: "100vh", background: "#f8f7f3" }}>
        <Content>
          <Flex align="center" justify="center" style={{ height: "100vh" }}>
            {children}
          </Flex>
        </Content>
      </Layout>
    </body>
  </html>
);

export default AuthLayout;
