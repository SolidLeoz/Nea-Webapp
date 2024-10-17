import { useState } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import config from '../config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${config.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        router.push('/dashboard')
      } else {
        console.error('Errore durante il login')
      }
    } catch (error) {
      console.error('Errore di rete:', error)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${config.backendUrl}/api/auth/google`
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Login Admin</h1>
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Accedi
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <button onClick={handleGoogleLogin} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Accedi con Google
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
