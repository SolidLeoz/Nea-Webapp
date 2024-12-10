/**
 * Utility per la gestione dell'autenticazione
 * Gestisce le chiamate API per login, registrazione e verifica token
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Registra un nuovo utente
 * @param {Object} userData - Dati dell'utente (name, email, password)
 * @returns {Promise} Response con token e dati utente
 */
export const register = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Errore durante la registrazione');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Effettua il login di un utente
 * @param {Object} credentials - Credenziali (email, password)
 * @returns {Promise} Response con token e dati utente
 */
export const login = async (credentials) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Credenziali non valide');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verifica se l'utente è autenticato
 * @param {string} token - JWT token
 * @returns {Promise} Response con stato autenticazione
 */
export const verifyAuth = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Verifica se l'utente è admin
 * @param {string} token - JWT token
 * @returns {Promise<boolean>} True se l'utente è admin
 */
export const verifyAdmin = async (token) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/verify-admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data.isAdmin;
  } catch (error) {
    return false;
  }
};

/**
 * Salva il token nel localStorage
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Recupera il token dal localStorage
 * @returns {string|null} JWT token o null
 */
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Rimuove il token dal localStorage
 */
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};
