// src/api.js

// Replace this with your actual backend API base URL
export const BASE_URL = 'http://localhost:5136/api';

/**
 * A utility function to make API requests with the BASE_URL.
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/invoices', '/users/1')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Returns the JSON response or throws an error
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirect to login if we're not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please login again.');
    }

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle ASP.NET Core validation errors
      if (errorData.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        throw new Error(errorMessages || `Validation failed with status ${response.status}`);
      }

      throw new Error(errorData.message || errorData.title || `API request failed with status ${response.status}`);
    }

    // Sometimes DELETE or empty responses don't have JSON body
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// --- Helper Functions for Common Operations ---

// GET request
export const apiGet = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'GET' });
};

// POST request (Save/Create)
export const apiPost = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request (Edit/Update)
export const apiPut = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const apiDelete = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
};

export default {
  BASE_URL,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
