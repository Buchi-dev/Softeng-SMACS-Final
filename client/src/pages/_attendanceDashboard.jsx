import React, { useState, useEffect } from 'react'
import { getAttendanceStatistics } from '../services/attendance'


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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Dashboard</h1>
      
      {loading && <div className="text-center">Loading events data...</div>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No events found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div 
            key={event._id} 
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <div className="text-gray-600 mb-3">
              <div>Date: {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</div>
              <div>Location: {event.location}</div>
              <div>Status: <span className={`font-medium ${event.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {event.isActive ? 'Active' : 'Inactive'}
              </span></div>
            </div>
              <div className="mt-4 pt-3 border-t">
              <h3 className="font-semibold">Attendance Statistics:</h3>
              <div className="flex justify-between mt-2">
                <div>
                  <div className="text-lg font-bold">{event.attendanceCount || 0}</div>
                  <div className="text-sm text-gray-500">Check-ins</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{event.participantCount || 0}</div>
                  <div className="text-sm text-gray-500">Registered</div>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {event.attendanceRate ? Math.round(event.attendanceRate) : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Attendance Rate</div>
                </div>
              </div>
              
              <div className="mt-3 pt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, event.attendanceRate || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default _attendanceDashboard