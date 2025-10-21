const axios = require('axios');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Busca comentários de um post
async function getCommentsByPost(postId) {
  const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
  return response.data;
}

// Busca todos os comentários
async function getAllComments() {
  const response = await axios.get(`${BASE_URL}/comments`);
  return response.data;
}

// Filtra comentários por email domain
function filterCommentsByEmail(comments, emailDomain) {
  if (!Array.isArray(comments)) {
    return [];
  }
  return comments.filter(comment => comment.email.includes(emailDomain));
}

// Conta comentários de um array
function countComments(comments) {
  return Array.isArray(comments) ? comments.length : 0;
}

// Valida estrutura de comentário
function validateComment(comment) {
  return comment &&
    comment.hasOwnProperty('postId') &&
    comment.hasOwnProperty('name') &&
    comment.hasOwnProperty('email') &&
    comment.hasOwnProperty('body');
}

// Cria objeto de comentário fake
function createFakeComment(postId, name, email, body) {
  if (!postId || !name || !email || !body) {
    throw new Error('Todos os campos são obrigatórios');
  }
  return {
    postId: postId,
    id: Math.floor(Math.random() * 10000),
    name: name,
    email: email,
    body: body
  };
}

module.exports = {
  getCommentsByPost,
  getAllComments,
  filterCommentsByEmail,
  countComments,
  validateComment,
  createFakeComment
};