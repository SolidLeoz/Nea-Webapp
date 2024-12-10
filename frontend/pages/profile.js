import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import config from '../config'

export default function Profile() {
  const router = useRouter()
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  })
  const [status, setStatus] = useState({
    message: '',
    type: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    setFormData(prev => ({
      ...prev,
      name: user.name
    }))
  }, [user, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (formData.name.length < 2) {
      setStatus({
        message: 'Il nome deve essere di almeno 2 caratteri',
        type: 'error'
      })
      return false
    }
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        setStatus({
          message: 'La password deve essere di almeno 6 caratteri',
          type: 'error'
        })
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setStatus({
          message: 'Le password non coincidono',
          type: 'error'
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${config.backendUrl}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          ...(formData.password && { password: formData.password })
        })
      })

      if (!response.ok) {
        throw new Error('Errore durante l\'aggiornamento del profilo')
      }

      const data = await response.json()
      login(data.user) // Aggiorna i dati utente nel context

      setStatus({
        message: 'Profilo aggiornato con successo',
        type: 'success'
      })

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }))

    } catch (error) {
      console.error('Errore:', error)
      setStatus({
        message: 'Si è verificato un errore durante l\'aggiornamento del profilo',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null // Non mostrare nulla mentre reindirizza
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8">Il tuo profilo</h1>

          {status.message && (
            <div className={`mb-4 p-4 rounded ${
              status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status.message}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">
              Metodo di accesso: {user.googleId ? 'Google' : 'Email e password'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {user.googleId && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-medium mb-4">Imposta password</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Puoi impostare una password per accedere anche senza Google
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Nuova password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Minimo 6 caratteri"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Conferma password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ripeti la password"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Aggiornamento...' : 'Aggiorna profilo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
