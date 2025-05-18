import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Space, Select, 
  Popconfirm, message, Card, Typography, Tabs, Tag, Spin,
  DatePicker, TimePicker, Divider, Row, Col, Badge
} from 'antd';
import { 
  CalendarOutlined, EditOutlined, DeleteOutlined, 
  PlusOutlined, FilterOutlined, ReloadOutlined,
  ClockCircleOutlined, EnvironmentOutlined, TeamOutlined
} from '@ant-design/icons';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../services/event';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EventManagement = () => {
  // State variables
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Fetch all events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from the server
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
      message.success('Events loaded successfully');
    } catch (error) {
      message.error('Failed to load events: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    // Convert date objects to ISO strings for API
    const eventData = {
      ...values,
      startDate: values.dateRange[0].format('YYYY-MM-DD'),
      endDate: values.dateRange[1].format('YYYY-MM-DD'),
      startTime: values.startTime.format('HH:mm'),
      endTime: values.endTime.format('HH:mm'),
      // Add a dummy creator ID - in a real app this would come from authentication context
      createdBy: "1326466052" // This should be replaced with the actual user's ID number
    };
    
    // Remove the combined fields that were just for the form
    delete eventData.dateRange;

    setLoading(true);
    try {
      if (editingEvent) {
        // Update existing event
        await updateEvent(editingEvent._id, eventData);
        message.success('Event updated successfully');
      } else {
        // Create new event
        await createEvent(eventData);
        message.success('Event created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      fetchEvents(); // Refresh the list
    } catch (error) {
      message.error('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit event
  const handleEdit = (event) => {
    setEditingEvent(event);
    form.setFieldsValue({
      title: event.title,
      description: event.description,
      type: event.type,
      location: event.location,
      dateRange: [dayjs(event.startDate), dayjs(event.endDate)],
      startTime: dayjs(event.startTime, 'HH:mm'),
      endTime: dayjs(event.endTime, 'HH:mm'),
    });
    setModalVisible(true);
  };

  // Handle delete event
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteEvent(id);
      message.success('Event deleted successfully');
      fetchEvents(); // Refresh the list
    } catch (error) {
      message.error('Error deleting event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle showing the form modal
  const showModal = () => {
    setEditingEvent(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Filter events based on active tab and search text
  const getFilteredEvents = () => {
    let filtered = [...events];
    
    // Filter by event type or status
    if (activeTab !== 'all') {
      filtered = filtered.filter(event => {
        if (activeTab === 'active') return event.isActive;
        if (activeTab === 'inactive') return !event.isActive;
        return event.type === activeTab;
      });
    }
    
    // Filter by search text (case-insensitive)
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchLower) || 
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  };

  // Determine event status based on dates
  const getEventStatus = (event) => {
    const now = dayjs();
    const start = dayjs(event.startDate);
    const end = dayjs(event.endDate);
    
    if (now.isBefore(start)) return 'upcoming';
    if (now.isAfter(end)) return 'completed';
    return 'ongoing';
  };

  // Get appropriate tag color based on event status
  const getStatusTag = (event) => {
    const status = getEventStatus(event);
    
    if (status === 'upcoming') {
      return <Tag color="blue">Upcoming</Tag>;
    } else if (status === 'ongoing') {
      return <Tag color="green">Ongoing</Tag>;
    } else {
      return <Tag color="gray">Completed</Tag>;
    }
  };

  // Get appropriate tag color based on event type
  const getTypeTag = (type) => {
    const colors = {
      seminar: 'purple',
      meeting: 'orange',
      organization: 'cyan',
      general: 'geekblue',
    };
    
    return <Tag color={colors[type] || 'default'}>{type.charAt(0).toUpperCase() + type.slice(1)}</Tag>;
  };

  // Table columns definition
  const columns = [
    {
      title: 'Event Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            {getTypeTag(record.type)}
            {getStatusTag(record)}
          </div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <CalendarOutlined />
            {dayjs(record.startDate).format('MMM DD, YYYY')} - {dayjs(record.endDate).format('MMM DD, YYYY')}
          </Space>
          <Space>
            <ClockCircleOutlined />
            {record.startTime} - {record.endTime}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Participants',
      key: 'participants',
      render: (_, record) => (
        <Space>
          <TeamOutlined />
          {record.attendance ? record.attendance.length : 0} / {record.participants ? record.participants.length : 0}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            type="text"
          />
          <Popconfirm
            title="Are you sure you want to delete this event?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              type="text"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card bordered={false}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={4}>Event Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            Create Event
          </Button>
        </div>

        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Input
                placeholder="Search events..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                prefix={<FilterOutlined />}
              />
            </Col>
            <Col>
              <Button 
                onClick={fetchEvents} 
                icon={<ReloadOutlined />}
                loading={loading}
              >
                Refresh
              </Button>
            </Col>
          </Row>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="All Events" key="all" />
          <TabPane tab="Seminars" key="seminar" />
          <TabPane tab="Meetings" key="meeting" />
          <TabPane tab="Organizations" key="organization" />
          <TabPane tab="General" key="general" />
          <TabPane tab="Active" key="active" />
          <TabPane tab="Inactive" key="inactive" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={getFilteredEvents()}
          rowKey="_id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Total ${total} events`,
          }}
        />
      </Card>

      {/* Create/Edit Event Modal */}
      <Modal
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="Event Title"
                rules={[{ required: true, message: 'Please enter event title' }]}
              >
                <Input placeholder="Enter event title" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Event Type"
                rules={[{ required: true, message: 'Please select event type' }]}
              >
                <Select placeholder="Select event type">
                  <Option value="seminar">Seminar</Option>
                  <Option value="meeting">Meeting</Option>
                  <Option value="organization">Organization</Option>
                  <Option value="general">General</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} placeholder="Enter event description" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter event location' }]}
          >
            <Input placeholder="Enter event location" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="Event Date Range"
                rules={[{ required: true, message: 'Please select event dates' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Start Time"
                rules={[{ required: true, message: 'Please select start time' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true, message: 'Please select end time' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventManagement;