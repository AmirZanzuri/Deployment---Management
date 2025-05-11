import React, { useState, useEffect } from 'react';
import { Platform } from '@/entities/Platform';

function Platforms() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    type: 'web',
    environment: 'production',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await Platform.list();
      setPlatforms(data);
    } catch (err) {
      console.error('Failed to load platforms:', err);
      setError('Failed to load platforms. Please try again later.');
      // In development, set some mock data so we can still see the UI
      if (import.meta.env.DEV) {
        setPlatforms([
          { id: 1, name: 'Web Platform', version: '1.0', type: 'web', environment: 'production', created_at: '2023-01-01' },
          { id: 2, name: 'Mobile App', version: '2.5', type: 'mobile', environment: 'staging', created_at: '2023-01-02' },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Call the API to create a new platform
      const newPlatform = await Platform.create(formData);
      
      // Close the dialog and reset form
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        version: '',
        type: 'web',
        environment: 'production',
      });
      
      // Refresh platforms list
      loadPlatforms();
    } catch (error) {
      setFormError('Failed to create platform. Please try again.');
      console.error('Error creating platform:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnvironmentBadge = (environment) => {
    const envColors = {
      production: 'bg-red-100 text-red-800',
      staging: 'bg-yellow-100 text-yellow-800',
      testing: 'bg-blue-100 text-blue-800',
      development: 'bg-green-100 text-green-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${envColors[environment] || 'bg-gray-100 text-gray-800'}`}>
        {environment}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      web: 'bg-purple-100 text-purple-800',
      mobile: 'bg-blue-100 text-blue-800',
      desktop: 'bg-indigo-100 text-indigo-800',
      server: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Platforms</h1>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Platform
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading platforms...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : platforms.length === 0 ? (
        <div className="text-center py-10 bg-white shadow-sm rounded-lg">
          <p className="mb-4 text-gray-600">No platforms found.</p>
          <p className="text-gray-500">Create your first platform to get started!</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {platforms.map((platform) => (
                <tr key={platform.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{platform.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{platform.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getTypeBadge(platform.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getEnvironmentBadge(platform.environment)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(platform.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Platform Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
              onClick={() => setIsCreateModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Create New Platform
                    </h3>
                    
                    {formError && (
                      <div className="mt-2 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {formError}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          required
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                          Version
                        </label>
                        <input
                          type="text"
                          name="version"
                          id="version"
                          value={formData.version}
                          onChange={handleFormChange}
                          required
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Platform Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleFormChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="web">Web</option>
                          <option value="mobile">Mobile</option>
                          <option value="desktop">Desktop</option>
                          <option value="server">Server</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="environment" className="block text-sm font-medium text-gray-700">
                          Environment
                        </label>
                        <select
                          id="environment"
                          name="environment"
                          value={formData.environment}
                          onChange={handleFormChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="production">Production</option>
                          <option value="staging">Staging</option>
                          <option value="testing">Testing</option>
                          <option value="development">Development</option>
                        </select>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Platform'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Platforms;