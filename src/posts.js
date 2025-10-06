const axios = require('axios');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Busca todos os posts
 */
async function getAllPosts() {
  const response = await axios.get(`${BASE_URL}/posts`);
  return response.data;
}

/**
 * Busca post por ID
 */
async function getPostById(id) {
  const response = await axios.get(`${BASE_URL}/posts/${id}`);
  return response.data;
}

/**
 * Filtra posts por userId
 */
function filterPostsByUser(posts, userId) {
  if (!Array.isArray(posts)) {
    return [];
  }
  return posts.filter(post => post.userId === userId);
}

/**
 * Cria objeto de post fake
 */
function createFakePost(userId, title, body) {
  if (!userId || !title || !body) {
    throw new Error('Todos os campos são obrigatórios');
  }
  return {
    userId: userId,
    id: Math.floor(Math.random() * 10000),
    title: title,
    body: body
  };
}

/**
 * Valida estrutura do post
 */
function validatePost(post) {
  const requiredFields = ['userId', 'id', 'title', 'body'];
  return requiredFields.every(field => post.hasOwnProperty(field));
}

/**
 * Calcula tamanho médio dos títulos
 */
function averageTitleLength(posts) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return 0;
  }
  const totalLength = posts.reduce((sum, post) => sum + post.title.length, 0);
  return totalLength / posts.length;
}

module.exports = {
  getAllPosts,
  getPostById,
  filterPostsByUser,
  createFakePost,
  validatePost,
  averageTitleLength
};