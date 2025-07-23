// const backendUrl = "http://localhost:8000/api/v1";
// const backendUrl = "http://localhost:8000/api/v1";

// export { backendUrl };
// Use VITE_BACKEND_URL if set, otherwise default to localhost
export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/v1";
