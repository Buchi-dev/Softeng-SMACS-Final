import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Space, Select, 
  Popconfirm, message, Card, Typography, Tabs, Tag, Spin
} from 'antd';
import { 
  UserOutlined, EditOutlined, DeleteOutlined, 
  PlusOutlined, FilterOutlined, ReloadOutlined
} from '@ant-design/icons';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/user';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const UserManagement = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Fetch all users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the server
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
      message.success('Users loaded successfully');
    } catch (error) {
      message.error('Failed to load users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.idNumber, values);
        message.success('User updated successfully');
      } else {
        // Create new user
        await createUser(values);
        message.success('User created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchUsers(); // Refresh the list
    } catch (error) {
      message.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      idNumber: user.idNumber,
      name: user.name,
      role: user.role,
      // Set role-specific fields
      ...(user.role === 'student' ? { 
        year: user.year,
        course: user.course 
      } : { 
        department: user.department,
        position: user.position
      }),
      notes: user.notes
    });
    setModalVisible(true);
  };

  // Handle add new user
  const handleAddNew = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Handle delete user
  const handleDelete = async (idNumber) => {
    setLoading(true);
    try {
      await deleteUser(idNumber);
      message.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      message.error('Failed to delete user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search text and active tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchText ? 
      user.name.toLowerCase().includes(searchText.toLowerCase()) || 
      user.idNumber.toLowerCase().includes(searchText.toLowerCase()) :
      true;

    const matchesTab = activeTab === 'all' ? true : user.role === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Role-specific form fields
  const renderRoleFields = (role) => {
    switch (role) {
      case 'student':
        return (
          <>
            <Form.Item name="year" label="Year" rules={[{ required: true, message: 'Please enter the year' }]}>
              <Input placeholder="1st Year, 2nd Year, etc." />
            </Form.Item>
            <Form.Item name="course" label="Course" rules={[{ required: true, message: 'Please enter the course' }]}>
              <Input placeholder="BS Computer Science, etc." />
            </Form.Item>
          </>
        );
      case 'faculty':
        return (
          <>
            <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please enter the department' }]}>
              <Input placeholder="Computer Science, Mathematics, etc." />
            </Form.Item>
            <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please enter the position' }]}>
              <Input placeholder="Professor, Instructor, etc." />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  // Column configuration for the user table
  const columns = [
    {
      title: 'ID Number',
      dataIndex: 'idNumber',
      key: 'idNumber',
      sorter: (a, b) => a.idNumber.localeCompare(b.idNumber),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'student' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Student', value: 'student' },
        { text: 'Faculty', value: 'faculty' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        record.role === 'student' ? 
        `${record.course} - ${record.year}` : 
        `${record.department} - ${record.position}`
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.idNumber)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2}>
            <UserOutlined /> User Management
          </Title>
          <Space>
            <Input 
              placeholder="Search by name or ID" 
              value={searchText} 
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              prefix={<FilterOutlined />}
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddNew}
            >
              Add User
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchUsers}
            >
              Refresh
            </Button>
          </Space>
        </div>

        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
        >
          <TabPane tab="All Users" key="all" />
          <TabPane tab="Students" key="student" />
          <TabPane tab="Faculty" key="faculty" />
        </Tabs>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table 
            dataSource={filteredUsers} 
            columns={columns} 
            rowKey="idNumber"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item 
            name="idNumber" 
            label="ID Number"
            rules={[{ required: true, message: 'Please enter ID number' }]}
          >
            <Input placeholder="Enter ID number" disabled={!!editingUser} />
          </Form.Item>

          <Form.Item 
            name="name" 
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item 
            name="role" 
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select 
              placeholder="Select role"
              onChange={() => form.resetFields(['year', 'course', 'department', 'position'])}
            >
              <Option value="student">Student</Option>
              <Option value="faculty">Faculty</Option>
            </Select>
          </Form.Item>

          {/* Dynamic form fields based on selected role */}
          <Form.Item noStyle dependencies={['role']}>
            {({ getFieldValue }) => renderRoleFields(getFieldValue('role'))}
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Additional notes" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginRight: 8 }} onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;