const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('Testes de API - JSONPlaceholder (NOTA 8)', () => {

  // ========== TESTES DE USERS ==========
  
  describe('GET /users', () => {
    it('deve retornar lista de usuários', (done) => {
      chai.request(BASE_URL)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(10);
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('email');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('deve retornar usuário específico por ID', (done) => {
      chai.request(BASE_URL)
        .get('/users/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal(1);
          expect(res.body).to.have.property('username');
          done();
        });
    });

    it('deve retornar objeto vazio para ID inexistente', (done) => {
      chai.request(BASE_URL)
        .get('/users/999')
        .end((err, res) => {
          // JSONPlaceholder retorna 404 para IDs inexistentes
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // ========== TESTES DE POSTS ==========

  describe('GET /posts', () => {
    it('deve retornar todos os posts', (done) => {
      chai.request(BASE_URL)
        .get('/posts')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(100);
          expect(res.body[0]).to.have.all.keys('userId', 'id', 'title', 'body');
          done();
        });
    });
  });

  describe('GET /posts/:id', () => {
    it('deve retornar post específico', (done) => {
      chai.request(BASE_URL)
        .get('/posts/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(1);
          expect(res.body.title).to.be.a('string');
          expect(res.body.body).to.be.a('string');
          done();
        });
    });
  });

  describe('GET /posts?userId=:id', () => {
    it('deve retornar posts de um usuário específico', (done) => {
      chai.request(BASE_URL)
        .get('/posts?userId=1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(post => {
            expect(post.userId).to.equal(1);
          });
          done();
        });
    });
  });

  describe('POST /posts', () => {
    it('deve criar um novo post', (done) => {
      const newPost = {
        title: 'Novo Post de Teste',
        body: 'Este é o corpo do post',
        userId: 1
      };

      chai.request(BASE_URL)
        .post('/posts')
        .send(newPost)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body.title).to.equal(newPost.title);
          expect(res.body.body).to.equal(newPost.body);
          done();
        });
    });
  });

  describe('PUT /posts/:id', () => {
    it('deve atualizar um post existente', (done) => {
      const updatedPost = {
        id: 1,
        title: 'Título Atualizado',
        body: 'Corpo atualizado',
        userId: 1
      };

      chai.request(BASE_URL)
        .put('/posts/1')
        .send(updatedPost)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.title).to.equal(updatedPost.title);
          done();
        });
    });
  });

  describe('PATCH /posts/:id', () => {
    it('deve atualizar parcialmente um post', (done) => {
      chai.request(BASE_URL)
        .patch('/posts/1')
        .send({ title: 'Apenas título modificado' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.title).to.equal('Apenas título modificado');
          expect(res.body).to.have.property('body');
          done();
        });
    });
  });

  describe('DELETE /posts/:id', () => {
    it('deve deletar um post', (done) => {
      chai.request(BASE_URL)
        .delete('/posts/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  // ========== TESTES DE COMMENTS ==========

  describe('GET /comments', () => {
    it('deve retornar todos os comentários', (done) => {
      chai.request(BASE_URL)
        .get('/comments')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('postId');
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('email');
          done();
        });
    });
  });

  describe('GET /posts/:id/comments', () => {
    it('deve retornar comentários de um post específico', (done) => {
      chai.request(BASE_URL)
        .get('/posts/1/comments')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(comment => {
            expect(comment.postId).to.equal(1);
          });
          done();
        });
    });
  });

  describe('GET /comments?postId=:id', () => {
    it('deve filtrar comentários por postId', (done) => {
      chai.request(BASE_URL)
        .get('/comments?postId=1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          res.body.forEach(comment => {
            expect(comment.postId).to.equal(1);
          });
          done();
        });
    });
  });

  // ========== TESTES DE ALBUMS ==========

  describe('GET /albums', () => {
    it('deve retornar todos os álbuns', (done) => {
      chai.request(BASE_URL)
        .get('/albums')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('userId');
          expect(res.body[0]).to.have.property('title');
          done();
        });
    });
  });

  describe('GET /albums/:id', () => {
    it('deve retornar álbum específico', (done) => {
      chai.request(BASE_URL)
        .get('/albums/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(1);
          done();
        });
    });
  });

  describe('GET /users/:id/albums', () => {
    it('deve retornar álbuns de um usuário', (done) => {
      chai.request(BASE_URL)
        .get('/users/1/albums')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(album => {
            expect(album.userId).to.equal(1);
          });
          done();
        });
    });
  });

  // ========== TESTES DE PHOTOS ==========

  describe('GET /photos', () => {
    it('deve retornar todas as fotos', (done) => {
      chai.request(BASE_URL)
        .get('/photos')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('albumId');
          expect(res.body[0]).to.have.property('url');
          expect(res.body[0]).to.have.property('thumbnailUrl');
          done();
        });
    });
  });

  describe('GET /albums/:id/photos', () => {
    it('deve retornar fotos de um álbum específico', (done) => {
      chai.request(BASE_URL)
        .get('/albums/1/photos')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(photo => {
            expect(photo.albumId).to.equal(1);
          });
          done();
        });
    });
  });

  // ========== TESTES DE TODOS ==========

  describe('GET /todos', () => {
    it('deve retornar todas as tarefas', (done) => {
      chai.request(BASE_URL)
        .get('/todos')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('userId');
          expect(res.body[0]).to.have.property('title');
          expect(res.body[0]).to.have.property('completed');
          done();
        });
    });
  });

  describe('GET /todos/:id', () => {
    it('deve retornar tarefa específica', (done) => {
      chai.request(BASE_URL)
        .get('/todos/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(1);
          expect(res.body.completed).to.be.a('boolean');
          done();
        });
    });
  });

  describe('GET /users/:id/todos', () => {
    it('deve retornar tarefas de um usuário', (done) => {
      chai.request(BASE_URL)
        .get('/users/1/todos')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          res.body.forEach(todo => {
            expect(todo.userId).to.equal(1);
          });
          done();
        });
    });
  });

});