import { buildApiProfile } from '../lib/storage';
import { supabase } from '../lib/supabaseClient';

const API_BASE = '/api';

const api = async (path, options = {}) => {
  const headers = { ...options.headers };
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
    return data;
  } catch (err) {
    if (err.name === 'TypeError') {
      throw new Error('API server is not reachable. Start the backend and try again.');
    }
    throw err;
  }
};

/** Backend only calls OpenAI — profile comes from browser storage */
export const aiApi = {
  recommend: (extraNotes = '', user = null) =>
    api('/recommend-career', {
      method: 'POST',
      body: JSON.stringify({ profile: buildApiProfile(user), extraNotes }),
    }),

  uploadResume: (file) => {
    const fd = new FormData();
    fd.append('resume', file);
    return api('/resume', { method: 'POST', body: fd });
  },

  chat: (message, user = null) =>
    api('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, profile: buildApiProfile(user) }),
    }),
};
