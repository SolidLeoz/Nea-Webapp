/**
 * Layout - Componente per strutture di pagina specifiche
 * Usato solo quando serve un layout particolare per determinate pagine
 */
export default function Layout({ children }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  )
}
