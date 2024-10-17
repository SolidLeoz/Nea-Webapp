import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'
import config from '../config'

export default function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/posts`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        } else {
          console.error('Errore nel recupero dei post')
        }
      } catch (error) {
        console.error('Errore nella richiesta:', error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="mb-4">{post.content.substring(0, 150)}...</p>
              <Link href={`/posts/${post._id}`} className="text-blue-500 hover:underline">
                Leggi di più
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/contatti" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Contattaci per una consulenza
          </Link>
        </div>
      </div>
    </Layout>
  )
}
