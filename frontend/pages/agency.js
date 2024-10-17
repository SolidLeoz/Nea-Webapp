import Layout from '../components/Layout'
import Link from 'next/link'

export default function Agency() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">La nostra Agenzia</h1>
        
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Chi siamo</h2>
          <p className="text-lg mb-4">
            Siamo un'agenzia web innovativa specializzata nello sviluppo di soluzioni digitali all'avanguardia. 
            Il nostro team di esperti è dedicato a trasformare le idee dei nostri clienti in realtà digitali di successo.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">La nostra missione</h2>
          <p className="text-lg mb-4">
            La nostra missione è fornire soluzioni digitali innovative e su misura che aiutino i nostri clienti 
            a raggiungere i loro obiettivi di business, migliorando la loro presenza online e aumentando il loro successo nel mondo digitale.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Il nostro approccio</h2>
          <ul className="list-disc list-inside text-lg mb-4">
            <li>Collaborazione stretta con i clienti</li>
            <li>Soluzioni personalizzate per ogni progetto</li>
            <li>Utilizzo delle tecnologie più recenti</li>
            <li>Attenzione ai dettagli e alla qualità</li>
            <li>Supporto continuo post-lancio</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/contatti" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Lavora con noi
          </Link>
        </div>
      </div>
    </Layout>
  )
}
