/**
 * Componente principale dell'applicazione Next.js
 * Questo file è il punto di ingresso dell'applicazione e:
 * - Gestisce il layout globale
 * - Importa gli stili globali
 * - Avvolge ogni pagina dell'applicazione
 * - Gestisce lo stato globale e i provider
 */

// Importa gli stili globali dell'applicazione
import '../styles/globals.css'

/**
 * MyApp - Componente root dell'applicazione
 * @param {Object} props - Props del componente
 * @param {Component} props.Component - Il componente della pagina corrente
 * @param {Object} props.pageProps - Props da passare al componente della pagina
 * @returns {JSX.Element} L'applicazione renderizzata con il componente della pagina corrente
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
