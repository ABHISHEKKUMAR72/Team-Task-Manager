import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Project services
export const projectService = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, data) => api.post(`/projects/${projectId}/members`, data),
  removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
};

// Task services
export const taskService = {
  createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  getProjectTasks: (projectId) => api.get(`/projects/${projectId}/tasks`),
  updateTask: (taskId, data) => api.put(`/projects/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/projects/tasks/${taskId}`),
  getTaskStats: () => api.get('/projects/stats/overview'),
};

export default api;
