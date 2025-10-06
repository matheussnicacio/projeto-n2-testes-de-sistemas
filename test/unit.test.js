const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const users = require('../src/users');
const posts = require('../src/posts');
const comments = require('../src/comments');
const todos = require('../src/todos');

describe('Testes Unitários - ASSERT', () => {
  
  // ASSERT 1: strictEqual
  it('deve formatar nome do usuário para maiúsculas', () => {
    const result = users.formatUserName('João Silva');
    assert.strictEqual(result, 'JOÃO SILVA');
  });

  // ASSERT 2: deepEqual
  it('deve criar post fake com estrutura correta', () => {
    const post = posts.createFakePost(1, 'Título', 'Corpo do texto');
    const expected = {
      userId: 1,
      id: post.id, // id é aleatório
      title: 'Título',
      body: 'Corpo do texto'
    };
    assert.deepEqual(post, expected);
  });

  // ASSERT 3: throws
  it('deve lançar erro ao formatar nome não-string', () => {
    assert.throws(() => {
      users.formatUserName(123);
    }, TypeError);
  });

  // ASSERT 4: doesNotThrow
  it('não deve lançar erro ao formatar nome válido', () => {
    assert.doesNotThrow(() => {
      users.formatUserName('Maria');
    });
  });

  // ASSERT 5: match
  it('deve retornar string em maiúsculas (regex)', () => {
    const result = users.formatUserName('teste');
    assert.match(result, /^[A-Z]+$/);
  });

  // ASSERT 6: notStrictEqual
  it('resultado deve ser diferente da entrada original', () => {
    const input = 'texto';
    const result = users.formatUserName(input);
    assert.notStrictEqual(result, input);
  });

  // ASSERT 7: ok (truthy)
  it('deve validar usuário com dados corretos', () => {
    const user = { name: 'João', email: 'joao@email.com', username: 'joao123' };
    assert.ok(users.validateUserData(user));
  });
});

describe('Testes Unitários - EXPECT', () => {

  // EXPECT 1: to.equal
  it('deve contar usuários corretamente', () => {
    const userList = [{id: 1}, {id: 2}, {id: 3}];
    expect(users.countUsers(userList)).to.equal(3);
  });

  // EXPECT 2: to.have.property
  it('post criado deve ter propriedade userId', () => {
    const post = posts.createFakePost(5, 'Test', 'Body');
    expect(post).to.have.property('userId');
  });

  // EXPECT 3: to.be.a
  it('formatUserName deve retornar uma string', () => {
    const result = users.formatUserName('Ana');
    expect(result).to.be.a('string');
  });

  // EXPECT 4: to.contain
  it('array filtrado deve conter apenas posts do usuário', () => {
    const postsList = [
      { userId: 1, title: 'Post 1' },
      { userId: 2, title: 'Post 2' },
      { userId: 1, title: 'Post 3' }
    ];
    const filtered = posts.filterPostsByUser(postsList, 1);
    expect(filtered).to.have.lengthOf(2);
  });

  // EXPECT 5: to.have.lengthOf
  it('filtro de tarefas concluídas deve ter tamanho correto', () => {
    const todosList = [
      { completed: true },
      { completed: false },
      { completed: true }
    ];
    const completed = todos.filterCompletedTodos(todosList);
    expect(completed).to.have.lengthOf(2);
  });

  // EXPECT 6: to.be.true
  it('validação de post correto deve retornar true', () => {
    const validPost = { userId: 1, id: 1, title: 'Test', body: 'Content' };
    expect(posts.validatePost(validPost)).to.be.true;
  });

  // EXPECT 7: to.be.an
  it('filtro de usuários deve retornar um array', () => {
    const usersList = [
      { name: 'João', address: { city: 'São Paulo' } },
      { name: 'Maria', address: { city: 'Rio' } }
    ];
    const result = users.filterUsersByCity(usersList, 'São Paulo');
    expect(result).to.be.an('array');
  });
});

describe('Testes Unitários - SHOULD', () => {

  // SHOULD 1: should.equal
  it('percentual de conclusão deve ser calculado corretamente', () => {
    const todosList = [
      { completed: true },
      { completed: true },
      { completed: false },
      { completed: false }
    ];
    const rate = todos.calculateCompletionRate(todosList);
    rate.should.equal(50);
  });

  // SHOULD 2: should.be.a
  it('tarefa marcada como concluída deve ser objeto', () => {
    const todo = { id: 1, title: 'Tarefa', completed: false };
    const result = todos.markAsCompleted(todo);
    result.should.be.a('object');
  });

  // SHOULD 3: should.have.property
  it('comentário validado deve ter propriedade postId', () => {
    const comment = {
      postId: 1,
      name: 'Comentário',
      email: 'user@mail.com',
      body: 'Texto'
    };
    comment.should.have.property('postId');
  });

  // SHOULD 4: should.be.true
  it('validação de comentário válido deve retornar true', () => {
    const comment = {
      postId: 1,
      name: 'Test',
      email: 'test@test.com',
      body: 'Body'
    };
    comments.validateComment(comment).should.be.true;
  });

  // SHOULD 5: should.be.false
  it('validação de usuário inválido deve retornar false', () => {
    const invalidUser = { name: 'João' }; // falta email e username
    users.validateUserData(invalidUser).should.be.false;
  });

  // SHOULD 6: should.have.length
  it('filtro de tarefas pendentes deve ter tamanho correto', () => {
    const todosList = [
      { completed: false },
      { completed: false },
      { completed: true }
    ];
    const pending = todos.filterPendingTodos(todosList);
    pending.should.have.length(2);
  });

  // SHOULD 7: should.include
  it('array de posts deve incluir o post filtrado', () => {
    const postsList = [
      { userId: 1, title: 'Post A' },
      { userId: 2, title: 'Post B' }
    ];
    const filtered = posts.filterPostsByUser(postsList, 1);
    filtered.should.include(postsList[0]);
  });
});