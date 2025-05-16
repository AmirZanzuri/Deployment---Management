// src/entities/ComponentVersion.jsx
import { api } from '../api/client';

export class ComponentVersion {
  static async list(sort = '-created_at') {
    try {
      const response = await api.get('/component-versions', {
        params: { sort },
        timeout: 5000, // 5 second timeout
      });
      return response.data;
    } catch (error) {
      // Detailed error logging
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        console.error('Error fetching component versions:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error fetching component versions:', {
          request: error.request,
          message: error.message,
        });
      } else {
        // Error in request setup
        console.error('Error setting up request:', error.message);
      }
      
      // Re-throw the error with a user-friendly message
      throw new Error('Unable to fetch component versions. Please try again later.');
    }
  }

  static async get(id) {
    try {
      const response = await api.get(`/component-versions/${id}`, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching component version ${id}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`Unable to fetch component version ${id}. Please try again later.`);
    }
  }

  static async create(versionData) {
    try {
      const response = await api.post('/component-versions', versionData, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating component version:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error('Unable to create component version. Please try again later.');
    }
  }

  static async update(id, versionData) {
    try {
      const response = await api.put(`/component-versions/${id}`, versionData, {
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating component version ${id}:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`Unable to update component version ${id}. Please try again later.`);
    }
  }
}