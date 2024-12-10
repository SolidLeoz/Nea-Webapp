import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

// HOC per proteggere le rotte admin
const withAdminAuth = (WrappedComponent) => {
  const WithAdminAuthComponent = (props) => {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      // Se il caricamento è completato e l'utente non è admin, reindirizza
      if (!loading) {
        if (!user) {
          router.replace('/login');
        } else if (user.role !== 'admin') {
          router.replace('/');
        }
      }
    }, [user, loading, router]);

    // Mostra un loader mentre verifica l'autenticazione
    if (loading || !user) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Caricamento...</div>
        </div>
      );
    }

    // Se l'utente non è admin, non mostrare nulla mentre reindirizza
    if (user.role !== 'admin') {
      return null;
    }

    // Se l'utente è admin, mostra il componente
    return <WrappedComponent {...props} />;
  };

  // Copia il nome del componente per una migliore esperienza di debug
  WithAdminAuthComponent.displayName = `withAdminAuth(${getDisplayName(WrappedComponent)})`;

  return WithAdminAuthComponent;
};

// Utility per ottenere il nome del componente
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAdminAuth;
