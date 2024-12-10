import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import withAdminAuth from '../../components/withAdminAuth';
import api from '../../utils/api';

function AppointmentsManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let queryParams = `?page=${page}&limit=10`;
      if (dateFilter) queryParams += `&date=${dateFilter}`;
      if (statusFilter) queryParams += `&status=${statusFilter}`;

      const data = await api.getAppointments(queryParams);
      setAppointments(data.appointments);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Errore:', err);
      setError(err.message || 'Errore nel caricamento degli appuntamenti');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, dateFilter, statusFilter]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.updateAppointmentStatus(appointmentId, newStatus);

      setUpdateStatus({
        message: 'Stato aggiornato con successo',
        type: 'success'
      });

      // Aggiorna la lista appuntamenti
      fetchAppointments();

      // Reset del messaggio dopo 3 secondi
      setTimeout(() => {
        setUpdateStatus({ message: '', type: '' });
      }, 3000);
    } catch (err) {
      console.error('Errore:', err);
      setUpdateStatus({
        message: err.message || 'Errore nell\'aggiornamento dello stato',
        type: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'In attesa';
      case 'confirmed': return 'Confermato';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Annullato';
      default: return status;
    }
  };

  if (loading && appointments.length === 0) {
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
          <h1 className="text-3xl font-bold">Gestione Appuntamenti</h1>
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
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Tutti gli stati</option>
              <option value="pending">In attesa</option>
              <option value="confirmed">Confermato</option>
              <option value="completed">Completato</option>
              <option value="cancelled">Annullato</option>
            </select>
          </div>
        </div>

        {/* Tabella appuntamenti */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Data</th>
                <th className="px-6 py-3 text-left">Ora</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Servizio</th>
                <th className="px-6 py-3 text-left">Stato</th>
                <th className="px-6 py-3 text-left">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map(appointment => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{appointment.time}</td>
                  <td className="px-6 py-4">{appointment.userId?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{appointment.service}</td>
                  <td className="px-6 py-4">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}
                      className={`px-2 py-1 border rounded ${getStatusColor(appointment.status)}`}
                    >
                      <option value="pending">In attesa</option>
                      <option value="confirmed">Confermato</option>
                      <option value="completed">Completato</option>
                      <option value="cancelled">Annullato</option>
                    </select>
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

export default withAdminAuth(AppointmentsManagement);
