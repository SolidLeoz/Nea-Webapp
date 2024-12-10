import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, verifyAuth } from '../utils/auth';
import config from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        if (token) {
          const response = await fetch(`${config.backendUrl}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Se la risposta non è ok, rimuovi il token
            localStorage.removeItem('token');
            setUser(null);
            if (response.status === 401) {
              setError('Sessione scaduta. Effettua nuovamente il login.');
            }
          }
        }
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error);
        setError('Errore nel recupero dei dati utente');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
}
