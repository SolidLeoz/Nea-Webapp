import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';
import Layout from '../../components/Layout';
import { fetchPosts, createPost, updatePost, deletePost } from '../../utils/api';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error('Errore nel recupero dei post:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await updatePost(editingPost._id, { title, content });
      } else {
        await createPost({ title, content });
      }
      loadPosts();
      setTitle('');
      setContent('');
      setEditingPost(null);
    } catch (error) {
      console.error('Errore nella pubblicazione/modifica del post:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      loadPosts();
    } catch (error) {
      console.error('Errore nell\'eliminazione del post:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Gestione Post</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo del post"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenuto del post"
            className="w-full p-2 mb-4 border rounded h-32"
            required
          ></textarea>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            {editingPost ? 'Modifica Post' : 'Pubblica Post'}
          </button>
        </form>

        <div>
          {posts.map((post) => (
            <div key={post._id} className="border p-4 mb-4 rounded shadow">
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="mt-2">{post.content}</p>
              <div className="mt-4">
                <button onClick={() => handleEdit(post)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors">
                  Modifica
                </button>
                <button onClick={() => handleDelete(post._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(AdminPosts, true);
