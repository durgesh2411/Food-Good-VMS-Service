// Production-ready backend URL configuration
// Use VITE_BACKEND_URL if set, otherwise fallback to localhost for development
const baseBackendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Ensure the URL always ends with /api/v1
export const backendUrl = baseBackendUrl.endsWith('/api/v1')
  ? baseBackendUrl
  : `${baseBackendUrl}/api/v1`;
