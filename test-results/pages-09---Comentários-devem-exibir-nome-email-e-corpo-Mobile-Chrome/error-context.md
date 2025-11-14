# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - link "Home" [ref=e4] [cursor=pointer]:
      - /url: index.html
    - link "Posts" [ref=e5] [cursor=pointer]:
      - /url: posts.html
    - link "Usuários" [ref=e6] [cursor=pointer]:
      - /url: users.html
    - link "Comentários" [ref=e7] [cursor=pointer]:
      - /url: comments.html
    - link "Tarefas" [ref=e8] [cursor=pointer]:
      - /url: todos.html
    - link "Álbuns" [ref=e9] [cursor=pointer]:
      - /url: albums.html
  - generic [ref=e10]:
    - heading "💬 Comentários" [level=1] [ref=e11]
    - paragraph [ref=e12]: Todos os comentários dos posts
  - generic [ref=e13]:
    - combobox [ref=e14]:
      - option "Todos os posts" [selected]
    - button "Filtrar" [ref=e15] [cursor=pointer]
  - generic [ref=e16]: "Erro ao carregar comentários: Failed to fetch"
```