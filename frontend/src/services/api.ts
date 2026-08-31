import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api',
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ci_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ci_token');
        localStorage.removeItem('ci_user');
        // Prevent redirect loop if already on login/signup
        if (!window.location.pathname.startsWith('/login') && 
            !window.location.pathname.startsWith('/signup')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  signup: (email: string, password: string, companyName: string) =>
    api.post('/auth/signup', { email, password, companyName, organizationName: companyName }),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/reset-password', { token, password }),
};

export const projectService = {
  getProjects: () => api.get('/projects'),
  createProject: (data: { name: string, domain: string }) => api.post('/projects', data),
  getOverview: (projectId: string) => api.get(`/projects/${projectId}/overview`),
  getProjectDetails: (projectId: string) => api.get(`/projects/${projectId}`),
  updateProject: (projectId: string, data: { name: string, domain: string }) => api.put(`/projects/${projectId}`, data),
  deleteProject: (projectId: string) => api.delete(`/projects/${projectId}`),
};

export const eventService = {
  getSessions: (projectId: string) => api.get(`/projects/${projectId}/sessions`),
  getSessionReplay: (sessionId: string) => api.get(`/sessions/${sessionId}/replay`),
};

export const insightsService = {
  chat: (data: { message: string, history: any[], projectId: string }) => api.post('/insights/chat', data),
};

export const alertService = {
  getAlerts: (projectId: string) => api.get(`/alerts?projectId=${projectId}`),
  resolveAlert: (alertId: string) => api.put(`/alerts/${alertId}/resolve`),
  testDiscordWebhook: (data: { webhookUrl: string; projectId: string }) => api.post('/alerts/test-discord', data),
};

export default api;
