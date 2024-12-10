import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import withAdminAuth from '../../components/withAdminAuth';
import api from '../../utils/api';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let queryParams = `?page=${page}&limit=10`;
      if (search) queryParams += `&search=${search}`;
      if (roleFilter) queryParams += `&role=${roleFilter}`;

      const data = await api.getUsers(queryParams);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message || 'Errore nel caricamento degli utenti');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);

      setUpdateStatus({
        message: 'Ruolo aggiornato con successo',
        type: 'success'
      });

      // Aggiorna la lista utenti
      fetchUsers();

      // Reset del messaggio dopo 3 secondi
      setTimeout(() => {
        setUpdateStatus({ message: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Errore:', err);
      setUpdateStatus({
        message: err.message || 'Errore nell\'aggiornamento del ruolo',
        type: 'error'
      });
    }
  };

  if (loading && users.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Caricamento...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestione Utenti</h1>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Torna indietro
          </button>
        </div>

        {/* Status message */}
        {updateStatus.message && (
          <div className={`mb-4 p-4 rounded ${
            updateStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {updateStatus.message}
          </div>
        )}

        {/* Filtri */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Cerca utenti..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Tutti i ruoli</option>
              <option value="user">Utenti</option>
              <option value="admin">Amministratori</option>
            </select>
          </div>
        </div>

        {/* Tabella utenti */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Ruolo</th>
                <th className="px-6 py-3 text-left">Registrato il</th>
                <th className="px-6 py-3 text-left">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="user">Utente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {/* Implementare visualizzazione dettagli */}}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Dettagli
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginazione */}
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${
              page === 1 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Precedente
          </button>
          <span className="px-4 py-2">
            Pagina {page} di {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded ${
              page === totalPages ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Successiva
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default withAdminAuth(UsersManagement);
