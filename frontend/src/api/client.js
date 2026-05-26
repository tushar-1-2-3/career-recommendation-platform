import { buildApiProfile } from '../lib/storage';

const API_BASE = '/api';

const api = async (path, options = {}) => {
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

/** Backend only calls OpenAI — profile comes from browser storage */
export const aiApi = {
  recommend: (extraNotes = '') =>
    api('/recommend-career', {
      method: 'POST',
      body: JSON.stringify({ profile: buildApiProfile(), extraNotes }),
    }),

  uploadResume: (file) => {
    const fd = new FormData();
    fd.append('resume', file);
    return api('/resume', { method: 'POST', body: fd });
  },

  chat: (message) =>
    api('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, profile: buildApiProfile() }),
    }),
};
