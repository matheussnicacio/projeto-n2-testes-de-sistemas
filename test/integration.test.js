const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

// IMPORTANTE: Substitua 'seu-usuario' pelo seu usuário do GitHub
// Você precisa criar um repositório com arquivo db.json
const BASE_URL = 'https://my-json-server.typicode.com/GustavoABarbosa/n2-json-server';

/*
  INSTRUÇÕES PARA NOTA 9:
  
  1. Crie um repositório público no GitHub (ex: "n2-json-server")
  
  2. Crie um arquivo db.json na raiz com este conteúdo de exemplo:
  
  {
    "users": [
      { "id": 1, "name": "João Silva", "email": "joao@email.com" },
      { "id": 2, "name": "Maria Santos", "email": "maria@email.com" }
    ],
    "posts": [
      { "id": 1, "userId": 1, "title": "Primeiro Post", "content": "Conteúdo" },
      { "id": 2, "userId": 2, "title": "Segundo Post", "content": "Mais conteúdo" }
    ],
    "comments": [
      { "id": 1, "postId": 1, "text": "Ótimo post!" },
      { "id": 2, "postId": 1, "text": "Muito bom!" }
    ]
  }
  
  3. Atualize a constante BASE_URL acima com:
     'https://my-json-server.typicode.com/SEU-USUARIO/SEU-REPO'
  
  4. Execute os testes: npm test
*/

describe('Testes de Integração - My JSON Server', () => {

  // ========== TESTES DE USERS ==========
  
  describe('GET /users - My JSON Server', () => {
    it('deve retornar usuários do db.json customizado', (done) => {
      chai.request(BASE_URL)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(1);
          
          // Verifica estrutura do primeiro usuário
          if (res.body.length > 0) {
            expect(res.body[0]).to.have.property('id');
            expect(res.body[0]).to.have.property('name');
          }
          done();
        });
    });

    it('deve retornar usuário específico por ID', (done) => {
      chai.request(BASE_URL)
        .get('/users/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id');
          done();
        });
    });

    it('deve validar estrutura completa do usuário', (done) => {
      chai.request(BASE_URL)
        .get('/users/1')
        .end((err, res) => {
          const user = res.body;
          expect(user).to.include.keys('id', 'name', 'email');
          expect(user.id).to.be.a('number');
          expect(user.name).to.be.a('string');
          expect(user.email).to.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
          done();
        });
    });
  });

  // ========== TESTES DE POSTS ==========

  describe('GET /posts - My JSON Server', () => {
    it('deve retornar posts do banco customizado', (done) => {
      chai.request(BASE_URL)
        .get('/posts')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          
          if (res.body.length > 0) {
            expect(res.body[0]).to.have.property('userId');
            expect(res.body[0]).to.have.property('title');
          }
          done();
        });
    });

    it('deve retornar post por ID', (done) => {
      chai.request(BASE_URL)
        .get('/posts/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.id).to.equal(1);
          done();
        });
    });

    it('deve filtrar posts por userId', (done) => {
      chai.request(BASE_URL)
        .get('/posts?userId=1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          
          // Verifica se todos os posts retornados são do userId 1
          res.body.forEach(post => {
            expect(post.userId).to.equal(1);
          });
          done();
        });
    });
  });

  // ========== TESTES DE COMMENTS ==========

  describe('GET /comments - My JSON Server', () => {
    it('deve retornar comentários customizados', (done) => {
      chai.request(BASE_URL)
        .get('/comments')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('deve filtrar comentários por postId', (done) => {
      chai.request(BASE_URL)
        .get('/comments?postId=1')
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

  // ========== TESTES DE INTEGRAÇÃO ENTRE RECURSOS ==========

  describe('Integração entre Users e Posts', () => {
    it('deve buscar usuário e seus posts relacionados', (done) => {
      let userId;
      
      // Primeiro busca o usuário
      chai.request(BASE_URL)
        .get('/users/1')
        .end((err, userRes) => {
          expect(userRes).to.have.status(200);
          userId = userRes.body.id;
          
          // Depois busca os posts desse usuário
          chai.request(BASE_URL)
            .get(`/posts?userId=${userId}`)
            .end((err, postsRes) => {
              expect(postsRes).to.have.status(200);
              expect(postsRes.body).to.be.an('array');
              
              // Verifica que todos os posts são do usuário correto
              postsRes.body.forEach(post => {
                expect(post.userId).to.equal(userId);
              });
              done();
            });
        });
    });
  });

  describe('Integração entre Posts e Comments', () => {
    it('deve buscar post e seus comentários relacionados', (done) => {
      let postId;
      
      // Primeiro busca o post
      chai.request(BASE_URL)
        .get('/posts/1')
        .end((err, postRes) => {
          expect(postRes).to.have.status(200);
          postId = postRes.body.id;
          
          // Depois busca os comentários desse post
          chai.request(BASE_URL)
            .get(`/comments?postId=${postId}`)
            .end((err, commentsRes) => {
              expect(commentsRes).to.have.status(200);
              expect(commentsRes.body).to.be.an('array');
              
              // Verifica que todos os comentários são do post correto
              commentsRes.body.forEach(comment => {
                expect(comment.postId).to.equal(postId);
              });
              done();
            });
        });
    });
  });

  describe('Integração completa: User -> Posts -> Comments', () => {
    it('deve navegar por toda a hierarquia de dados', (done) => {
      // 1. Busca usuário
      chai.request(BASE_URL)
        .get('/users/1')
        .end((err, userRes) => {
          expect(userRes).to.have.status(200);
          const userId = userRes.body.id;
          
          // 2. Busca posts do usuário
          chai.request(BASE_URL)
            .get(`/posts?userId=${userId}`)
            .end((err, postsRes) => {
              expect(postsRes).to.have.status(200);
              
              if (postsRes.body.length > 0) {
                const firstPostId = postsRes.body[0].id;
                
                // 3. Busca comentários do primeiro post
                chai.request(BASE_URL)
                  .get(`/comments?postId=${firstPostId}`)
                  .end((err, commentsRes) => {
                    expect(commentsRes).to.have.status(200);
                    expect(commentsRes.body).to.be.an('array');
                    done();
                  });
              } else {
                done();
              }
            });
        });
    });
  });

  // ========== TESTES DE VALIDAÇÃO DE DADOS ==========

  describe('Validação de consistência dos dados', () => {
    it('todos os posts devem ter userId válido', (done) => {
      let validUserIds = [];
      
      // Primeiro busca todos os IDs de usuários válidos
      chai.request(BASE_URL)
        .get('/users')
        .end((err, usersRes) => {
          validUserIds = usersRes.body.map(user => user.id);
          
          // Depois verifica se todos os posts têm userId válido
          chai.request(BASE_URL)
            .get('/posts')
            .end((err, postsRes) => {
              postsRes.body.forEach(post => {
                expect(validUserIds).to.include(post.userId);
              });
              done();
            });
        });
    });

    it('todos os comentários devem ter postId válido', (done) => {
      let validPostIds = [];
      
      chai.request(BASE_URL)
        .get('/posts')
        .end((err, postsRes) => {
          validPostIds = postsRes.body.map(post => post.id);
          
          chai.request(BASE_URL)
            .get('/comments')
            .end((err, commentsRes) => {
              commentsRes.body.forEach(comment => {
                expect(validPostIds).to.include(comment.postId);
              });
              done();
            });
        });
    });
  });
});