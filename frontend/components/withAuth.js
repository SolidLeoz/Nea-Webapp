import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifyAdmin } from '../utils/api';

const withAuth = (WrappedComponent, requireAdmin = false) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
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
      };

      checkAuth();
    }, []);

    if (!isAuthenticated || (requireAdmin && !isAdmin)) {
      return null; // o un componente di caricamento
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
