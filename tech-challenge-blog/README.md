# Tech Challenge Blog — Frontend

Plataforma de blog educacional desenvolvida como Tech Challenge da pós-graduação FIAP. Permite que professores publiquem e gerenciem posts educacionais, e que estudantes os leiam e pesquisem.

## Stack tecnológica

| Tecnologia | Versão | Função |
|---|---|---|
| React | 19.x | UI library |
| React Router v7 | 7.x | Roteamento SPA |
| Styled Components | 6.x | CSS-in-JS |
| Axios | 1.x | Requisições HTTP |
| Vite | 8.x | Build tool |
| Vitest + RTL | 4.x | Testes |
| Docker + nginx | alpine | Containerização |
| GitHub Actions | — | CI/CD |

---

## Arquitetura

### Estrutura de pastas

```
src/
├── assets/              # Imagens, ícones, fontes
├── components/          # Componentes reutilizáveis
│   ├── Header/          # Navegação principal + hamburger menu
│   ├── Footer/          # Rodapé
│   ├── PostCard/        # Card de preview de post
│   ├── SearchBar/       # Input de busca com debounce 300ms
│   ├── PostForm/        # Formulário de criação/edição com validação
│   ├── ProtectedRoute/  # Wrapper de rota protegida
│   ├── Loading/         # Spinner + skeleton cards
│   └── Modal/           # Modal de confirmação
├── pages/
│   ├── HomePage/        # Listagem + paginação + busca
│   ├── PostDetailPage/  # Leitura completa do post
│   ├── LoginPage/       # Autenticação JWT
│   ├── AdminPage/       # Painel com tabela de posts
│   ├── CreatePostPage/  # Criação de post (protegida)
│   ├── EditPostPage/    # Edição de post (protegida)
│   └── NotFoundPage/    # 404
├── contexts/
│   └── AuthContext.jsx  # Estado global de autenticação
├── hooks/
│   ├── useAuth.js       # Acesso ao AuthContext
│   ├── usePosts.js      # CRUD de posts + paginação
│   └── useFetch.js      # Hook genérico de fetch
├── services/
│   └── api.js           # Instância Axios + interceptors
├── styles/
│   ├── GlobalStyles.js  # Reset + estilos base
│   └── theme.js         # Tokens de design (cores, tipografia, breakpoints)
└── utils/
    ├── formatDate.js    # Formatação de datas em pt-BR
    └── truncateText.js  # Truncamento de texto
```

### Hierarquia de componentes

```
App
├── ThemeProvider (styled-components)
├── BrowserRouter
│   ├── AuthProvider (Context)
│   │   ├── Header
│   │   ├── Suspense + Routes
│   │   │   ├── / → HomePage
│   │   │   ├── /posts/:id → PostDetailPage
│   │   │   ├── /login → LoginPage
│   │   │   └── /admin/* → ProtectedRoute → AdminPage/CreatePostPage/EditPostPage
│   │   └── Footer
```

### Gerenciamento de estado

- **AuthContext**: estado global de autenticação (user, token, isAuthenticated)
- **useState local**: estado de formulários, modais, feedback de UI
- **Hooks customizados**: `usePosts` encapsula fetch + paginação; `usePostActions` encapsula mutações

### Fluxo de autenticação

```
1. POST /api/auth/login → { token, user }
2. Token salvo em localStorage + AuthContext
3. Interceptor Axios injeta: Authorization: Bearer <token>
4. Resposta 401 → limpa auth + redireciona para /login
5. Logout → limpa localStorage e context → redireciona para /
```

---

## Pré-requisitos

- Node.js 18+
- npm 9+
- Docker e Docker Compose (para containerização)

---

## Instalação e configuração

### Desenvolvimento local

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd tech-challenge-blog

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL da sua API

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
# → http://localhost:5173
```

### Com Docker

```bash
# Build e start de todos os serviços
docker-compose up --build

# Apenas o frontend
docker build -t tech-challenge-blog .
docker run -p 3000:80 tech-challenge-blog

# → http://localhost:3000
```

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção otimizado |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Análise estática de código (ESLint) |
| `npm run lint:fix` | Corrige problemas de lint automaticamente |
| `npm run test` | Testes em modo watch |
| `npm run test:run` | Testes em modo único (CI) |
| `npm run test:coverage` | Testes com relatório de cobertura |

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` | URL base da API REST |
| `VITE_APP_NAME` | `Tech Challenge Blog` | Nome exibido na aplicação |

---

## Endpoints consumidos

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | Não | Autenticação e geração de JWT |
| `GET` | `/posts` | Não | Lista todos os posts (suporta `?search=query`) |
| `GET` | `/posts/:id` | Não | Detalhe de um post |
| `POST` | `/posts` | Sim (Bearer) | Cria novo post |
| `PUT` | `/posts/:id` | Sim (Bearer) | Atualiza post existente |
| `DELETE` | `/posts/:id` | Sim (Bearer) | Remove post |

### Formato esperado da resposta de login

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Prof. Maria Silva",
    "email": "maria@escola.edu"
  }
}
```

### Formato esperado de um post

```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
  "title": "Título do post",
  "content": "Conteúdo completo...",
  "author": "Prof. Maria Silva",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

> Nota: o frontend é compatível com campos `_id` (MongoDB) ou `id` (outros bancos), e com `author` como string ou objeto `{ name, username }`.

---

## Guia de uso

### Para estudantes (acesso público)

1. Acesse a página inicial (`/`) para ver todos os posts
2. Use a barra de busca para filtrar por título ou conteúdo
3. Navegue pelas páginas usando a paginação na parte inferior
4. Clique em "Ler mais" ou no título para ler o post completo

### Para professores (área administrativa)

1. Acesse `/login` e entre com suas credenciais
2. Você será redirecionado ao **Painel Admin** (`/admin`)
3. No painel, visualize estatísticas e a tabela completa de posts
4. **Criar post**: clique em "+ Novo Post" ou acesse `/admin/create`
   - Preencha título (mín. 5 chars), autor e conteúdo (mín. 20 chars)
   - Clique em "Publicar post"
5. **Editar post**: clique em "Editar" na linha do post desejado
6. **Excluir post**: clique em "Excluir" e confirme no modal
7. Para sair, clique em "Sair" no menu de navegação

---

## Testes

O projeto conta com:

- **Testes unitários** para utilitários (`formatDate`, `truncateText`)
- **Testes de componente** para `PostCard`, `SearchBar`, `PostForm`, `ProtectedRoute`
- **Testes de integração** para o fluxo de login (`LoginPage`)

```bash
# Executar todos os testes
npm run test:run

# Modo watch (desenvolvimento)
npm run test
```

---

## CI/CD — GitHub Actions

O pipeline (`.github/workflows/ci.yml`) executa automaticamente em push para `main` e em pull requests:

1. **lint-and-test**: instala deps, roda ESLint e Vitest
2. **build**: gera o bundle de produção com `vite build`
3. **docker** (somente em push para `main`): build e push da imagem para o GitHub Container Registry

---

## Relatório de experiência da equipe

### Desafios encontrados

- **Compatibilidade de API**: o back-end pode retornar `_id` (MongoDB) ou `id`. Resolvemos com normalização no frontend: `post._id || post.id`.
- **Gerenciamento de estado sem Redux**: manter a autenticação simples com Context API foi a escolha certa para a escala do projeto, evitando over-engineering.
- **Testes com Styled Components + ThemeProvider**: testes de componentes precisam do `ThemeProvider` como wrapper. Criamos helpers de render que encapsulam os providers necessários.
- **ESLint com `no-console: error`**: exigiu disciplina para não deixar logs de desenvolvimento. Implementamos feedback de UI em vez de `console.log`.

### Aprendizados

- React Router v7 mudou a API significativamente; migramos de `<Switch>` para `<Routes>` e `<Outlet>`.
- Styled Components com `transient props` (`$variant`, `$active`) evitam que props customizadas cheguem ao DOM.
- Skeleton loading melhora significativamente a experiência percebida pelo usuário.
- Multi-stage Docker builds reduzem a imagem final de ~1GB para ~25MB.

### Decisões técnicas

| Decisão | Justificativa |
|---|---|
| Vite em vez de CRA | Performance superior, HMR mais rápido, tooling moderno |
| Styled Components em vez de CSS modules | CSS-in-JS facilita theming e props dinâmicas |
| Vitest em vez de Jest | Integração nativa com Vite, configuração zero |
| Context API em vez de Redux | Escopo adequado; Redux seria over-engineering |
| React.lazy + Suspense | Code splitting automático por rota, melhora o TTI |

---

## Contribuindo

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

### Convenção de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` atualização de documentação
- `style:` formatação (sem mudança de lógica)
- `refactor:` refatoração sem nova feature ou fix
- `test:` adição ou correção de testes
- `chore:` tarefas de build, CI, etc.

---