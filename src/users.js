const axios = require('axios');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Busca todos os usuários
async function getAllUsers() {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
}

// Busca usuário por ID
async function getUserById(id) {
  if (!id || typeof id !== 'number') {
    throw new Error('ID inválido');
  }
  const response = await axios.get(`${BASE_URL}/users/${id}`);
  return response.data;
}

// Filtra usuários por cidade
function filterUsersByCity(users, city) {
  if (!Array.isArray(users)) {
    throw new TypeError('Primeiro argumento deve ser um array');
  }
  return users.filter(user => user.address && user.address.city === city);
}

// Valida dados do usuário
function validateUserData(user) {
  if (!user || typeof user !== 'object') {
    return false;
  }
  return user.hasOwnProperty('name') && 
         user.hasOwnProperty('email') && 
         user.hasOwnProperty('username');
}

// Formata nome do usuário (uppercase)
function formatUserName(name) {
  if (typeof name !== 'string') {
    throw new TypeError('Nome deve ser uma string');
  }
  return name.toUpperCase();
}

// Conta total de usuários
function countUsers(users) {
  return Array.isArray(users) ? users.length : 0;
}

module.exports = {
  getAllUsers,
  getUserById,
  filterUsersByCity,
  validateUserData,
  formatUserName,
  countUsers
};