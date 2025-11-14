const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Middleware para servir arquivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Dados mockados COMPLETOS
const mockData = {
  users: [
    { 
      id: 1, 
      name: 'João Silva', 
      email: 'joao@email.com', 
      username: 'joao123',
      phone: '(11) 98765-4321',
      website: 'joao.com.br',
      company: { name: 'Tech Corp' },
      address: { city: 'São Paulo' } 
    },
    { 
      id: 2, 
      name: 'Maria Santos', 
      email: 'maria@email.com', 
      username: 'maria456',
      phone: '(21) 97654-3210',
      website: 'maria.com.br',
      company: { name: 'Design Studio' },
      address: { city: 'Rio de Janeiro' } 
    },
    { 
      id: 3, 
      name: 'Pedro Costa', 
      email: 'pedro@email.com', 
      username: 'pedro789',
      phone: '(31) 96543-2109',
      website: 'pedro.com.br',
      company: { name: 'Dev Solutions' },
      address: { city: 'Belo Horizonte' } 
    }
  ],
  posts: [
    { userId: 1, id: 1, title: 'Primeiro Post', body: 'Conteúdo do primeiro post' },
    { userId: 1, id: 2, title: 'Segundo Post', body: 'Conteúdo do segundo post' },
    { userId: 2, id: 3, title: 'Post da Maria', body: 'Conteúdo do post da Maria' },
    { userId: 3, id: 4, title: 'Post do Pedro', body: 'Conteúdo do post do Pedro' }
  ],
  comments: [
    { postId: 1, id: 1, name: 'Ótimo post!', email: 'user1@email.com', body: 'Muito interessante!' },
    { postId: 1, id: 2, name: 'Concordo', email: 'user2@email.com', body: 'Excelente conteúdo' },
    { postId: 2, id: 3, name: 'Legal', email: 'user3@email.com', body: 'Gostei muito' }
  ],
  todos: [
    { userId: 1, id: 1, title: 'Fazer compras', completed: false },
    { userId: 1, id: 2, title: 'Estudar Node.js', completed: true },
    { userId: 2, id: 3, title: 'Fazer exercícios', completed: false },
    { userId: 3, id: 4, title: 'Ler livro', completed: true }
  ],
  albums: [
    { userId: 1, id: 1, title: 'Álbum de Viagem' },
    { userId: 1, id: 2, title: 'Álbum de Família' },
    { userId: 2, id: 3, title: 'Fotos de Eventos' }
  ]
};

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotas de Users
app.get('/users', (req, res) => {
  res.json(mockData.users);
});

app.get('/users/:id', (req, res) => {
  const user = mockData.users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

// Rotas de Posts
app.get('/posts', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const posts = mockData.posts.filter(p => p.userId === parseInt(userId));
    res.json(posts);
  } else {
    res.json(mockData.posts);
  }
});

app.get('/posts/:id', (req, res) => {
  const post = mockData.posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post não encontrado' });
  }
});

// Rotas de Comments
app.get('/comments', (req, res) => {
  const { postId } = req.query;
  if (postId) {
    const comments = mockData.comments.filter(c => c.postId === parseInt(postId));
    res.json(comments);
  } else {
    res.json(mockData.comments);
  }
});

app.get('/posts/:id/comments', (req, res) => {
  const comments = mockData.comments.filter(c => c.postId === parseInt(req.params.id));
  res.json(comments);
});

// Rotas de Todos
app.get('/todos', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const todos = mockData.todos.filter(t => t.userId === parseInt(userId));
    res.json(todos);
  } else {
    res.json(mockData.todos);
  }
});

app.get('/todos/:id', (req, res) => {
  const todo = mockData.todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo não encontrado' });
  }
});

// Rotas de Albums
app.get('/albums', (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const albums = mockData.albums.filter(a => a.userId === parseInt(userId));
    res.json(albums);
  } else {
    res.json(mockData.albums);
  }
});

app.get('/albums/:id', (req, res) => {
  const album = mockData.albums.find(a => a.id === parseInt(req.params.id));
  if (album) {
    res.json(album);
  } else {
    res.status(404).json({ error: 'Álbum não encontrado' });
  }
});

// Rota inexistente para testes de erro
app.get('/error', (req, res) => {
  res.status(500).json({ error: 'Erro simulado' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;