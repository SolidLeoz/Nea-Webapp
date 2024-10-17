import Layout from '../components/Layout'
import Link from 'next/link'

const services = [
  {
    title: 'App Development',
    description: 'Sviluppiamo applicazioni mobili innovative per iOS e Android.',
  },
  {
    title: 'Web App Development',
    description: 'Creiamo applicazioni web scalabili e performanti.',
  },
  {
    title: 'Lead Generation',
    description: 'Strategie efficaci per acquisire nuovi clienti e far crescere il tuo business.',
  },
  {
    title: 'ASO & SEO',
    description: 'Ottimizziamo la visibilità della tua app e del tuo sito web.',
  },
  {
    title: 'Social Automation',
    description: 'Automatizziamo la tua presenza sui social media per massimizzare l\'engagement.',
  },
]

export default function Servizi() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">I nostri servizi</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
              <p className="mb-6">{service.description}</p>
              <Link href="/contatti" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Richiedi informazioni
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
