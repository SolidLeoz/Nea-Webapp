import { useState } from 'react'
import Layout from '../components/Layout'

export default function Contatti() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    messaggio: '',
    data: '',
    ora: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Qui implementeremo la logica per inviare i dati al backend e prenotare l'appuntamento
    console.log('Dati del form:', formData)
    alert('Grazie per la tua richiesta. Ti contatteremo presto per confermare l\'appuntamento.')
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Contattaci</h1>
        <div className="max-w-md mx-auto">
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
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
              />
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Richiedi appuntamento
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
