const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');

const users = require('../src/users');
const posts = require('../src/posts');
const comments = require('../src/comments');
const todos = require('../src/todos');

describe('Testes Mockados/Stubados com Sinon', () => {

  afterEach(() => {
    sinon.restore();
  });

  // MOCK 1: Stub de getAllUsers
  it('deve buscar todos os usuários (stub)', async () => {
    const fakeUsers = [
      { id: 1, name: 'João', email: 'joao@email.com' },
      { id: 2, name: 'Maria', email: 'maria@email.com' }
    ];

    const stub = sinon.stub(axios, 'get').resolves({ data: fakeUsers });

    const result = await users.getAllUsers();

    expect(result).to.deep.equal(fakeUsers);
    expect(stub.calledOnce).to.be.true;
    expect(stub.firstCall.args[0]).to.include('/users');
  });

  // MOCK 2: Stub de getUserById
  it('deve buscar usuário por ID (stub)', async () => {
    const fakeUser = { 
      id: 1, 
      name: 'João Silva', 
      email: 'joao@email.com',
      username: 'joao123'
    };

    sinon.stub(axios, 'get').resolves({ data: fakeUser });

    const result = await users.getUserById(1);

    expect(result).to.have.property('id', 1);
    expect(result.name).to.equal('João Silva');
  });

  // MOCK 3: Stub de getAllPosts
  it('deve buscar todos os posts (stub)', async () => {
    const fakePosts = [
      { userId: 1, id: 1, title: 'Post 1', body: 'Conteúdo 1' },
      { userId: 1, id: 2, title: 'Post 2', body: 'Conteúdo 2' },
      { userId: 2, id: 3, title: 'Post 3', body: 'Conteúdo 3' }
    ];

    sinon.stub(axios, 'get').resolves({ data: fakePosts });

    const result = await posts.getAllPosts();

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(3);
    expect(result[0]).to.have.property('title');
  });

  // MOCK 4: Stub de getPostById
  it('deve buscar post por ID (stub)', async () => {
    const fakePost = {
      userId: 1,
      id: 5,
      title: 'Título do Post',
      body: 'Corpo do post'
    };

    sinon.stub(axios, 'get').resolves({ data: fakePost });

    const result = await posts.getPostById(5);

    expect(result.id).to.equal(5);
    expect(result).to.have.property('title');
    expect(result).to.have.property('body');
  });

  // MOCK 5: Stub de getCommentsByPost
  it('deve buscar comentários de um post (stub)', async () => {
    const fakeComments = [
      {
        postId: 1,
        id: 1,
        name: 'Comentário 1',
        email: 'user1@example.com',
        body: 'Texto do comentário 1'
      },
      {
        postId: 1,
        id: 2,
        name: 'Comentário 2',
        email: 'user2@example.com',
        body: 'Texto do comentário 2'
      }
    ];

    sinon.stub(axios, 'get').resolves({ data: fakeComments });

    const result = await comments.getCommentsByPost(1);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(2);
    expect(result[0].postId).to.equal(1);
  });

  // MOCK 6: Stub de getAllTodos
  it('deve buscar todas as tarefas (stub)', async () => {
    const fakeTodos = [
      { userId: 1, id: 1, title: 'Tarefa 1', completed: false },
      { userId: 1, id: 2, title: 'Tarefa 2', completed: true },
      { userId: 2, id: 3, title: 'Tarefa 3', completed: false }
    ];

    sinon.stub(axios, 'get').resolves({ data: fakeTodos });

    const result = await todos.getAllTodos();

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(3);
  });

  // MOCK 7: Verificando chamada do stub
  it('deve verificar que axios.get foi chamado corretamente', async () => {
    const stub = sinon.stub(axios, 'get').resolves({ 
      data: [{ id: 1, name: 'Test' }] 
    });

    await users.getAllUsers();

    expect(stub.calledOnce).to.be.true;
    expect(stub.calledWith('https://jsonplaceholder.typicode.com/users')).to.be.true;
  });

  // MOCK 8: Testando erro com stub
  it('deve lançar erro ao buscar usuário com ID inválido', async () => {
    try {
      await users.getUserById(null);
      expect.fail('Deveria ter lançado erro');
    } catch (error) {
      expect(error.message).to.equal('ID inválido');
    }
  });
});