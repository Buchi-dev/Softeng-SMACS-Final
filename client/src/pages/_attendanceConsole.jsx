import React, { useState, useEffect, useRef } from 'react'
import { getEventsWithAttendance, rfidCheckIn } from '../services/attendance'
import { Card, Input, Button, List, Badge, Tag, Typography, Row, Col, Space, Divider, Alert, Spin, Empty } from 'antd'
import { SearchOutlined, CheckCircleOutlined, ScanOutlined, RollbackOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const _attendanceConsole = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [idInput, setIdInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [checkInStatus, setCheckInStatus] = useState(null)
  const [recentCheckins, setRecentCheckins] = useState([])
  const idInputRef = useRef(null)

  // Fetch all active events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const data = await getEventsWithAttendance()
        // Filter only active events
        const activeEvents = data.filter(event => event.isActive)
        setEvents(activeEvents)
        setFilteredEvents(activeEvents)
        setError(null)
      } catch (err) {
        setError('Failed to fetch events: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Focus the ID input field whenever it's empty
  useEffect(() => {
    if (idInputRef.current && selectedEvent && !idInput) {
      idInputRef.current.focus()
    }
  }, [idInput, selectedEvent])

  // Filter events based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredEvents(filtered)
    } else {
      setFilteredEvents(events)
    }
  }, [searchTerm, events])

  // Handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event)
    setIdInput('')
    setCheckInStatus(null)
    idInputRef.current?.focus()
  }

  // Handle ID input change
  const handleIdInputChange = (e) => {
    setIdInput(e.target.value)
  }

  // Handle ID form submission
  const handleIdSubmit = async (e) => {
    e.preventDefault()
    
    if (!idInput || !selectedEvent) return
    
    try {
      setLoading(true)
      // Use rfidCheckIn instead of checkInAttendance for RFID scanner
      const response = await rfidCheckIn(selectedEvent._id, idInput)
      
      // Add to recent check-ins list
      const newCheckin = {
        id: idInput,
        eventTitle: selectedEvent.title,
        timestamp: new Date().toISOString(),
        // Include user name if available in the response
        userName: response.userName || null
      }
      
      setRecentCheckins(prev => [newCheckin, ...prev].slice(0, 10))
      
      setCheckInStatus({
        success: true,
        message: `Check-in successful${response.userName ? ' for ' + response.userName : ''}!`
      })
    } catch (err) {
      setCheckInStatus({
        success: false,
        message: err.message || 'Failed to check in'
      })
    } finally {
      setLoading(false)
      setIdInput('')
      // Focus back on input field for next scan
      setTimeout(() => {
        idInputRef.current?.focus()
      }, 100)
    }
  }

  // Clear status message after 5 seconds
  useEffect(() => {
    if (checkInStatus) {
      const timer = setTimeout(() => {
        setCheckInStatus(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [checkInStatus])

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Attendance Console</Title>
      
      {loading && !selectedEvent && <Spin tip="Loading events data..." size="large" />}
      
      {error && (
        <Alert 
          message="Error" 
          description={error}
          type="error" 
          showIcon 
          style={{ marginBottom: '16px' }}
        />
      )}      {!selectedEvent ? (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              allowClear
            />
          </div>
          
          {filteredEvents.length === 0 && !loading ? (
            <Alert
              message="No active events found"
              type="warning"
              showIcon
            />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredEvents.map(event => (
                <Col key={event._id} xs={24} md={12} lg={8}>
                  <Card 
                    hoverable
                    onClick={() => handleEventSelect(event)}
                    style={{ height: '100%' }}
                  >
                    <Title level={4}>{event.title}</Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text type="secondary">
                        <strong>Location:</strong> {event.location}
                      </Text>
                      <Text type="secondary">
                        <strong>Time:</strong> {formatDate(event.startDate)}
                      </Text>
                      <Divider />
                      <Text type="secondary" style={{ display: 'flex', alignItems: 'center' }}>
                        <ScanOutlined style={{ marginRight: 8 }} /> 
                        Click to start attendance check-in
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card bordered style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <Title level={3}>{selectedEvent.title}</Title>
                  <Text type="secondary">{selectedEvent.location} • {formatDate(selectedEvent.startDate)}</Text>
                </div>
                <Button 
                  onClick={() => setSelectedEvent(null)}
                  icon={<RollbackOutlined />}
                >
                  Change Event
                </Button>
              </div>
              
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Title level={4}>
                  <ScanOutlined style={{ marginRight: 8 }} />
                  RFID Check-in
                </Title>
                <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
                  Scan an RFID card or enter ID manually
                </Text>
                
                <form onSubmit={handleIdSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <Input.Group compact>
                    <Input
                      ref={idInputRef}
                      value={idInput}
                      onChange={handleIdInputChange}
                      placeholder="Scan or Type ID Number"
                      style={{ width: 'calc(100% - 100px)' }}
                      size="large"
                      autoFocus
                    />
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={!idInput || loading}
                      style={{ width: '100px' }}
                      size="large"
                      icon={<CheckCircleOutlined />}
                    >
                      Check In
                    </Button>
                  </Input.Group>
                  
                  {loading && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <Spin tip="Processing..." />
                    </div>
                  )}
                  
                  {checkInStatus && (
                    <Alert
                      style={{ marginTop: '16px' }}
                      message={checkInStatus.message}
                      type={checkInStatus.success ? "success" : "error"}
                      showIcon
                    />
                  )}
                </form>
              </div>
            </Card>          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="Recent Check-ins" bordered>
              {recentCheckins.length === 0 ? (
                <Empty description="No recent check-ins" />
              ) : (
                <List
                  dataSource={recentCheckins}
                  renderItem={(checkin, idx) => (
                    <List.Item key={idx}>
                      <List.Item.Meta
                        title={<Text strong>ID: {checkin.id}</Text>}
                        description={
                          <>
                            {checkin.userName && (
                              <div>{checkin.userName}</div>
                            )}
                            <Text type="secondary">
                              {new Date(checkin.timestamp).toLocaleTimeString()}
                            </Text>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default _attendanceConsole