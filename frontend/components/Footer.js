import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left">
            <h3 className="text-lg font-bold">Nea Web Agency</h3>
            <p className="mt-2">Soluzioni digitali innovative</p>
          </div>
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <h4 className="text-lg font-semibold mb-2">Link rapidi</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-blue-300">Home</Link></li>
              <li><Link href="/servizi" className="hover:text-blue-300">Servizi</Link></li>
              <li><Link href="/blog" className="hover:text-blue-300">Blog</Link></li>
              <li><Link href="/agency" className="hover:text-blue-300">Agency</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 mt-4 md:mt-0 text-center md:text-right">
            <p>&copy; 2023 Nea Web Agency. Tutti i diritti riservati.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
