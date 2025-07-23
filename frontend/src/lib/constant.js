// const backendUrl = "http://localhost:8000/api/v1";
// const backendUrl = "http://localhost:8000/api/v1";

// export { backendUrl };
// Production-ready backend URL configuration
// Use VITE_BACKEND_URL if set, otherwise fallback to production URL
const baseBackendUrl = import.meta.env.VITE_BACKEND_URL || "https://food-good-vms-service.onrender.com";

// Ensure the URL always ends with /api/v1
export const backendUrl = baseBackendUrl.endsWith('/api/v1')
  ? baseBackendUrl
  : `${baseBackendUrl}/api/v1`;

// Debug logs for development/troubleshooting
if (import.meta.env.DEV) {
  console.log('Backend URL:', backendUrl);
  console.log('Environment VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
}
//durgesh
