import React, { useState } from 'react';
import {
  Button,
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
import { createAdmin } from "../services/admin";

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Remove confirmPassword as it's not needed in the API call
      const { confirmPassword, ...userData } = values;
      
      // Call the createAdmin service function
      await createAdmin(userData);
      message.success('Admin registration successful!');
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message && error.message.includes('already exists')) {
        message.error('Username or email already exists. Please try different credentials.');
      } else {
        message.error('Failed to register. Please try again.');
      }
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
        background: "linear-gradient(135deg, #f0f2f5, #e6f7ff)",
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
            Create Admin Account
          </Title>
          <Typography.Text type="secondary">
            Register a new administrator
          </Typography.Text>
        </div><Form
          name="register"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
            <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[
                  { required: true, message: "Please input your first name!" },
                ]}
              >
                <Input placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[
                  { required: true, message: "Please input your last name!" },
                ]}
              >
                <Input placeholder="Enter your last name" />
              </Form.Item>
            </Col>
          </Row>          
          <Form.Item
            label="Middle Name (Optional)"
            name="middleName"
          >
            <Input placeholder="Enter your middle name" />
          </Form.Item>
            <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
            ]}
          >
            <Input.Password placeholder="Create a password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Register
            </Button>
          </Form.Item>

          <Divider plain>Or</Divider>

          <div style={{ textAlign: "center" }}>
            <Typography.Text type="secondary">
              Already have an account? <Link to="/login">Sign in</Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;