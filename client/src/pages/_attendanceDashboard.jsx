import React, { useState, useEffect } from 'react'
import { getAttendanceStatistics } from '../services/attendance'
import { Card, Row, Col, Typography, Badge, Tag, Progress, Spin, Alert, Statistic, Divider } from 'antd'
import { CheckCircleOutlined, UserOutlined, PercentageOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const _attendanceDashboard = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getAttendanceStatistics()
        setEvents(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch attendance statistics: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Attendance Dashboard</Title>
      
      {loading && <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" tip="Loading events data..." /></div>}
      
      {error && (
        <Alert 
          message="Error" 
          description={error}
          type="error" 
          showIcon 
          style={{ marginBottom: '16px' }}
        />
      )}

      {!loading && events.length === 0 && (
        <Alert
          message="No Events"
          description="No events found in the system."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}      <Row gutter={[16, 16]}>
        {events.map(event => (
          <Col 
            key={event._id}
            xs={24} 
            md={12} 
            lg={8}
          >
            <Card 
              hoverable 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{event.title}</span>
                  <Badge 
                    status={event.isActive ? "success" : "error"} 
                    text={event.isActive ? "Active" : "Inactive"}
                  />
                </div>
              }
              style={{ height: '100%' }}
            >
              <div style={{ marginBottom: '16px' }}>
                <p>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  {event.location}
                </p>
              </div>
              
              <Divider>Attendance Statistics</Divider>
              
              <Row gutter={16} style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Col span={8}>
                  <Statistic 
                    title="Check-ins" 
                    value={event.attendanceCount || 0}
                    prefix={<CheckCircleOutlined />} 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Registered" 
                    value={event.participantCount || 0}
                    prefix={<UserOutlined />} 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Rate" 
                    value={event.attendanceRate ? Math.round(event.attendanceRate) : 0}
                    suffix="%" 
                    prefix={<PercentageOutlined />}
                  />
                </Col>
              </Row>
              
              <Progress 
                percent={Math.min(100, event.attendanceRate || 0)} 
                showInfo={false} 
                status={event.attendanceRate > 70 ? "success" : event.attendanceRate > 30 ? "normal" : "exception"}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default _attendanceDashboard