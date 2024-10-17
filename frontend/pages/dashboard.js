import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import withAuth from '../components/withAuth'
import config from '../config'

function Dashboard() {
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [posts, setPosts] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        // Fetch users
        const usersResponse = await fetch(`${config.backendUrl}/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
        }

        // Fetch appointments
        const appointmentsResponse = await fetch(`${config.backendUrl}/api/appointments`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json()
          setAppointments(appointmentsData)
        }

        // Fetch posts
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

    fetchData()
  }, [])

  const handlePostClick = (postId) => {
    router.push(`/posts/${postId}`)
  }

  const handleCreatePost = () => {
    router.push('/posts/create')
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Dashboard Admin</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Utenti Registrati</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Nome</th>
                  <th className="px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{user.id}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Appuntamenti Fissati</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">ID Utente</th>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Ora</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="border px-4 py-2">{appointment.id}</td>
                    <td className="border px-4 py-2">{appointment.userId}</td>
                    <td className="border px-4 py-2">{appointment.date}</td>
                    <td className="border px-4 py-2">{appointment.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Post</h2>
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
                className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePostClick(post._id)}
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600">{post.content.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default withAuth(Dashboard)
