import Layout from '../components/Layout'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">Benvenuti nella nostra Web Agency</h1>
          <p className="text-xl mb-8">Soluzioni digitali innovative per far crescere il tuo business</p>
          <div className="space-x-4">
            {user ? (
              <Link href="/contatti" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Fissa un appuntamento
              </Link>
            ) : (
              <>
                <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Registrati
                </Link>
                <Link href="/contatti" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                  Fissa un appuntamento
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">I nostri servizi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['App Development', 'Web App Development', 'Lead Generation', 'ASO & SEO', 'Social Automation'].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">{service}</h3>
                <p className="mb-4">Descrizione breve del servizio {service}.</p>
                <Link href="/servizi" className="text-blue-500 hover:underline">Scopri di più</Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
