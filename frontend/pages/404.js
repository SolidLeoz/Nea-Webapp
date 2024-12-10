import Layout from '../components/Layout';
import Link from 'next/link';

// Componente per la pagina di errore 404
const Custom404 = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          {/* Titolo principale */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          {/* Sottotitolo descrittivo */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Pagina Non Trovata
          </h2>
          
          {/* Messaggio di spiegazione */}
          <p className="text-gray-600 mb-8">
            Ci dispiace, la pagina che stai cercando non esiste o è stata spostata.
          </p>
          
          {/* Pulsante per tornare alla home */}
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Torna alla Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Custom404;
