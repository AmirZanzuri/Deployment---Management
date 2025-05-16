// src/entities/ComponentVersion.jsx
import { api } from '../api/client';

export class ComponentVersion {
  static async list(sort = '-created_at') {
    try {
      const response = await api.get('/component-versions', { 
        params: { sort },
        // Add request timeout specifically for this endpoint if needed
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      // Enhanced error logging
      if (error.response) {
        console.error('Error response from component versions API:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error('No response received from component versions API:', {
          request: error.request,
          message: error.message
        });
      } else {
        console.error('Error setting up component versions request:', error.message);
      }
      // Re-throw the error to be handled by the calling component
      throw error;
    }
  }

  static async get(id) {
    try {
      const response = await api.get(`/component-versions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching component version ${id}:`, error);
      throw error;
    }
  }

  static async create(versionData) {
    try {
      const response = await api.post('/component-versions', versionData);
      return response.data;
    } catch (error) {
      console.error('Error creating component version:', error);
      throw error;
    }
  }

  static async update(id, versionData) {
    try {
      const response = await api.put(`/component-versions/${id}`, versionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating component version ${id}:`, error);
      throw error;
    }
  }
}