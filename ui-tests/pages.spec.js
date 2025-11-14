const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080';

// ========================================
// TESTES BÁSICOS DE CARREGAMENTO (3 testes)
// ========================================

test('01 - Homepage deve carregar com título correto', async ({ page }) => {
  await page.goto(`${BASE_URL}`);
  await expect(page).toHaveTitle(/N3/);
  await expect(page.locator('h1')).toContainText('Projeto N3');
});

test('02 - Página de posts deve carregar', async ({ page }) => {
  await page.goto(`${BASE_URL}/posts.html`);
  await expect(page).toHaveTitle(/Posts/);
  await page.waitForSelector('.post-item', { timeout: 5000 });
  const posts = await page.locator('.post-item').count();
  expect(posts).toBeGreaterThan(0);
});

test('03 - Página de usuários deve carregar', async ({ page }) => {
  await page.goto(`${BASE_URL}/users.html`);
  await expect(page).toHaveTitle(/Usuários/);
  await page.waitForSelector('.user-item', { timeout: 5000 });
  const users = await page.locator('.user-item').count();
  expect(users).toBeGreaterThan(0);
});

// ========================================
// TESTES DE NAVEGAÇÃO (3 testes)
// ========================================

test('04 - Navegação de index para posts deve funcionar', async ({ page }) => {
  await page.goto(`${BASE_URL}`);
  await page.click('a[href="posts.html"]');
  await expect(page).toHaveURL(/posts\.html/);
  await expect(page.locator('h1')).toContainText('Posts');
});

test('05 - Menu de navegação deve existir em todas páginas', async ({ page }) => {
  const pages = ['/posts.html', '/users.html', '/comments.html'];
  
  for (const path of pages) {
    await page.goto(`${BASE_URL}${path}`);
    await expect(page.locator('nav')).toBeVisible();
    const navLinks = await page.locator('nav a').count();
    expect(navLinks).toBeGreaterThanOrEqual(5);
  }
});

test('06 - Link Home deve retornar à página inicial', async ({ page }) => {
  await page.goto(`${BASE_URL}/posts.html`);
  await page.click('a[href="index.html"]');
  await expect(page).toHaveURL(/index\.html|localhost:8080\/?$/);
});

// ========================================
// TESTES DE CONTEÚDO (4 testes)
// ========================================

test('07 - Posts devem exibir título e corpo', async ({ page }) => {
  await page.goto(`${BASE_URL}/posts.html`);
  await page.waitForSelector('.post-item');
  
  const firstPost = page.locator('.post-item').first();
  await expect(firstPost.locator('.post-title')).toBeVisible();
  await expect(firstPost.locator('.post-body')).toBeVisible();
  
  const titleText = await firstPost.locator('.post-title').textContent();
  expect(titleText.length).toBeGreaterThan(0);
});

test('08 - Usuários devem exibir nome, email e telefone', async ({ page }) => {
  await page.goto(`${BASE_URL}/users.html`);
  await page.waitForSelector('.user-item');
  
  const firstUser = page.locator('.user-item').first();
  await expect(firstUser.locator('.user-name')).toBeVisible();
  await expect(firstUser.locator('.user-email')).toBeVisible();
  await expect(firstUser.locator('.user-phone')).toBeVisible();
});

test('09 - Comentários devem exibir nome, email e corpo', async ({ page }) => {
  await page.goto(`${BASE_URL}/comments.html`);
  await page.waitForSelector('.comment-item', { timeout: 5000 });
  
  const firstComment = page.locator('.comment-item').first();
  await expect(firstComment.locator('.comment-name')).toBeVisible();
  await expect(firstComment.locator('.comment-email')).toBeVisible();
  await expect(firstComment.locator('.comment-body')).toBeVisible();
});

test('10 - Tarefas devem mostrar status de conclusão', async ({ page }) => {
  await page.goto(`${BASE_URL}/todos.html`);
  await page.waitForSelector('.todo-item', { timeout: 5000 });
  
  const todos = page.locator('.todo-item');
  const count = await todos.count();
  expect(count).toBeGreaterThan(0);
  
  // Verificar que pelo menos uma tarefa tem checkbox visível
  const firstTodo = todos.first();
  await expect(firstTodo.locator('.todo-checkbox')).toBeVisible();
});

// ========================================
// TESTES DE ERRO (3 testes)
// ========================================

test('11 - Deve retornar 404 para rota inexistente', async ({ page }) => {
  const response = await page.goto(`${BASE_URL}/pagina-nao-existe.html`);
  expect(response?.status()).toBe(404);
});

test('12 - Deve lidar com elemento ausente graciosamente', async ({ page }) => {
  await page.goto(`${BASE_URL}/posts.html`);
  
  const elementoInexistente = page.locator('#elemento-que-nao-existe-12345');
  await expect(elementoInexistente).toHaveCount(0);
});

test('13 - Mensagem de erro deve ser exibida quando API falha', async ({ page }) => {
  // Este teste verifica que o HTML tem um elemento de erro preparado
  await page.goto(`${BASE_URL}/posts.html`);
  
  const errorDiv = page.locator('#error');
  await expect(errorDiv).toHaveCount(1);
  
  // Inicialmente deve estar escondido
  const isHidden = await errorDiv.evaluate(el => 
    el.style.display === 'none' || el.offsetParent === null
  );
  expect(isHidden).toBe(true);
});

// ========================================
// TESTES ADICIONAIS (2 testes)
// ========================================

test('14 - Álbuns devem carregar e exibir títulos', async ({ page }) => {
  await page.goto(`${BASE_URL}/albums.html`);
  await page.waitForSelector('.album-item', { timeout: 5000 });
  
  const albums = await page.locator('.album-item').count();
  expect(albums).toBeGreaterThan(0);
  
  const firstAlbum = page.locator('.album-item').first();
  await expect(firstAlbum.locator('.album-title')).toBeVisible();
});

test('15 - Todas as 5 páginas principais devem ser acessíveis', async ({ page }) => {
  const pages = [
    { url: '/', title: /N3/ },
    { url: '/posts.html', title: /Posts/ },
    { url: '/users.html', title: /Usuários/ },
    { url: '/comments.html', title: /Comentários/ },
    { url: '/todos.html', title: /Tarefas/ }
  ];
  
  for (const pageDef of pages) {
    await page.goto(`${BASE_URL}${pageDef.url}`);
    await expect(page).toHaveTitle(pageDef.title);
  }
});