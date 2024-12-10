import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import withAuth from '../components/withAuth'
import config from '../config'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [posts, setPosts] = useState([])
  const router = useRouter()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Funzione per formattare la data
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('it-IT', options)
  }

  // Funzione per aggiornare lo stato di un appuntamento
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    const token = localStorage.getItem('token')
    if (!token || !isAdmin) return

    try {
      const response = await fetch(`${config.backendUrl}/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Aggiorna la lista degli appuntamenti
        const updatedAppointments = appointments.map(app => 
          app._id === appointmentId ? { ...app, status: newStatus } : app
        )
        setAppointments(updatedAppointments)
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato:', error)
    }
  }

  // Funzione per eliminare un appuntamento
  const deleteAppointment = async (appointmentId) => {
    if (!confirm('Sei sicuro di voler eliminare questo appuntamento?') || !isAdmin) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`${config.backendUrl}/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Rimuovi l'appuntamento dalla lista
        setAppointments(appointments.filter(app => app._id !== appointmentId))
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'appuntamento:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        // Fetch users (solo per admin)
        if (isAdmin) {
          const usersResponse = await fetch(`${config.backendUrl}/api/users`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (usersResponse.ok) {
            const usersData = await usersResponse.json()
            setUsers(usersData.users || [])
          }
        }

        // Fetch appointments (diverso per admin e utenti normali)
        const appointmentsEndpoint = isAdmin ? 
          `${config.backendUrl}/api/appointments` : 
          `${config.backendUrl}/api/appointments/my`
        
        const appointmentsResponse = await fetch(appointmentsEndpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json()
          // Gestisce sia il caso admin (oggetto con appointments) che utente normale (array diretto)
          setAppointments(isAdmin ? appointmentsData.appointments : appointmentsData)
        }

        // Fetch posts (visibili a tutti)
        const postsResponse = await fetch(`${config.backendUrl}/api/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          setPosts(postsData)
        }
      } catch (error) {
        console.error('Errore nel recupero dei dati:', error)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user, isAdmin])

  const handlePostClick = (postId) => {
    router.push(`/posts/${postId}`)
  }

  const handleCreatePost = () => {
    router.push('/posts/create')
  }

  // Funzione per ottenere il colore dello stato
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-200',
      confirmed: 'bg-green-200',
      completed: 'bg-blue-200',
      cancelled: 'bg-red-200'
    }
    return colors[status] || 'bg-gray-200'
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {isAdmin ? 'Dashboard Admin' : 'I Miei Appuntamenti'}
        </h1>
        
        {/* Sezione Utenti (solo per admin) */}
        {isAdmin && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Utenti Registrati</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2">Nome</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Data Registrazione</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="border-t px-4 py-2">{user.name}</td>
                      <td className="border-t px-4 py-2">{user.email}</td>
                      <td className="border-t px-4 py-2">
                        {user.createdAt && formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Sezione Appuntamenti */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            {isAdmin ? 'Tutti gli Appuntamenti' : 'I Miei Appuntamenti'}
          </h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  {isAdmin && <th className="px-4 py-2">Cliente</th>}
                  <th className="px-4 py-2">Servizio</th>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Ora</th>
                  <th className="px-4 py-2">Stato</th>
                  {isAdmin && <th className="px-4 py-2">Azioni</th>}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    {isAdmin && (
                      <td className="border-t px-4 py-2">
                        {appointment.userId?.name || 'N/A'}
                      </td>
                    )}
                    <td className="border-t px-4 py-2">{appointment.service}</td>
                    <td className="border-t px-4 py-2">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="border-t px-4 py-2">{appointment.time}</td>
                    <td className="border-t px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="border-t px-4 py-2">
                        <div className="flex space-x-2">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={appointment.status}
                            onChange={(e) => updateAppointmentStatus(appointment._id, e.target.value)}
                          >
                            <option value="pending">In attesa</option>
                            <option value="confirmed">Confermato</option>
                            <option value="completed">Completato</option>
                            <option value="cancelled">Cancellato</option>
                          </select>
                          <button
                            onClick={() => deleteAppointment(appointment._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sezione Post (solo per admin) */}
        {isAdmin && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Post del Blog</h2>
              <button
                onClick={handleCreatePost}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Crea nuovo post
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div 
                  key={post._id} 
                  className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePostClick(post._id)}
                >
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600">{post.content.substring(0, 100)}...</p>
                  <div className="mt-4 text-sm text-gray-500">
                    {post.createdAt && formatDate(post.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  )
}

export default withAuth(Dashboard)
