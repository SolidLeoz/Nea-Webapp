import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import withAdminAuth from '../../components/withAdminAuth';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch all data in parallel
        const [statsData, usersData, appointmentsData] = await Promise.all([
          api.getUserStats(),
          api.getUsers('?limit=5'),
          api.getAppointments('?limit=5')
        ]);

        setStats(statsData);
        setUsers(usersData.users);
        setAppointments(appointmentsData.appointments);
      } catch (err) {
        console.error('Errore nel caricamento dei dati:', err);
        setError(err.message || 'Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Caricamento...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Errore! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Riprova
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Pannello Amministratore</h1>

        {/* Statistiche generali */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Utenti Totali</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Amministratori</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalAdmins || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Nuovi Utenti (30gg)</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.recentUsers || 0}</p>
          </div>
        </div>

        {/* Sezioni principali */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ultimi utenti */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ultimi Utenti</h2>
              <Link href="/admin/users" className="text-blue-600 hover:text-blue-800">
                Vedi tutti →
              </Link>
            </div>
            <div className="space-y-4">
              {users.length > 0 ? (
                users.map(user => (
                  <div key={user._id} className="border-b pb-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nessun utente trovato</p>
              )}
            </div>
          </div>

          {/* Ultimi appuntamenti */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ultimi Appuntamenti</h2>
              <Link href="/admin/appointments" className="text-blue-600 hover:text-blue-800">
                Vedi tutti →
              </Link>
            </div>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map(appointment => (
                  <div key={appointment._id} className="border-b pb-2">
                    <p className="font-medium">
                      {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                    <p className="text-xs text-gray-500">
                      Stato: <span className={`font-medium ${
                        appointment.status === 'confirmed' ? 'text-green-600' :
                        appointment.status === 'cancelled' ? 'text-red-600' :
                        appointment.status === 'completed' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nessun appuntamento trovato</p>
              )}
            </div>
          </div>
        </div>

        {/* Menu azioni rapide */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Azioni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/users" className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center">
              Gestione Utenti
            </Link>
            <Link href="/admin/appointments" className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center">
              Gestione Appuntamenti
            </Link>
            <Link href="/admin/posts" className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg text-center">
              Posts
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAdminAuth(AdminPanel);
