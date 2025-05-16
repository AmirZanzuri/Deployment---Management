// src/entities/ComponentVersion.jsx
import { api } from '../api/client';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export class ComponentVersion {
  static async list(sort = '-created_at') {
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        const response = await api.get('/component-versions', { 
          params: { sort }
        });
        return response.data || [];
      } catch (error) {
        retries++;
        console.error(`Attempt ${retries} failed:`, error.message);
        
        if (retries === MAX_RETRIES) {
          console.error('Max retries reached. Returning empty array.');
          return [];
        }
        
        await sleep(RETRY_DELAY * retries);
      }
    }
    
    return [];
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