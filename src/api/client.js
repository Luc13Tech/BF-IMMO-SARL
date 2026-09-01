import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-bf-immo-sarl.onrender.com';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attache automatiquement le token admin s'il existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bfimmo_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Public =====
export const getServices = () => api.get('/services').then((r) => r.data.data);
export const getService = (slug) => api.get(`/services/${slug}`).then((r) => r.data.data);

export const getProperties = (params = {}) =>
  api.get('/properties', { params }).then((r) => r.data.data);
export const getProperty = (id) => api.get(`/properties/${id}`).then((r) => r.data.data);

export const getContent = () => api.get('/content').then((r) => r.data.data);

export const submitLead = (service, payload) =>
  api.post(`/leads/${service}`, payload).then((r) => r.data);

export const getAIContext = () => api.get('/ai-assistant/context').then((r) => r.data.data);

// ===== Admin =====
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data.admin);

export const getAllServicesAdmin = () => api.get('/services/admin/all').then((r) => r.data.data);
export const updateService = (id, payload) =>
  api.put(`/services/admin/${id}`, payload).then((r) => r.data.data);
export const reorderServices = (order) =>
  api.put('/services/admin/reorder/bulk', { order }).then((r) => r.data.data);

export const getAllPropertiesAdmin = () =>
  api.get('/properties/admin/all').then((r) => r.data.data);
export const createProperty = (payload) =>
  api.post('/properties', payload).then((r) => r.data.data);
export const updateProperty = (id, payload) =>
  api.put(`/properties/${id}`, payload).then((r) => r.data.data);
export const deleteProperty = (id) =>
  api.delete(`/properties/${id}`).then((r) => r.data);

export const getAllLeads = (params = {}) =>
  api.get('/leads/admin/all', { params }).then((r) => r.data.data);
export const updateLeadStatus = (id, status) =>
  api.put(`/leads/admin/${id}/status`, { status }).then((r) => r.data.data);
export const deleteLead = (id) => api.delete(`/leads/admin/${id}`).then((r) => r.data);

export const getAllContentAdmin = () => api.get('/content/admin/all').then((r) => r.data.data);
export const updateContent = (key, payload) =>
  api.put(`/content/admin/${key}`, payload).then((r) => r.data.data);
export const bulkUpdateContent = (items) =>
  api.put('/content/admin/bulk/update', { items }).then((r) => r.data.data);

export const uploadImage = (file, folder = 'misc') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  return api
    .post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data.data);
};

export const uploadMultipleImages = (files, folder = 'misc') => {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append('files', f));
  formData.append('folder', folder);
  return api
    .post('/upload/multiple', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data.data);
};

export const deleteImage = (publicId) =>
  api.delete(`/upload/${encodeURIComponent(publicId)}`).then((r) => r.data);

export const getAIKnowledgeAdmin = () =>
  api.get('/ai-assistant/admin/knowledge').then((r) => r.data.data);
export const createAIKnowledge = (payload) =>
  api.post('/ai-assistant/admin/knowledge', payload).then((r) => r.data.data);
export const updateAIKnowledge = (id, payload) =>
  api.put(`/ai-assistant/admin/knowledge/${id}`, payload).then((r) => r.data.data);
export const deleteAIKnowledge = (id) =>
  api.delete(`/ai-assistant/admin/knowledge/${id}`).then((r) => r.data);
