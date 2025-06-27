'use client';

import React from 'react';
import { Layout, Button, Flex, Avatar, Grid } from 'antd';
import { ThunderboltFilled } from '@ant-design/icons';

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

const CadastroLayout = ({ children }: React.PropsWithChildren) => {
  const { md } = useBreakpoint();
  const isMobile = !md;

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8f7f3' }}>
      <Header
        style={{
          background: '#f8f7f3',
          borderBottom: '1px solid #eaeaea',
          padding: isMobile ? '0 16px' : '0 50px',
          height: 80,
        }}
      >
        <Flex align="center" justify="space-between" style={{ height: '100%' }}>
          <Avatar
            style={{ background: 'black', color: 'white' }}
            size={40}
            shape="square"
            icon={<ThunderboltFilled />}
          />
          <Button type="primary" style={{ background: 'black', borderColor: 'black' }}>
            Login
          </Button>
        </Flex>
      </Header>

      <Content>
        <Flex
          justify="center"
          align="center"
          style={{
            padding: isMobile ? '24px 16px' : '40px 16px',
          }}
        >
          {children}
        </Flex>
      </Content>
    </Layout>
  );
};

export default CadastroLayout;