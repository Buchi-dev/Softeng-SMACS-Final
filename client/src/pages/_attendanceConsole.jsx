import React, { useState, useEffect, useRef } from 'react'
import { getEventsWithAttendance, rfidCheckIn } from '../services/attendance'

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Console</h1>
      
      {loading && !selectedEvent && <div className="text-center">Loading events data...</div>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!selectedEvent ? (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {filteredEvents.length === 0 && !loading ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No active events found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <button 
                  key={event._id} 
                  onClick={() => handleEventSelect(event)}
                  className="text-left border rounded-lg p-4 hover:bg-blue-50 transition-colors"
                >
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <div>
                    <span className="text-gray-600">Location:</span> {event.location}
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span> {formatDate(event.startDate)}
                  </div>
                  <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                    Click to start attendance check-in
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border rounded-lg p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                  <p className="text-gray-600">{selectedEvent.location} • {formatDate(selectedEvent.startDate)}</p>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="px-3 py-1 border rounded hover:bg-gray-100 transition-colors"
                >
                  Change Event
                </button>
              </div>
              
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-4">RFID Check-in</h3>
                <p className="mb-6 text-gray-600">Scan an RFID card or enter ID manually</p>
                
                <form onSubmit={handleIdSubmit} className="max-w-md mx-auto">
                  <div className="flex">
                    <input
                      ref={idInputRef}
                      type="text"
                      value={idInput}
                      onChange={handleIdInputChange}
                      placeholder="Scan or Type ID Number"
                      className="flex-1 p-3 border rounded-l text-lg"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!idInput || loading}
                      className={`px-6 py-3 rounded-r font-medium ${
                        !idInput || loading
                          ? 'bg-gray-300 text-gray-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } transition-colors`}
                    >
                      Check In
                    </button>
                  </div>
                  
                  {loading && (
                    <div className="mt-4 text-center text-gray-600">
                      Processing...
                    </div>
                  )}
                  
                  {checkInStatus && (
                    <div className={`mt-4 p-3 rounded ${
                      checkInStatus.success
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {checkInStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="text-lg font-semibold mb-3">Recent Check-ins</h3>
              
              {recentCheckins.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent check-ins</p>
              ) : (                <ul className="divide-y">
                  {recentCheckins.map((checkin, idx) => (
                    <li key={idx} className="py-3">
                      <div className="font-medium">ID: {checkin.id}</div>
                      {checkin.userName && (
                        <div className="text-sm text-gray-700">{checkin.userName}</div>
                      )}
                      <div className="text-sm text-gray-500">
                        {new Date(checkin.timestamp).toLocaleTimeString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default _attendanceConsole