import { apiFetch } from '../lib/api.js';

export const authService = {
  login: (body) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) =>
    apiFetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) =>
    apiFetch('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
};

export const companionService = {
  get: () => apiFetch('/api/companion'),
  save: (body) => apiFetch('/api/companion', { method: 'POST', body: JSON.stringify(body) }),
  templates: () => apiFetch('/api/companion/templates'),
  chat: (message) => apiFetch('/api/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  history: () => apiFetch('/api/chat/history'),
};

export const checkinService = {
  create: (body) => apiFetch('/api/checkins', { method: 'POST', body: JSON.stringify(body) }),
  history: () => apiFetch('/api/checkins/history'),
};

export const habitService = {
  list: (date) => apiFetch(date ? `/api/habits?date=${date}` : '/api/habits'),
  logs: () => apiFetch('/api/habits/logs'),
  create: (name) => apiFetch('/api/habits', { method: 'POST', body: JSON.stringify({ name }) }),
  toggle: (id, date) =>
    apiFetch(`/api/habits/${id}/toggle${date ? `?date=${date}` : ''}`, { method: 'POST' }),
  remove: (id) => apiFetch(`/api/habits/${id}`, { method: 'DELETE' }),
};

export const journalService = {
  list: () => apiFetch('/api/journals'),
  create: (body) => apiFetch('/api/journals', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/journals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => apiFetch(`/api/journals/${id}`, { method: 'DELETE' }),
};

export const goalService = {
  list: () => apiFetch('/api/goals'),
  create: (body) => apiFetch('/api/goals', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/goals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => apiFetch(`/api/goals/${id}`, { method: 'DELETE' }),
};

export const gardenService = {
  progress: () => apiFetch('/api/gamification/progress'),
  setTheme: (theme) =>
    apiFetch('/api/gamification/theme', { method: 'POST', body: JSON.stringify({ theme }) }),
};

export const analyticsService = {
  dashboard: () => apiFetch('/api/dashboard'),
  correlations: () => apiFetch('/api/correlations'),
  burnout: () => apiFetch('/api/burnout/check'),
};

export const reflectionService = {
  weekly: () => apiFetch('/api/reflections/weekly'),
  futureMe: () => apiFetch('/api/future-me/generate'),
  letters: () => apiFetch('/api/letters'),
  writeLetter: (content, unlockDate) =>
    apiFetch('/api/letters', {
      method: 'POST',
      body: JSON.stringify({ content, unlockDate }),
    }),
};

export const gratitudeService = {
  create: (body) => apiFetch('/api/gratitude', { method: 'POST', body: JSON.stringify(body) }),
  history: () => apiFetch('/api/gratitude/history'),
};

export const examService = {
  list: () => apiFetch('/api/exams'),
  create: (body) => apiFetch('/api/exams', { method: 'POST', body: JSON.stringify(body) }),
  study: (id, minutes) =>
    apiFetch(`/api/exams/${id}/study?minutes=${minutes}`, { method: 'POST' }),
};

export const badgeService = {
  list: () => apiFetch('/api/badges'),
  challenges: () => apiFetch('/api/challenges'),
};

export const moodService = {
  create: (mood) => apiFetch('/api/moods', { method: 'POST', body: JSON.stringify({ mood }) }),
  list: () => apiFetch('/api/moods'),
};

export const adminService = {
  users: () => apiFetch('/api/admin/users'),
  moderation: () => apiFetch('/api/admin/moderation/content'),
  crisisEvents: () => apiFetch('/api/admin/crisis-events'),
};
