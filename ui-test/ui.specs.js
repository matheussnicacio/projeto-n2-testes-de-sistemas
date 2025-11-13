const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

// ========================================
// TESTES DA PÁGINA INDEX.HTML
// ========================================

test.describe('Index Page - Homepage Tests', () => {
  test('deve carregar homepage corretamente', async ({ page }) => {
    await page.goto(`${BASE_URL}`);
    await expect(page).toHaveTitle(/N3/);
    await expect(page.locator('h1')).toContainText('Projeto N3');
  });

  test('deve exibir todos os cards de navegação', async ({ page }) => {
    await page.goto(`${BASE_URL}`);
    
    // Verificar presença dos 5 cards
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(5);
    
    // Verificar textos dos cards
    await expect(page.locator('text=Posts')).toBeVisible();
    await expect(page.locator('text=Usuários')).toBeVisible();
    await expect(page.locator('text=Comentários')).toBeVisible();
    await expect(page.locator('text=Tarefas')).toBeVisible();
    await expect(page.locator('text=Álbuns')).toBeVisible();
  });

  test('deve carregar contadores de cada recurso', async ({ page }) => {
    await page.goto(`${BASE_URL}`);
    
    // Aguardar carregamento dos contadores
    await page.waitForTimeout(2000);
    
    // Verificar que contadores não estão mais com "Carregando..."
    const postsCount = await page.locator('#postsCount').textContent();
    const usersCount = await page.locator('#usersCount').textContent();
    
    expect(postsCount).not.toContain('Carregando');
    expect(usersCount).not.toContain('Carregando');
  });

  test('links de navegação devem funcionar', async ({ page }) => {
    await page.goto(`${BASE_URL}`);
    
    // Clicar no card de Posts
    await page.click('a[href="posts.html"]');
    await expect(page).toHaveURL(/posts.html/);
  });
});

// ========================================
// TESTES DA PÁGINA POSTS.HTML
// ========================================

test.describe('Posts Page - UI Tests', () => {
  test('deve carregar página de posts corretamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    await expect(page).toHaveTitle(/Posts/);
    await expect(page.locator('h1')).toContainText('Lista de Posts');
  });

  test('deve exibir lista de posts da API', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    await page.waitForSelector('.post-item', { timeout: 5000 });
    
    const posts = await page.locator('.post-item').count();
    expect(posts).toBeGreaterThan(0);
  });

  test('deve exibir título e corpo do post', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    await page.waitForSelector('.post-item');
    
    const firstPost = page.locator('.post-item').first();
    await expect(firstPost.locator('.post-title')).toBeVisible();
    await expect(firstPost.locator('.post-body')).toBeVisible();
  });

  test('deve ter botão de carregar posts', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    
    const loadButton = page.locator('#loadPosts');
    await expect(loadButton).toBeVisible();
    await expect(loadButton).toHaveText(/Carregar Posts/);
  });

  test('deve filtrar posts por usuário', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    await page.waitForSelector('.post-item');
    
    // Selecionar usuário 1
    await page.selectOption('#userFilter', '1');
    await page.click('#filterBtn');
    await page.waitForTimeout(1000);
    
    // Verificar que posts foram filtrados
    const posts = await page.locator('.post-item').count();
    expect(posts).toBeGreaterThan(0);
    
    // Verificar que todos os posts são do userId 1
    const firstPost = page.locator('.post-item').first();
    const metaText = await firstPost.locator('.post-meta').textContent();
    expect(metaText).toContain('User ID: 1');
  });

  test('botão de carregar deve resetar filtro', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    await page.waitForSelector('.post-item');
    
    // Aplicar filtro
    await page.selectOption('#userFilter', '1');
    await page.click('#filterBtn');
    await page.waitForTimeout(500);
    
    // Clicar em carregar posts
    await page.click('#loadPosts');
    await page.waitForTimeout(500);
    
    // Verificar que filtro foi resetado
    const selectedValue = await page.locator('#userFilter').inputValue();
    expect(selectedValue).toBe('');
  });

  test('deve exibir meta informações do post', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    await page.waitForSelector('.post-item');
    
    const firstPost = page.locator('.post-item').first();
    const meta = firstPost.locator('.post-meta');
    
    await expect(meta).toBeVisible();
    const metaText = await meta.textContent();
    expect(metaText).toMatch(/Post ID: \d+/);
    expect(metaText).toMatch(/User ID: \d+/);
  });
});

// ========================================
// TESTES DA PÁGINA USERS.HTML
// ========================================

test.describe('Users Page - UI Tests', () => {
  test('deve carregar página de usuários corretamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/users.html`);
    await expect(page).toHaveTitle(/Users/);
    await expect(page.locator('h1')).toContainText('Lista de Usuários');
  });

  test('deve exibir lista de usuários da API', async ({ page }) => {
    await page.goto(`${BASE_URL}/users.html`);
    await page.waitForSelector('.user-item', { timeout: 5000 });
    
    const users = await page.locator('.user-item').count();
    expect(users).toBeGreaterThan(0);
  });

  test('deve exibir nome e email do usuário', async ({ page }) => {
    await page.goto(`${BASE_URL}/users.html`);
    await page.waitForSelector('.user-item');
    
    const firstUser = page.locator('.user-item').first();
    await expect(firstUser.locator('.user-name')).toBeVisible();
    await expect(firstUser.locator('.user-email')).toBeVisible();
  });

  test('deve ter campo de busca de usuários', async ({ page }) => {
    await page.goto(`${BASE_URL}/users.html`);
    
    const searchInput = page.locator('#searchUser');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /Buscar/i);
  });

  test('busca deve filtrar usuários por nome', async ({ page }) => {
    await page.goto(`${BASE_URL}/users.html`);
    await page.waitForSelector('.user-item');
    
    // Contar usuários iniciais
    const initialCount = await page.locator('.user-item').count();
    
    // Digitar no campo de busca
    await page.fill('#searchUser', 'João');
    await page.waitForTimeout(500);
    
    // Verificar que lista foi filtrada
    const filteredCount = await page.locator('.user-item').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('busca deve funcionar com email', async ({ page }) => {
    await page.goto(`${BASE_URL}/users.html`);
    await page.waitForSelector('.user-item');
    
    // Buscar por parte do email
    await page.fill('#searchUser', '@email');
    await page.waitForTimeout(500);
    
    // Deve exibir usuários com email
    const users = await page.locator('.user-item').count();
    expect(users).toBeGreaterThan(0);
  });

  test('deve exibir informações completas do usuário', async ({ page }) => {
    await page.goto(`${BASE_URL}/users.html`);
    await page.waitForSelector('.user-item');
    
    const firstUser = page.locator('.user-item').first();
    
    // Verificar elementos
    await expect(firstUser.locator('.user-name')).toBeVisible();
    await expect(firstUser.locator('.user-email')).toBeVisible();
    await expect(firstUser.locator('.user-username')).toBeVisible();
  });
});

// ========================================
// TESTES DA PÁGINA COMMENTS.HTML
// ========================================

test.describe('Comments Page - UI Tests', () => {
  test('deve carregar página de comentários corretamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/comments.html`);
    await expect(page).toHaveTitle(/Comments/);
    await expect(page.locator('h1')).toContainText('Comentários');
  });

  test('deve exibir lista de comentários da API', async ({ page }) => {
    await page.goto(`${BASE_URL}/comments.html`);
    await page.waitForSelector('.comment-item', { timeout: 5000 });
    
    const comments = await page.locator('.comment-item').count();
    expect(comments).toBeGreaterThan(0);
  });

  test('deve exibir nome e email em comentário', async ({ page }) => {
    await page.goto(`${BASE_URL}/comments.html`);
    await page.waitForSelector('.comment-item');
    
    const firstComment = page.locator('.comment-item').first();
    await expect(firstComment.locator('.comment-name')).toBeVisible();
    await expect(firstComment.locator('.comment-email')).toBeVisible();
  });

  test('deve ter dropdown de filtro por post', async ({ page }) => {
    await page.goto(`${BASE_URL}/comments.html`);
    
    const postFilter = page.locator('#postFilter');
    await expect(postFilter).toBeVisible();
    
    // Verificar opções
    const options = await postFilter.locator('option').count();
    expect(options).toBeGreaterThan(1); // Deve ter "Todos" + posts
  });

  test('deve filtrar comentários por post', async ({ page }) => {
    await page.goto(`${BASE_URL}/comments.html`);
    await page.waitForSelector('.comment-item');
    
    // Selecionar post 1
    await page.selectOption('#postFilter', '1');
    await page.click('#filterBtn');
    await page.waitForTimeout(1000);
    
    // Verificar que comentários foram carregados
    const comments = await page.locator('.comment-item').count();
    expect(comments).toBeGreaterThan(0);
  });

  test('deve exibir corpo do comentário', async ({ page }) => {
    await page.goto(`${BASE_URL}/comments.html`);
    await page.waitForSelector('.comment-item');
    
    const firstComment = page.locator('.comment-item').first();
    const body = firstComment.locator('.comment-body');
    
    await expect(body).toBeVisible();
    const bodyText = await body.textContent();
    expect(bodyText.length).toBeGreaterThan(0);
  });
});

// ========================================
// TESTES DA PÁGINA TODOS.HTML
// ========================================

test.describe('Todos Page - UI Tests', () => {
  test('deve carregar página de todos corretamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/todos.html`);
    await expect(page).toHaveTitle(/Todos/);
    await expect(page.locator('h1')).toContainText('Tarefas');
  });

  test('deve exibir lista de tarefas da API', async ({ page }) => {
    await page.goto(`${BASE_URL}/todos.html`);
    await page.waitForSelector('.todo-item', { timeout: 5000 });
    
    const todos = await page.locator('.todo-item').count();
    expect(todos).toBeGreaterThan(0);
  });

  test('deve exibir status de conclusão da tarefa', async ({ page }) => {
    await page.goto(`${BASE_URL}/todos.html`);
    await page.waitForSelector('.todo-item');
    
    const firstTodo = page.locator('.todo-item').first();
    await expect(firstTodo.locator('.todo-status')).toBeVisible();
  });

  test('deve exibir estatísticas de tarefas', async ({ page }) => {
    await page.goto(`${BASE_URL}/todos.html`);
    await page.waitForSelector('.todo-item');
    
    // Verificar cards de estatísticas
    await expect(page.locator('#totalCount')).toBeVisible();
    await expect(page.locator('#completedCount')).toBeVisible();
    await expect(page.locator('#pendingCount')).toBeVisible();
    
    // Verificar que números foram atualizados
    const totalText = await page.locator('#totalCount').textContent();
    expect(parseInt(totalText)).toBeGreaterThan(0);
  });

  test('deve filtrar tarefas concluídas', async ({ page }) => {
    await page.goto(`${BASE_URL}/todos.html`);
    await page.waitForSelector('.todo-item');
    
    // Clicar no filtro de concluídas
    await page.click('button[data-filter="completed"]');
    await page.waitForTimeout(500);
    
    // Verificar que apenas tarefas concluídas são exibidas
    const todos = page.locator('.todo-item');
    const count = await todos.count();
    
    if (count > 0) {
      // Verificar que todas têm classe completed
      for (let i = 0; i < count; i++) {
        const todo = todos.nth(i);
        await expect(todo).toHaveClass(/completed/);
      }
    }
  });

  test('deve filtrar tarefas pendentes', async ({ page }) => {
    await page.goto(`${BASE_URL}/todos.html`);
    await page.waitForSelector('.todo-item');
    
    // Clicar no filtro de pendentes
    await page.click('button[data-filter="pending"]');
    await page.waitForTimeout(500);
    
    // Verificar que apenas tarefas pendentes são exibidas
    const todos = page.locator('.todo-item');
    const count = await todos.count();
    
    if (count > 0) {
      // Verificar que nenhuma tem classe completed
      for (let i = 0; i < count; i++) {
        const todo = todos.nth(i);
        const hasCompleted = await todo.evaluate(el => 
          el.classList.contains('completed')
        );
        expect(hasCompleted).toBe(false);
      }
    }
  });

  test('deve destacar filtro ativo', async ({ page }) => {
    await page.goto(`${BASE_URL}/todos.html`);
    
    // Verificar que "Todas" está ativo inicialmente
    const allButton = page.locator('button[data-filter="all"]');
    await expect(allButton).toHaveClass(/active/);
    
    // Clicar em "Concluídas"
    const completedButton = page.locator('button[data-filter="completed"]');
    await completedButton.click();
    await page.waitForTimeout(200);
    
    // Verificar que "Concluídas" agora está ativo
    await expect(completedButton).toHaveClass(/active/);
    await expect(allButton).not.toHaveClass(/active/);
  });

  test('ícones devem refletir status da tarefa', async ({ page }) => {
    await page.goto(`${BASE_URL}/todos.html`);
    await page.waitForSelector('.todo-item');
    
    // Verificar que existem ícones diferentes
    const statusIcons = await page.locator('.todo-status').allTextContents();
    
    // Deve ter pelo menos um ✅ ou ⭕
    const hasCheckmark = statusIcons.some(icon => icon.includes('✅'));
    const hasCircle = statusIcons.some(icon => icon.includes('⭕'));
    
    expect(hasCheckmark || hasCircle).toBe(true);
  });
});

// ========================================
// TESTES DA PÁGINA ALBUMS.HTML
// ========================================

test.describe('Albums Page - UI Tests', () => {
  test('deve carregar página de álbuns corretamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/albums.html`);
    await expect(page).toHaveTitle(/Albums/);
    await expect(page.locator('h1')).toContainText('Álbuns');
  });

  test('deve exibir lista de álbuns da API', async ({ page }) => {
    await page.goto(`${BASE_URL}/albums.html`);
    await page.waitForSelector('.album-item', { timeout: 5000 });
    
    const albums = await page.locator('.album-item').count();
    expect(albums).toBeGreaterThan(0);
  });

  test('deve exibir título do álbum', async ({ page }) => {
    await page.goto(`${BASE_URL}/albums.html`);
    await page.waitForSelector('.album-item');
    
    const firstAlbum = page.locator('.album-item').first();
    const title = firstAlbum.locator('.album-title');
    
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText.length).toBeGreaterThan(0);
  });

  test('deve exibir ícone em cada álbum', async ({ page }) => {
    await page.goto(`${BASE_URL}/albums.html`);
    await page.waitForSelector('.album-item');
    
    const firstAlbum = page.locator('.album-item').first();
    const icon = firstAlbum.locator('.album-icon');
    
    await expect(icon).toBeVisible();
  });

  test('deve exibir metadados do álbum', async ({ page }) => {
    await page.goto(`${BASE_URL}/albums.html`);
    await page.waitForSelector('.album-item');
    
    const firstAlbum = page.locator('.album-item').first();
    const meta = firstAlbum.locator('.album-meta');
    
    await expect(meta).toBeVisible();
    const metaText = await meta.textContent();
    expect(metaText).toMatch(/Álbum #\d+/);
    expect(metaText).toMatch(/Usuário #\d+/);
  });
});

// ========================================
// TESTES DE NAVEGAÇÃO
// ========================================

test.describe('Navigation Tests', () => {
  test('todas as páginas devem ter menu de navegação', async ({ page }) => {
    const pages = [
      '/posts.html',
      '/users.html',
      '/comments.html',
      '/todos.html',
      '/albums.html'
    ];
    
    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await expect(page.locator('.nav')).toBeVisible();
      
      // Verificar que tem pelo menos 5 links
      const navLinks = await page.locator('.nav a').count();
      expect(navLinks).toBeGreaterThanOrEqual(5);
    }
  });

  test('link Home deve funcionar em todas as páginas', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    await page.click('a[href="index.html"]');
    await expect(page).toHaveURL(/index.html|localhost:3000\/?$/);
  });

  test('navegação entre páginas deve funcionar', async ({ page }) => {
    await page.goto(`${BASE_URL}`);
    
    // Posts
    await page.click('a[href="posts.html"]');
    await expect(page).toHaveURL(/posts.html/);
    
    // Users
    await page.click('a[href="users.html"]');
    await expect(page).toHaveURL(/users.html/);
    
    // Comments
    await page.click('a[href="comments.html"]');
    await expect(page).toHaveURL(/comments.html/);
    
    // Todos
    await page.click('a[href="todos.html"]');
    await expect(page).toHaveURL(/todos.html/);
    
    // Albums
    await page.click('a[href="albums.html"]');
    await expect(page).toHaveURL(/albums.html/);
  });
});

// ========================================
// TESTES DE ERRO E CASOS EXTREMOS
// ========================================

test.describe('Error Scenarios - UI Tests', () => {
  test('deve retornar 404 para rota inexistente', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/rota-inexistente`);
    expect(response?.status()).toBe(404);
  });

  test('deve lidar com elemento ausente graciosamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    
    const elementoInexistente = page.locator('#elemento-que-nao-existe');
    await expect(elementoInexistente).toHaveCount(0);
  });

  test('deve exibir mensagem quando não há dados', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    
    // Interceptar requisição e retornar array vazio
    await page.route('**/posts', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Verificar mensagem de vazio
    const container = page.locator('#postsContainer');
    const text = await container.textContent();
    expect(text).toMatch(/Nenhum post|vazio/i);
  });

  test('deve lidar com erro de API graciosamente', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    
    // Interceptar e simular erro 500
    await page.route('**/posts', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Deve mostrar mensagem de erro ou não crashar
    const errorMessage = page.locator('.error-message, .loading');
    await expect(errorMessage).toBeVisible();
  });

  test('páginas devem ser responsivas', async ({ page }) => {
    // Testar em mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/posts.html`);
    
    // Verificar que página carrega
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForSelector('.post-item', { timeout: 5000 });
    
    // Verificar que cards não quebram o layout
    const post = page.locator('.post-item').first();
    await expect(post).toBeVisible();
  });

  test('deve suportar temas escuros do navegador', async ({ page }) => {
    // Testar com preferência de tema escuro
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`${BASE_URL}/posts.html`);
    
    // Verificar que página ainda é legível
    await expect(page.locator('h1')).toBeVisible();
  });
});

// ========================================
// TESTES DE PERFORMANCE
// ========================================

test.describe('Performance Tests', () => {
  test('página deve carregar em menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/posts.html`);
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('dados da API devem carregar em menos de 5 segundos', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    
    const startTime = Date.now();
    await page.waitForSelector('.post-item', { timeout: 5000 });
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });
});

// ========================================
// TESTES DE ACESSIBILIDADE
// ========================================

test.describe('Accessibility Tests', () => {
  test('títulos devem ter estrutura semântica correta', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    
    // Deve ter exatamente um H1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('botões devem ter texto descritivo', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('links devem ter href válido', async ({ page }) => {
    await page.goto(`${BASE_URL}/posts.html`);
    
    const links = page.locator('.nav a');
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
    }
  });
});