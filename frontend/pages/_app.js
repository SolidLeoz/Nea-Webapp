import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * Componente root dell'applicazione
 * Gestisce il layout globale e i provider
 */
function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default MyApp
