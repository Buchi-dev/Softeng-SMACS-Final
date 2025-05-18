// Service functions for event data management

const API_URL = 'http://localhost:5000/api/events';

/**
 * Create a new event
 * @param {Object} eventData - Event data including idNumber for creator instead of MongoDB _id
 * @returns {Promise<Object>} - The created event data
 */
export const createEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create event');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Get all events
 * @returns {Promise<Array>} - List of events
 */
export const getAllEvents = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Get event by ID
 * @param {string} id - Event ID
 * @returns {Promise<Object>} - Event data
 */
export const getEventById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch event');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Update event
 * @param {string} id - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} - Updated event data
 */
export const updateEvent = async (id, eventData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update event');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Delete event
 * @param {string} id - Event ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete event');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Check in user to event by ID number
 * @param {string} eventId - Event ID
 * @param {string} userIdNumber - User ID number
 * @returns {Promise<Object>} - Check-in confirmation
 */
export const checkInUserToEvent = async (eventId, userIdNumber) => {
  try {
    const response = await fetch(`${API_URL}/${eventId}/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idNumber: userIdNumber }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check in user to event');
    }
    
    return data;
  } catch (error) {
    console.error('Error checking in user:', error);
    throw error;
  }
};