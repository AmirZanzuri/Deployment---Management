import React, { useState } from 'react';
import { Platform } from '@/entities/Platform';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function CreatePlatformForm({ onPlatformCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    type: 'web',
    environment: 'production',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Call the API to create a new platform
      const newPlatform = await Platform.create(formData);
      
      // Close the dialog and reset form
      setIsOpen(false);
      setFormData({
        name: '',
        version: '',
        type: 'web',
        environment: 'production',
      });
      
      // Notify parent component that a new platform was created
      if (onPlatformCreated) {
        onPlatformCreated(newPlatform);
      }
    } catch (error) {
      setError('Failed to create platform. Please try again.');
      console.error('Error creating platform:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Platform</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Platform</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Platform Name
            </label>
            <input
              id="name"
              name="name"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="version" className="block text-sm font-medium">
              Version
            </label>
            <input
              id="version"
              name="version"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.version}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium">
              Platform Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
              <option value="server">Server</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="environment" className="block text-sm font-medium">
              Environment
            </label>
            <select
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="testing">Testing</option>
              <option value="development">Development</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Platform'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}