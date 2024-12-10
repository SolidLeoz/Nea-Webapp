/**
 * Layout principale dell'applicazione
 * Questo componente:
 * - Definisce la struttura base di tutte le pagine
 * - Gestisce il layout responsive
 * - Integra navbar e footer
 * - Utilizza Tailwind CSS per lo styling
 */

import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Layout - Componente wrapper per tutte le pagine
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenuto della pagina da renderizzare
 * @returns {JSX.Element} Layout completo con navbar, contenuto e footer
 */
export default function Layout({ children }) {
  return (
    /**
     * Container principale
     * - flex flex-col: Organizza gli elementi in colonna
     * - min-h-screen: Assicura che il layout occupi almeno l'intera altezza dello schermo
     */
    <div className="flex flex-col min-h-screen">
      {/* Navbar fissa in alto */}
      <Navbar />

      {/* 
        Contenuto principale
        flex-grow: Permette al contenuto di espandersi per occupare lo spazio disponibile
      */}
      <main className="flex-grow">{children}</main>

      {/* Footer fisso in basso */}
      <Footer />
    </div>
  )
}
