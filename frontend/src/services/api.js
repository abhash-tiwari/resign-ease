import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
  // backend deployed url that is stored in .env file = https://claw-task.onrender.com/api
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;