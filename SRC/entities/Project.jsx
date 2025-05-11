// src/entities/Project.jsx
import { api } from '../api/client';

export class Project {
  static async list(sort = '-created_at') {
    try {
      const response = await api.get('/projects', { params: { sort } });
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  static async get(id) {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  }

  static async create(projectData) {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  static async update(id, projectData) {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
}