const axios = require('axios');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Busca todas as tarefas
async function getAllTodos() {
  const response = await axios.get(`${BASE_URL}/todos`);
  return response.data;
}

// Busca tarefa por ID
async function getTodoById(id) {
  const response = await axios.get(`${BASE_URL}/todos/${id}`);
  return response.data;
}

// Marca tarefa como concluída
function markAsCompleted(todo) {
  if (!todo || typeof todo !== 'object') {
    throw new TypeError('Todo deve ser um objeto');
  }
  return { ...todo, completed: true };
}

// Marca tarefa como pendente
function markAsPending(todo) {
  if (!todo || typeof todo !== 'object') {
    throw new TypeError('Todo deve ser um objeto');
  }
  return { ...todo, completed: false };
}

// Filtra tarefas concluídas
function filterCompletedTodos(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  return todos.filter(todo => todo.completed === true);
}

// Filtra tarefas pendentes
function filterPendingTodos(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }
  return todos.filter(todo => todo.completed === false);
}

// Calcula percentual de conclusão
function calculateCompletionRate(todos) {
  if (!Array.isArray(todos) || todos.length === 0) {
    return 0;
  }
  const completed = todos.filter(t => t.completed).length;
  return (completed / todos.length) * 100;
}

// Cria objeto de todo fake
function createFakeTodo(userId, title, completed = false) {
  if (!userId || !title) {
    throw new Error('userId e title são obrigatórios');
  }
  return {
    userId: userId,
    id: Math.floor(Math.random() * 10000),
    title: title,
    completed: completed
  };
}

// Valida estrutura de todo
function validateTodo(todo) {
  return todo &&
    todo.hasOwnProperty('userId') &&
    todo.hasOwnProperty('id') &&
    todo.hasOwnProperty('title') &&
    todo.hasOwnProperty('completed') &&
    typeof todo.completed === 'boolean';
}

module.exports = {
  getAllTodos,
  getTodoById,
  markAsCompleted,
  markAsPending,
  filterCompletedTodos,
  filterPendingTodos,
  calculateCompletionRate,
  createFakeTodo,
  validateTodo
};