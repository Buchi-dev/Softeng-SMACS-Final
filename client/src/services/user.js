// Service functions for user data management

const API_URL = 'http://localhost:5000/api/users';

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - The created user data
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise<Array>} - List of users
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user by ID number
 * @param {string} idNumber - User ID number
 * @returns {Promise<Object>} - User data
 */
export const getUserByIdNumber = async (idNumber) => {
  try {
    const response = await fetch(`${API_URL}/idNumber/${idNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update user
 * @param {string} idNumber - User ID number
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUser = async (idNumber, userData) => {
  try {
    const response = await fetch(`${API_URL}/${idNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete user
 * @param {string} idNumber - User ID number
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteUser = async (idNumber) => {
  try {
    const response = await fetch(`${API_URL}/${idNumber}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};