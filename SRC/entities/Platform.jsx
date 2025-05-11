// src/entities/Platform.jsx
import { api } from '../api/client';

export class Platform {
  static async list(sort = '-created_at') {
    try {
      const response = await api.get('/platforms', { params: { sort } });
      return response.data;
    } catch (error) {
      console.error('Error fetching platforms:', error);
      return [];
    }
  }

  static async get(id) {
    try {
      const response = await api.get(`/platforms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching platform ${id}:`, error);
      return null;
    }
  }

  static async create(platformData) {
    try {
      const response = await api.post('/platforms', platformData);
      return response.data;
    } catch (error) {
      console.error('Error creating platform:', error);
      throw error;
    }
  }

  static async update(id, platformData) {
    try {
      const response = await api.put(`/platforms/${id}`, platformData);
      return response.data;
    } catch (error) {
      console.error(`Error updating platform ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await api.delete(`/platforms/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting platform ${id}:`, error);
      throw error;
    }
  }
}