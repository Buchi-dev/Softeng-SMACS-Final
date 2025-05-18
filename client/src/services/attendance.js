// Service functions for attendance management

const EVENT_API_URL = 'http://localhost:5000/api/events';
const ATTENDANCE_API_URL = 'http://localhost:5000/api/attendance';

/**
 * Check in a user to an event using their ID
 * @param {String} eventId - The MongoDB ID of the event
 * @param {String} idNumber - The ID number of the user (from RFID scan)
 * @returns {Promise<Object>} - The updated event data with attendance
 */
export const checkInAttendance = async (eventId, idNumber) => {
  try {
    // Use the direct event check-in endpoint
    const response = await fetch(`${EVENT_API_URL}/${eventId}/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idNumber }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check in');
    }
    
    return data;
  } catch (error) {
    console.error('Error checking in:', error);
    throw error;
  }
};

/**
 * Get all events with attendance information
 * @returns {Promise<Array>} - List of events with attendance data
 */
export const getEventsWithAttendance = async () => {
  try {
    const response = await fetch(`${EVENT_API_URL}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching events with attendance:', error);
    throw error;
  }
};

/**
 * Get event details with attendance information
 * @param {String} eventId - The MongoDB ID of the event
 * @returns {Promise<Object>} - Event details with attendance data
 */
export const getEventAttendance = async (eventId) => {
  try {
    const response = await fetch(`${ATTENDANCE_API_URL}/${eventId}`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch event');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching event attendance:', error);
    throw error;
  }
};

/**
 * Get attendance statistics for all events
 * @returns {Promise<Array>} - List of attendance statistics for all events
 */
export const getAttendanceStatistics = async () => {
  try {
    const response = await fetch(`${ATTENDANCE_API_URL}/stats`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch attendance statistics');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    throw error;
  }
};

/**
 * Export attendance data for an event as CSV
 * @param {String} eventId - The MongoDB ID of the event
 * @returns {Promise<Blob>} - CSV file as blob
 */
export const exportAttendanceCSV = async (eventId) => {
  try {
    const response = await fetch(`${ATTENDANCE_API_URL}/${eventId}/export`);
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to export attendance');
    }
    
    return response.blob();
  } catch (error) {
    console.error('Error exporting attendance:', error);
    throw error;
  }
};

/**
 * Check in a user using RFID scanner
 * @param {String} eventId - The MongoDB ID of the event
 * @param {String} idNumber - The ID number from RFID scan
 * @returns {Promise<Object>} - Check-in result
 */
export const rfidCheckIn = async (eventId, idNumber) => {
  try {
    const response = await fetch(`${ATTENDANCE_API_URL}/${eventId}/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idNumber }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check in with RFID');
    }
    
    return data;
  } catch (error) {
    console.error('Error checking in with RFID:', error);
    throw error;
  }
};