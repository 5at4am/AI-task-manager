import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, new_password: newPassword });
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/tasks/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (task) => {
    const response = await api.post('/tasks/', task);
    return response.data;
  },

  update: async (id, task) => {
    const response = await api.patch(`/tasks/${id}`, task);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  toggleComplete: async (id, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    const response = await api.patch(`/tasks/${id}`, { status: newStatus });
    return response.data;
  },
};

// AI API
export const aiAPI = {
  suggest: async (title, description, tags, provider = 'groq') => {
    const response = await api.post('/ai/suggest', { title, description, tags, provider });
    return response.data;
  },

  summarize: async (taskIds = null, provider = 'groq') => {
    const response = await api.post('/ai/summarize', { task_ids: taskIds, provider });
    return response.data;
  },
};

export default api;
