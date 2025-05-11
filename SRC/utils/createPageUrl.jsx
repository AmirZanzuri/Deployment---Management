// src/utils/createPageUrl.jsx
export function createPageUrl(pageName, params = {}) {
    const routes = {
      Dashboard: '/',
      Projects: '/projects',
      DeploymentMatrix: '/deployment-matrix',
      Products: '/products',
    };
  
    const baseUrl = routes[pageName] || '/';
    
    // Add query parameters if any
    if (Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      return `${baseUrl}?${queryString}`;
    }
    
    return baseUrl;
  }