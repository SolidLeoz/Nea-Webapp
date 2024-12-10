import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import config from '../config'
import { useAuth } from '../context/AuthContext'

export default function Contatti() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    nome: '',
    telefono: '',
    messaggio: '',
    data: '',
    ora: '',
    service: 'Consulenza' // Servizio di default
  })

  const [status, setStatus] = useState({
    message: '',
    type: '' // 'success' o 'error'
  })

  // Reindirizza alla pagina di registrazione se l'utente non è autenticato
  useEffect(() => {
    if (!user) {
      setStatus({
        message: 'Per prenotare un appuntamento è necessario registrarsi o effettuare l\'accesso',
        type: 'error'
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ message: '', type: '' })

    try {
      // Recupera il token dal localStorage
      const token = localStorage.getItem('token')

      // Se non c'è token, reindirizza alla registrazione
      if (!token) {
        router.push('/register?redirect=/contatti')
        return
      }

      // Prepara i dati per l'API
      const appointmentData = {
        date: formData.data,
        time: formData.ora,
        service: formData.service,
        notes: `
          Nome: ${formData.nome}
          Email: ${user.email}
          Telefono: ${formData.telefono}
          Messaggio: ${formData.messaggio}
        `
      }

      // Invia la richiesta al backend
      const response = await fetch(`${config.backendUrl}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointmentData)
      })

      if (!response.ok) {
        throw new Error('Errore nella prenotazione dell\'appuntamento')
      }

      // Resetta il form
      setFormData({
        nome: '',
        telefono: '',
        messaggio: '',
        data: '',
        ora: '',
        service: 'Consulenza'
      })

      // Mostra messaggio di successo
      setStatus({
        message: 'Appuntamento prenotato con successo! Ti contatteremo presto per la conferma.',
        type: 'success'
      })

    } catch (error) {
      console.error('Errore:', error)
      setStatus({
        message: 'Si è verificato un errore durante la prenotazione. Riprova più tardi.',
        type: 'error'
      })
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Contattaci</h1>
        <div className="max-w-md mx-auto">
          {status.message && (
            <div className={`mb-4 p-4 rounded ${
              status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status.message}
              {!user && (
                <div className="mt-2">
                  <button
                    onClick={() => router.push('/register')}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Registrati ora
                  </button>
                  {' o '}
                  <button
                    onClick={() => router.push('/login')}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    accedi
                  </button>
                  {' per fissare un appuntamento'}
                </div>
              )}
            </div>
          )}
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block mb-1">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border rounded bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block mb-1">Telefono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="service" className="block mb-1">Servizio</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Consulenza">Consulenza</option>
                  <option value="Supporto Tecnico">Supporto Tecnico</option>
                  <option value="Formazione">Formazione</option>
                  <option value="Altro">Altro</option>
                </select>
              </div>
              <div>
                <label htmlFor="messaggio" className="block mb-1">Messaggio</label>
                <textarea
                  id="messaggio"
                  name="messaggio"
                  value={formData.messaggio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border rounded"
                ></textarea>
              </div>
              <div>
                <label htmlFor="data" className="block mb-1">Data preferita</label>
                <input
                  type="date"
                  id="data"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                  min={new Date().toISOString().split('T')[0]} // Impedisce date passate
                />
              </div>
              <div>
                <label htmlFor="ora" className="block mb-1">Ora preferita</label>
                <input
                  type="time"
                  id="ora"
                  name="ora"
                  value={formData.ora}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                  min="09:00"
                  max="18:00"
                />
              </div>
              <div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Fissa appuntamento
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Per fissare un appuntamento è necessario essere registrati.
              </p>
              <button
                onClick={() => router.push('/register')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg mr-4"
              >
                Registrati
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                Accedi
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
