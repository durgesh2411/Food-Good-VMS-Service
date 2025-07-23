// const backendUrl = "http://localhost:8000/api/v1";
// const backendUrl = "http://localhost:8000/api/v1";

// export { backendUrl };
// TEMPORARY: Hard-code for testing
// Use VITE_BACKEND_URL if set, otherwise default to localhost
const baseBackendUrl = import.meta.env.VITE_BACKEND_URL || "https://food-good-vms-service.onrender.com";

// Ensure the URL always ends with /api/v1
export const backendUrl = baseBackendUrl.endsWith('/api/v1') 
  ? baseBackendUrl 
  : `${baseBackendUrl}/api/v1`;

// For production, this will be set via Render environment variable
// For development, it falls back to localhost
console.log('Backend URL:', backendUrl); // Debug log
console.log('Environment VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL); // Debug log
