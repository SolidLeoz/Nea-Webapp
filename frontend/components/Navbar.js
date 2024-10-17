import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">Nea Web Agency</Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="/servizi" className="hover:text-blue-500">Servizi</Link>
          <Link href="/blog" className="hover:text-blue-500">Blog</Link>
          <Link href="/agency" className="hover:text-blue-500">Agency</Link>
        </div>
      </div>
    </nav>
  )
}
