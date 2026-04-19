# 📚 Gerenciador Biblioteca - Frontend

Sistema de Gerenciamento de Biblioteca desenvolvido em React.js com TypeScript e SCSS.

## 🎨 Design System

### Paleta de Cores
- **Light Cyan**: `#9FE7F5` — Cor de destaque clara
- **Blue Green**: `#429EBD` — Cor secundária
- **Prussian Blue**: `#053F5C` — Cor primária
- **Amber**: `#F7AD19` — Cor de ênfase/alerta

### Tipografia
- Fonte principal: Inter

## 🚀 Tecnologias

- **React 18** — Biblioteca UI
- **TypeScript** — Tipagem estática
- **React Router v6** — Roteamento
- **SCSS** — Estilização com variáveis e mixins
- **Chart.js** — Gráficos e relatórios
- **Axios** — Cliente HTTP
- **Context API** — Gerenciamento de estado

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── auth/           # Proteção de rotas
│   ├── books/          # BookCard, SearchBar
│   ├── common/         # Button, Input, Card, Modal
│   └── layout/         # Header, Footer, Layout
├── context/
│   ├── AuthContext.tsx
│   ├── LoadingContext.tsx
│   └── ToastContext.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── BookSearchPage.tsx
│   ├── BookDetailPage.tsx
│   ├── LoginPage.tsx
│   ├── LoansPage.tsx
│   ├── ReservationsPage.tsx
│   ├── ReportsPage.tsx
│   ├── AdminPage.tsx
│   ├── BookFormPage.tsx
│   └── UserFormPage.tsx
├── services/
│   └── api.ts          # Integração com API (Axios)
├── types/
│   └── index.ts        # Tipos TypeScript
└── App.tsx
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto Front-End:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=10000
```

> ⚠️ Em produção (Vercel), configure `REACT_APP_API_URL` com a URL do backend no Railway:
> `https://gerenciadorbiblioteca-production.up.railway.app`

### Instalação

```bash
npm install
npm start        # Desenvolvimento (http://localhost:3000)
npm run build    # Build de produção
```

## 🔐 Controle de Acesso

| Perfil | Páginas Acessíveis |
|--------|-------------------|
| **Público** | Home, Buscar Livros, Detalhes do Livro, Login |
| **ROLE_ALUNO** | + Minhas Reservas |
| **ROLE_FUNCIONARIO** | + Empréstimos, Relatórios |
| **ROLE_ADMIN** | + Admin, Cadastrar Livros, Cadastrar Usuários |

### Contas de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Administrador | admin@monsa.com | 123 |
| Funcionário | func@monsa.com | 123 |
| Aluno | aluno@monsa.com | 123 |

## 🌐 Deploy (Vercel)

O frontend é hospedado na Vercel com deploy automático via GitHub.

**Variáveis de ambiente necessárias na Vercel** (Settings → Environment Variables):

| Variável | Valor |
|----------|-------|
| `REACT_APP_API_URL` | `https://gerenciadorbiblioteca-production.up.railway.app` |
| `REACT_APP_API_TIMEOUT` | `10000` |

> Após alterar variáveis de ambiente, é necessário fazer um novo deploy na Vercel para as mudanças surtirem efeito.

## 📡 Estrutura de Rotas

```
/                    → Home (público)
/login               → Login (público)
/buscar              → Buscar livros (público)
/livro/:id           → Detalhes do livro (público)
/reservas            → Minhas reservas (ALUNO+)
/emprestimos         → Gerenciar empréstimos (FUNCIONARIO+)
/relatorios          → Relatórios (FUNCIONARIO+)
/admin               → Painel admin (ADMIN)
/admin/livros/novo   → Cadastrar livro (ADMIN)
/admin/usuarios/novo → Cadastrar usuário (ADMIN)
```

## 🔍 Troubleshooting

**Tela branca após deploy:**
- Verifique se `REACT_APP_API_URL` está configurada com `https://` na Vercel
- Faça um novo Redeploy sem cache após alterar variáveis

**Erro de CORS:**
- Confirme que o domínio da Vercel está listado no `SecurityConfiguration.java` do backend

**`.map is not a function`:**
- A API retornou algo inesperado (não é um array). Verifique se o backend está online e se a URL está correta.

## 📄 Licença

Este projeto é desenvolvido para a Biblioteca Monsa.

---

**Desenvolvido com ❤️ para a Biblioteca Monsa**