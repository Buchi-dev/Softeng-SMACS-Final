import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, theme } from 'antd';
import { 
  MenuFoldOutlined, MenuUnfoldOutlined, 
  UserOutlined, DashboardOutlined, 
  ControlOutlined, AuditOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { token } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      key: '/attendance-dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/attendance-dashboard">Dashboard</Link>,
    },
    {
      key: '/attendance-console',
      icon: <ControlOutlined />,
      label: <Link to="/attendance-console">Attendance Console</Link>,
    },
    {
      key: '/attendance-management',
      icon: <AuditOutlined />,
      label: <Link to="/attendance-management">Attendance Management</Link>,
    },
    {
      key: '/user-management',
      icon: <UserOutlined />,
      label: <Link to="/user-management">User Management</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        width={250}
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          zIndex: 999
        }}
      >
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <Title level={collapsed ? 4 : 3} style={{ margin: 0 }}>
            {collapsed ? 'SMACS' : 'SMACS Admin'}
          </Title>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
          items={menuItems}
        />
        
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          width: '100%', 
          padding: '10px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button
            block
            icon={<LogoutOutlined />}
            type="text"
            danger
          >
            {collapsed ? '' : 'Logout'}
          </Button>
        </div>
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: token.colorBgContainer,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ marginLeft: '24px' }}>
            <Text strong>{location.pathname.substring(1).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Text>
          </div>
        </Header>
        
        <Content style={{ 
          margin: '24px 16px', 
          minHeight: 280,
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          overflow: 'auto'
        }}>
          {children || <Outlet />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;