import config from '../config';

/**
 * Funzione di utilità per gestire le richieste API
 * @param {string} endpoint - L'endpoint API (senza il base URL)
 * @param {Object} options - Opzioni della richiesta (method, body, ecc.)
 * @returns {Promise} - Promise con la risposta JSON
 */
export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    },
    credentials: 'include',
  };

  const response = await fetch(`${config.backendUrl}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  });

  // Se la risposta non è ok, genera un errore
  if (!response.ok) {
    // Se il token non è valido, rimuovilo
    if (response.status === 401) {
      localStorage.removeItem('token');
    }

    // Prova a ottenere il messaggio di errore dal JSON
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message;
    } catch {
      errorMessage = 'Si è verificato un errore';
    }

    throw new Error(errorMessage);
  }

  // Se la risposta è 204 No Content, ritorna null
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Funzioni di utilità per le richieste API comuni
 */

export const api = {
  // Auth
  login: (credentials) => 
    fetchApi('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  
  register: (userData) => 
    fetchApi('/api/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  
  getCurrentUser: () => 
    fetchApi('/api/auth/me'),

  // Users
  getUsers: (params = '') => 
    fetchApi(`/api/users${params}`),
  
  updateUserRole: (userId, role) => 
    fetchApi(`/api/users/${userId}/role`, { 
      method: 'PUT', 
      body: JSON.stringify({ role }) 
    }),
  
  updateProfile: (userData) => 
    fetchApi('/api/users/profile', { 
      method: 'PUT', 
      body: JSON.stringify(userData) 
    }),

  // Posts
  fetchPosts: () =>
    fetchApi('/api/posts'),

  createPost: (postData) =>
    fetchApi('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    }),

  updatePost: (postId, postData) =>
    fetchApi(`/api/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData)
    }),

  deletePost: (postId) =>
    fetchApi(`/api/posts/${postId}`, {
      method: 'DELETE'
    }),

  // Appointments
  getAppointments: (params = '') => 
    fetchApi(`/api/appointments${params}`),
  
  createAppointment: (appointmentData) => 
    fetchApi('/api/appointments', { 
      method: 'POST', 
      body: JSON.stringify(appointmentData) 
    }),
  
  updateAppointmentStatus: (appointmentId, status) => 
    fetchApi(`/api/appointments/${appointmentId}/status`, { 
      method: 'PUT', 
      body: JSON.stringify({ status }) 
    }),

  // Stats
  getUserStats: () => 
    fetchApi('/api/users/stats/summary'),
};

/**
 * Verifica se l'utente corrente è un amministratore
 * @returns {Promise<boolean>} - Promise che risolve con true se l'utente è admin, false altrimenti
 */
export async function verifyAdmin() {
  try {
    const user = await fetchApi('/api/auth/me');
    return user && user.role === 'admin';
  } catch (error) {
    console.error('Errore durante la verifica dello stato admin:', error);
    return false;
  }
}


export const createPost = api.createPost;
export const updatePost = api.updatePost;
export const deletePost = api.deletePost;
// Esporta la funzione fetchPosts direttamente per compatibilità
export const fetchPosts = api.fetchPosts;

export default api;
