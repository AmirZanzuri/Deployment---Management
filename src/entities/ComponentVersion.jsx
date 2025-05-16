// src/entities/ComponentVersion.jsx
import { api } from '../api/client';

export class ComponentVersion {
  static async list(sort = '-created_at') {
    try {
      const response = await api.get('/component-versions', { 
        params: { sort },
        // Add retry logic for network issues
        retry: 3,
        retryDelay: 1000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching component versions:', error);
      if (error.message === 'Network Error') {
        console.error('Please check that the API server is running and accessible');
      }
      if (error.code === 'ECONNABORTED') {
        console.error('The request timed out - please try again');
      }
      return [];
    }
  }

  static async get(id) {
    try {
      const response = await api.get(`/component-versions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching component version ${id}:`, error);
      return null;
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