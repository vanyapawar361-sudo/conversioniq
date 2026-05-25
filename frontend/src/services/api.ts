import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
});

// Set token from localStorage if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ci_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const projectService = {
  getProjects: () => api.get('/projects'),
  createProject: (data: { name: string, domain: string }) => api.post('/projects', data),
  getOverview: (projectId: string) => api.get(`/projects/${projectId}/overview`),
};

export const eventService = {
  getSessions: (projectId: string) => api.get(`/projects/${projectId}/sessions`),
  getSessionReplay: (sessionId: string) => api.get(`/sessions/${sessionId}/replay`),
};
