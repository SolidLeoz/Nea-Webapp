/**
 * Componente Navbar
 * Gestisce la navigazione principale dell'applicazione
 * Caratteristiche:
 * - Responsive design (mobile/desktop)
 * - Navigazione con Next.js Link
 * - Styling con Tailwind CSS
 * - Effetti hover
 * - Posizionamento sticky
 */

import Link from 'next/link'

/**
 * Navbar - Componente di navigazione principale
 * @returns {JSX.Element} Barra di navigazione responsive
 */
export default function Navbar() {
  return (
    /**
     * Container principale della navbar
     * - sticky top-0: Rimane fissa in alto durante lo scroll
     * - z-10: Assicura che la navbar sia sempre sopra altri elementi
     * - bg-gray-800: Sfondo scuro
     * - text-white: Testo bianco
     * - shadow-md: Ombra per enfatizzare la separazione
     */
    <nav className="sticky top-0 z-10 bg-gray-800 text-white shadow-md">
      {/* 
        Container interno con padding e flex layout
        - container: Larghezza massima responsiva
        - mx-auto: Centra orizzontalmente
        - flex justify-between: Distribuisce gli elementi agli estremi
      */}
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo/Brand dell'agenzia */}
        <Link href="/" className="font-bold text-xl">Nea Web Agency</Link>

        {/* 
          Menu di navigazione
          - hidden md:flex: Nascosto su mobile, visibile su desktop
          - space-x-4: Spaziatura tra i link
        */}
        <div className="hidden md:flex space-x-4">
          {/* Link di navigazione con effetto hover */}
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="/servizi" className="hover:text-blue-500">Servizi</Link>
          <Link href="/blog" className="hover:text-blue-500">Blog</Link>
          <Link href="/agency" className="hover:text-blue-500">Agency</Link>
        </div>
      </div>
    </nav>
  )
}
