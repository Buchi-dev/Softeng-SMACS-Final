import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  Card,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/admin";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    const onFinish = async (values) => {
    setLoading(true);
    try {
      // Admin login using service function
      const data = await loginAdmin({ 
        email: values.email,
        password: values.password 
      });
      
      // Store admin information in localStorage
      localStorage.setItem('adminUser', JSON.stringify(data));
      message.success('Admin login successful!');
      alert('Login successful!');
      
      // Redirect to admin console/dashboard
      navigate('/attendance-management');
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error('Please check your input fields');
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f2f5, #e6f7ff)", // Gradient background
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 550,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ color: "#1890ff", marginBottom: 8 }}>
            Admin Login
          </Title>
          <Typography.Text type="secondary">
            Sign in to your administrator account
          </Typography.Text>
        </div><Form
          name="login"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Row justify="space-between" align="middle">
            <Col>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Col>
          </Row>          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Sign In
            </Button>
          </Form.Item>

          <Divider plain>Or</Divider>

          <div style={{ textAlign: "center" }}>
            <Typography.Text type="secondary">
              Don't have an account? <Link to="/register">Register now</Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
