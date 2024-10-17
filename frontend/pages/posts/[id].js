import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import withAuth from '../../components/withAuth'
import config from '../../config'

function SinglePost() {
  const [post, setPost] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return

      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const response = await fetch(`${config.backendUrl}/api/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const postData = await response.json()
          setPost(postData)
        } else {
          console.error('Errore nel recupero del post')
        }
      } catch (error) {
        console.error('Errore nella richiesta:', error)
      }
    }

    fetchPost()
  }, [id])

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  if (!post) {
    return <div>Caricamento...</div>
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <button
          onClick={handleBackToDashboard}
          className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Torna alla Dashboard
        </button>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-4">Autore: {post.author}</p>
        <div className="prose max-w-none">
          {post.content}
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(SinglePost)
