// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('immo_token');
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur API');
  return data;
}

export const api = {
  // ── Auth ──────────────────────────────────────────────
  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  changePassword: (ancien: string, nouveau: string) =>
    request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ ancien, nouveau }),
    }),
  getAnnonceBySlug: (slug: string) =>
  request(`/annonces/slug/${slug}`),
  // ── Annonces publiques ────────────────────────────────
  getAnnonces: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as any).toString();
    return request(`/annonces?${qs}`);
  },

  getAnnonce: (id: number) =>
    request(`/annonces/${id}`),

  // ── Admin ─────────────────────────────────────────────
  getAnnoncesAdmin: (params: Record<string, string | number> = {}) => {
    const qs = new URLSearchParams(params as any).toString();
    return request(`/annonces/admin/all?${qs}`);
  },

  getStats: () =>
    request('/annonces/admin/stats'),

  createAnnonce: (data: any) =>
    request('/annonces', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAnnonce: (id: number, data: any) =>
    request(`/annonces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateStatut: (id: number, statut: string) =>
    request(`/annonces/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    }),

  deleteAnnonce: (id: number) =>
    request(`/annonces/${id}`, { method: 'DELETE' }),

  // ── Upload images ─────────────────────────────────────
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    const token = getToken();
    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur upload');
    return data;
  },
};