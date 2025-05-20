import React, { useState, useEffect } from 'react'
import { getEventsWithAttendance, getEventAttendance, exportAttendanceCSV } from '../services/attendance'
import { Card, Row, Col, Typography, Button, Table, Badge, Spin, Alert, List, Divider, Space, Tooltip } from 'antd'
import { DownloadOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const _attendanceManagement = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventDetails, setEventDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await getEventsWithAttendance()
        setEvents(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch events: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleEventSelect = async (eventId) => {
    if (selectedEvent === eventId) {
      setSelectedEvent(null)
      setEventDetails(null)
      return
    }
    
    try {
      setLoading(true)
      setSelectedEvent(eventId)
      const data = await getEventAttendance(eventId)
      setEventDetails(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch event details: ' + err.message)
      setSelectedEvent(null)
    } finally {
      setLoading(false)
    }
  }
  // Function to format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Not available';
      }
      
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (err) {
      console.error('Error formatting date:', err, dateString);
      return 'Not available';
    }
  }
  // Function to export attendance data as CSV
  const handleExportCSV = async () => {
    if (!eventDetails || !eventDetails.attendance || eventDetails.attendance.length === 0) {
      return
    }
    
    try {
      setLoading(true)
      // Get CSV blob from the backend API
      const blob = await exportAttendanceCSV(selectedEvent)
      
      // Create a download link for the blob
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `attendance-${eventDetails.event.title}-${new Date().toISOString()}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setError(null)
    } catch (err) {
      setError('Failed to export CSV: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Attendance Management</Title>
      
      {loading && !selectedEvent && <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" tip="Loading events data..." /></div>}
      
      {error && (
        <Alert 
          message="Error" 
          description={error}
          type="error" 
          showIcon 
          style={{ marginBottom: '16px' }}
        />
      )}      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card title="Events" bordered>
            {events.length === 0 && !loading ? (
              <Alert
                message="No Events"
                description="No events found in the system."
                type="warning"
                showIcon
              />
            ) : (
              <List
                dataSource={events}
                renderItem={event => (
                  <List.Item
                    key={event._id}
                    onClick={() => handleEventSelect(event._id)}
                    style={{ cursor: 'pointer', padding: '12px 16px' }}
                    className={selectedEvent === event._id ? 'ant-list-item-active' : ''}
                  >
                    <List.Item.Meta
                      title={event.title}
                      description={formatDateTime(event.startDate)}
                    />
                    <Space>
                      <Badge 
                        status={event.isActive ? "success" : "error"}
                        text={event.isActive ? "Active" : "Inactive"} 
                      />
                      <Badge 
                        count={event.attendance ? event.attendance.length : 0}
                        overflowCount={999}
                        style={{ backgroundColor: '#1890ff' }}
                      />
                    </Space>
                  </List.Item>
                )}
                style={{ 
                  height: 'calc(100vh - 240px)',
                  overflowY: 'auto',
                }}
              />
            )}
          </Card>
        </Col>
          <Col xs={24} md={16}>
          {loading && selectedEvent && (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" tip="Loading event details..." />
              </div>
            </Card>
          )}
            {!loading && selectedEvent && eventDetails && (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={4}>{eventDetails.event ? eventDetails.event.title : eventDetails.title}</Title>
                <Button 
                  onClick={handleExportCSV}
                  type="primary"
                  icon={<DownloadOutlined />}
                  disabled={!eventDetails.attendance || eventDetails.attendance.length === 0 || loading}
                >
                  {loading ? 'Exporting...' : 'Export CSV'}
                </Button>
              </div>
              
              <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col span={12}>
                  <Text type="secondary">Start Date:</Text>{' '}
                  <Text>{formatDateTime(eventDetails.event ? eventDetails.event.startDate : eventDetails.startDate)}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">End Date:</Text>{' '}
                  <Text>{formatDateTime(eventDetails.event ? eventDetails.event.endDate : eventDetails.endDate)}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Location:</Text>{' '}
                  <Text>{eventDetails.event ? eventDetails.event.location : eventDetails.location}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Status:</Text>{' '}
                  <Badge 
                    status={(eventDetails.event ? eventDetails.event.isActive : eventDetails.isActive) ? "success" : "error"}
                    text={(eventDetails.event ? eventDetails.event.isActive : eventDetails.isActive) ? "Active" : "Inactive"} 
                  />
                </Col>
              </Row>
              
              <Divider orientation="left">Attendance Register</Divider>
              
              {!eventDetails.attendance || eventDetails.attendance.length === 0 ? (
                <Alert
                  message="No attendance records for this event"
                  type="warning"
                  showIcon
                />
              ) : (                <Table
                  dataSource={eventDetails.attendance}
                  rowKey={(record, idx) => idx}
                  columns={[
                    {
                      title: 'ID Number',
                      dataIndex: ['userDetails', 'idNumber'],
                      key: 'idNumber'
                    },
                    {
                      title: 'Name',
                      dataIndex: ['userDetails', 'name'],
                      key: 'name'
                    },
                    {
                      title: 'Role',
                      dataIndex: ['userDetails', 'role'],
                      key: 'role',
                      render: (role) => role.charAt(0).toUpperCase() + role.slice(1)
                    },
                   
                    {
                      title: 'Check-in Time',
                      dataIndex: 'checkedInAt',
                      key: 'checkedInAt',
                      render: (checkedInAt) => formatDateTime(checkedInAt)
                    }
                  ]}
                  bordered
                  pagination={{ pageSize: 10 }}
                />
              )}
            </Card>
          )}
          
          {!selectedEvent && !loading && (
            <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
              <Text type="secondary">Select an event to view attendance details</Text>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default _attendanceManagement