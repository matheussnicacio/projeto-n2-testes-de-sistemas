

module.exports = {
    // Gera um ID aleatório entre 1 e 100
    generateRandomId,
    
    // Gera um userId aleatório entre 1 e 10
    generateRandomUserId,
    
    // Valida se a resposta contém dados válidos
    validateResponse,
    
    // Valida estrutura de Posts
    validatePostStructure,
    
    // Valida estrutura de Users
    validateUserStructure,
    
    // Valida estrutura de Comments
    validateCommentStructure,
    
    // Valida estrutura de Todos
    validateTodoStructure,
    
    // Valida estrutura de Albums
    validateAlbumStructure,
    
    // Adiciona delay variável (simula comportamento humano)
    addRandomThink,
    
    // Log personalizado de métricas
    logCustomMetrics,
    
    // Valida tempo de resposta
    validateResponseTime
  };
  

  function generateRandomId(context, events, done) {
    context.vars.randomId = Math.floor(Math.random() * 100) + 1;
    return done();
  }
  
  /**
   * Gera um userId aleatório entre 1 e 10
   */
  function generateRandomUserId(context, events, done) {
    context.vars.randomUserId = Math.floor(Math.random() * 10) + 1;
    return done();
  }
  

  function validateResponse(context, events, done) {
    const response = context.vars.response;
    
    if (!response) {
      console.error('❌ Resposta vazia ou indefinida');
      return done(new Error('Empty response'));
    }
    
    if (typeof response === 'object' && Object.keys(response).length === 0) {
      console.error('❌ Resposta é um objeto vazio');
      return done(new Error('Empty object response'));
    }
    
    if (Array.isArray(response) && response.length === 0) {
      console.error('⚠️ Array vazio retornado');
    }
    
    console.log('✅ Resposta válida recebida');
    return done();
  }
  
  function validatePostStructure(context, events, done) {
    const post = context.vars.response;
    
    if (!post) {
      return done(new Error('No post data'));
    }
    
    const requiredFields = ['id', 'userId', 'title', 'body'];
    const missingFields = requiredFields.filter(field => !(field in post));
    
    if (missingFields.length > 0) {
      console.error(`❌ Post missing fields: ${missingFields.join(', ')}`);
      return done(new Error(`Missing fields: ${missingFields.join(', ')}`));
    }
    
    if (typeof post.id !== 'number') {
      return done(new Error('Post ID must be a number'));
    }
    
    if (typeof post.userId !== 'number') {
      return done(new Error('Post userId must be a number'));
    }
    
    if (typeof post.title !== 'string' || post.title.trim() === '') {
      return done(new Error('Post title must be a non-empty string'));
    }
    
    if (typeof post.body !== 'string' || post.body.trim() === '') {
      return done(new Error('Post body must be a non-empty string'));
    }
    
    console.log(`✅ Post #${post.id} structure validated`);
    return done();
  }
 
  function validateUserStructure(context, events, done) {
    const user = context.vars.response;
    
    if (!user) {
      return done(new Error('No user data'));
    }
    
    const requiredFields = ['id', 'name', 'username', 'email'];
    const missingFields = requiredFields.filter(field => !(field in user));
    
    if (missingFields.length > 0) {
      console.error(`❌ User missing fields: ${missingFields.join(', ')}`);
      return done(new Error(`Missing fields: ${missingFields.join(', ')}`));
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return done(new Error('Invalid email format'));
    }
    
    console.log(`✅ User #${user.id} (${user.username}) structure validated`);
    return done();
  }
  
  function validateCommentStructure(context, events, done) {
    const comment = context.vars.response;
    
    if (!comment) {
      return done(new Error('No comment data'));
    }
    
    const requiredFields = ['id', 'postId', 'name', 'email', 'body'];
    const missingFields = requiredFields.filter(field => !(field in comment));
    
    if (missingFields.length > 0) {
      console.error(`❌ Comment missing fields: ${missingFields.join(', ')}`);
      return done(new Error(`Missing fields: ${missingFields.join(', ')}`));
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(comment.email)) {
      return done(new Error('Invalid email format in comment'));
    }
    
    console.log(`✅ Comment #${comment.id} for Post #${comment.postId} validated`);
    return done();
  }
  
  function validateTodoStructure(context, events, done) {
    const todo = context.vars.response;
    
    if (!todo) {
      return done(new Error('No todo data'));
    }
    
    const requiredFields = ['id', 'userId', 'title', 'completed'];
    const missingFields = requiredFields.filter(field => !(field in todo));
    
    if (missingFields.length > 0) {
      console.error(`❌ Todo missing fields: ${missingFields.join(', ')}`);
      return done(new Error(`Missing fields: ${missingFields.join(', ')}`));
    }
    
    // Validação de tipo boolean para completed
    if (typeof todo.completed !== 'boolean') {
      return done(new Error('Todo completed must be a boolean'));
    }
    
    console.log(`✅ Todo #${todo.id} (${todo.completed ? 'completed' : 'pending'}) validated`);
    return done();
  }
  
  function validateAlbumStructure(context, events, done) {
    const album = context.vars.response;
    
    if (!album) {
      return done(new Error('No album data'));
    }
    
    const requiredFields = ['id', 'userId', 'title'];
    const missingFields = requiredFields.filter(field => !(field in album));
    
    if (missingFields.length > 0) {
      console.error(`❌ Album missing fields: ${missingFields.join(', ')}`);
      return done(new Error(`Missing fields: ${missingFields.join(', ')}`));
    }
    
    console.log(`✅ Album #${album.id} structure validated`);
    return done();
  }
  
  function addRandomThink(context, events, done) {
    const thinkTime = Math.floor(Math.random() * 3) + 1;
    context.vars.thinkTime = thinkTime;
    
    setTimeout(() => {
      console.log(`⏱️ Think time: ${thinkTime}s`);
      return done();
    }, thinkTime * 1000);
  }
  
  function logCustomMetrics(context, events, done) {
    const startTime = Date.now();
    
    events.on('response', (params) => {
      const endTime = Date.now();
      const latency = endTime - startTime;
      const statusCode = params.statusCode;
      const url = params.url;
      
      console.log(`
  📊 Custom Metrics:
     URL: ${url}
     Status: ${statusCode}
     Latency: ${latency}ms
     Timestamp: ${new Date().toISOString()}
      `);
      
      // Alerta se latência > 1000ms
      if (latency > 1000) {
        console.warn(`⚠️ HIGH LATENCY DETECTED: ${latency}ms on ${url}`);
      }
      
      // Alerta se erro
      if (statusCode >= 400) {
        console.error(`❌ ERROR RESPONSE: ${statusCode} on ${url}`);
      }
    });
    
    return done();
  }
  
  /**
   * Valida se o tempo de resposta está dentro do aceitável
   * @param {number} maxLatency -
   */
  function validateResponseTime(maxLatency = 2000) {
    return function(context, events, done) {
      const startTime = Date.now();
      
      events.on('response', (params) => {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        if (latency > maxLatency) {
          console.error(`❌ Response time exceeded: ${latency}ms (max: ${maxLatency}ms)`);
          return done(new Error(`Response time ${latency}ms exceeds maximum ${maxLatency}ms`));
        }
        
        console.log(`✅ Response time OK: ${latency}ms`);
        return done();
      });
    };
  }
  
  // Função auxiliar para gerar dados de exemplo (útil para testes POST/PUT)
  function generateMockPost(context, events, done) {
    context.vars.newPost = {
      userId: Math.floor(Math.random() * 10) + 1,
      title: `Test Post ${Date.now()}`,
      body: `This is a test post created at ${new Date().toISOString()}`
    };
    return done();
  }
  
  // Função auxiliar para gerar dados de comentário
  function generateMockComment(context, events, done) {
    context.vars.newComment = {
      postId: Math.floor(Math.random() * 100) + 1,
      name: 'Test Comment',
      email: 'test@example.com',
      body: `Test comment created at ${new Date().toISOString()}`
    };
    return done();
  }
  
  // Exportar funções auxiliares também
  module.exports.generateMockPost = generateMockPost;
  module.exports.generateMockComment = generateMockComment;