import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_URL,
});

/* =========================
   AUTH INTERCEPTOR
========================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

/* =========================
   AUTH API
========================= */
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login: (data) => api.post('/api/auth/login', data),
};

/* =========================
   USER API
========================= */
export const userAPI = {
  getProfile: () => api.get('/api/user/me'),
  updateProfile: (data) => api.put('/api/user/me', data),
  getUser: (id) => api.get(`/api/user/${id}`),
};

/* =========================
   MATCHING API
========================= */
export const matchingAPI = {
  getCandidates: () => api.get('/api/matches/candidates'),
  swipe: (targetId, type) =>
    api.post('/api/matches/swipe', { targetId, type }),
};

/* =========================
   CHAT API
========================= */
export const chatAPI = {
  getConversations: () => api.get('/api/chat/conversations'),
  getMessages: (conversationId, params) =>
    api.get(`/api/chat/messages/${conversationId}`, { params }),
  getMatches: () => api.get('/api/chat/matches'),
};

/* =========================
   MATCH REQUEST API
========================= */
export const matchAPI = {
  getRequests: () => api.get('/api/chat/requests'),
  getPending: () => api.get('/api/chat/pending'),
};

/* =========================
   PROFILE API
========================= */
export const profileAPI = {
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    return api.post('/api/profile/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

/* =========================
   AI API (OPENROUTER)
========================= */
export const aiAPI = {
  chat: (messages) => api.post('/api/ai/chat', { messages }),
};

export default api;
