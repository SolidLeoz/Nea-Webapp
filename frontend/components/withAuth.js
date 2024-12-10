import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifyAdmin } from '../utils/api';

const withAuth = (WrappedComponent, requireAdmin = false) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // Controlla se c'è un token nell'URL
          const { token } = router.query;
          if (token) {
            localStorage.setItem('token', token);
            // Rimuovi il token dall'URL per sicurezza
            const newPath = router.pathname;
            router.replace(newPath);
          }

          // Prendi il token dal localStorage
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            router.replace('/login');
            return;
          }

          if (requireAdmin) {
            const adminStatus = await verifyAdmin();
            setIsAdmin(adminStatus);
            if (!adminStatus) {
              router.replace('/');
              return;
            }
          }

          setIsAuthenticated(true);
        } catch (error) {
          console.error('Errore durante la verifica dell\'autenticazione:', error);
          router.replace('/login');
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router.query.token]); // Aggiungiamo il token come dipendenza

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated || (requireAdmin && !isAdmin)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
