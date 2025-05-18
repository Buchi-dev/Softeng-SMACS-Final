import React, { useState, useEffect } from 'react'
import { getEventsWithAttendance, getEventAttendance, exportAttendanceCSV } from '../services/attendance'

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
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>
      
      {loading && !selectedEvent && <div className="text-center">Loading events data...</div>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-3">Events</h2>
          
          {events.length === 0 && !loading ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No events found.
            </div>
          ) : (
            <ul className="border rounded-lg divide-y">
              {events.map(event => (
                <li key={event._id} className="p-0">
                  <button 
                    onClick={() => handleEventSelect(event._id)}
                    className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${selectedEvent === event._id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">
                      {formatDateTime(event.startDate)}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${event.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm font-medium">
                        {event.attendance ? event.attendance.length : 0} check-ins
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="md:col-span-2">
          {loading && selectedEvent && (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              Loading event details...
            </div>
          )}
          
          {!loading && selectedEvent && eventDetails && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{eventDetails.title}</h2>                <button 
                  onClick={handleExportCSV}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  disabled={!eventDetails.attendance || eventDetails.attendance.length === 0 || loading}
                >
                  {loading ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <span className="ml-2">{formatDateTime(eventDetails.startDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <span className="ml-2">{formatDateTime(eventDetails.endDate)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2">{eventDetails.location}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 font-medium ${eventDetails.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {eventDetails.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Attendance Register</h3>
              
              {!eventDetails.attendance || eventDetails.attendance.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded">
                  No attendance records for this event.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 border text-left">User ID</th>
                        <th className="py-2 px-4 border text-left">Check-in Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventDetails.attendance.map((record, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border">{record.user}</td>
                          <td className="py-2 px-4 border">{formatDateTime(record.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {!selectedEvent && !loading && (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-gray-50 text-gray-500">
              Select an event to view attendance details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default _attendanceManagement