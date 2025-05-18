// Service functions for admin authentication and data handling

const API_URL = 'http://localhost:5000/api/admins';

/**
 * Create a new admin account
 * @param {Object} adminData - Admin registration data
 * @returns {Promise<Object>} - The created admin data
 */
export const createAdmin = async (adminData) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create admin account');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

/**
 * Login an admin user
 * @param {Object} credentials - Login credentials (email and password)
 * @returns {Promise<Object>} - Admin data and authentication info
 */
export const loginAdmin = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

/**
 * Get admin details by ID
 * @param {string} id - Admin ID
 * @returns {Promise<Object>} - Admin data
 */
export const getAdminById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch admin data');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching admin:', error);
    throw error;
  }
};

/**
 * Reset admin password
 * @param {Object} resetData - Email and new password
 * @returns {Promise<Object>} - Reset confirmation
 */
export const resetAdminPassword = async (resetData) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }
    
    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};