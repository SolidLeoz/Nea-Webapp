const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Si è verificato un errore');
  }
  return response.json();
};

export const fetchPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  return handleResponse(response);
};

export const createPost = async (postData) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(postData),
  });
  return handleResponse(response);
};

export const updatePost = async (id, postData) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(postData),
  });
  return handleResponse(response);
};

export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

export const verifyAdmin = async () => {
  const token = getToken();
  if (!token) {
    return false;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-admin`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await handleResponse(response);
    return data.isAdmin;
  } catch (error) {
    console.error('Errore nella verifica del ruolo admin:', error);
    return false;
  }
};
