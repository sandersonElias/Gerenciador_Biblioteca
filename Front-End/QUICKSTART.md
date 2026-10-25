# 🚀 Quick Start Guide - Biblioteca Monsa Frontend

## Instalação Rápida

```bash
# 1. Clone ou extraia o projeto
cd Front-End

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite .env e ajuste VITE_API_URL para sua API

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## Configuração da API

Edite o arquivo `.env`:

```env
# Para desenvolvimento local
VITE_API_URL=http://localhost:8080
VITE_API_TIMEOUT=10000

# Para produção (Vercel)
VITE_API_URL=https://sua-api.onrender.com
VITE_API_TIMEOUT=90000
```

> O timeout maior em produção evita falhas enquanto o backend free do Render
> está acordando (cold start).

## Contas de Teste (dados de demonstração)

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | `admin@biblioteca-demo.com` | `admin1234` |
| Funcionário | `funcionario@biblioteca-demo.com` | `demo1234` |
| Aluno (Ana) | `ana.aluna@biblioteca-demo.com` | `demo1234` |
| Aluno (Bruno) | `bruno.aluno@biblioteca-demo.com` | `demo1234` |
| Aluno (Carla) | `carla.aluna@biblioteca-demo.com` | `demo1234` |

Essas credenciais são os padrões locais do `docker-compose.yml`. Em produção,
o admin e a senha demo são definidos no Render (`ADMIN_*` e `DEMO_PASSWORD`).

## Funcionalidades por Perfil

### 👤 Público (Sem login)
- Visualizar página inicial
- Buscar livros
- Ver detalhes dos livros

### 🎓 Aluno (ROLE_ALUNO)
- Tudo do público +
- Meu Perfil: empréstimos ativos e histórico
- Fazer reservas (na página de detalhes do livro)
- Cancelar reservas (no Meu Perfil)
- Solicitar renovação de empréstimo

### 👔 Funcionário (ROLE_FUNCIONARIO)
- Tudo do aluno +
- Gerenciar empréstimos
- Renovar empréstimos
- Registrar devoluções
- Ver relatórios

### 👑 Administrador (ROLE_ADMIN)
- Tudo do funcionário +
- Cadastrar e editar livros
- Gerenciar exemplares
- Cadastrar usuários
- Acesso total ao sistema

## Estrutura de Rotas

```
/                          → Home (público)
/login                     → Login (público)
/buscar                    → Buscar livros (público)
/livro/:id                 → Detalhes do livro (público)
/meu-perfil                → Meu perfil (ALUNO+)
/emprestimos               → Gerenciar empréstimos (FUNCIONARIO+)
/relatorios                → Relatórios (FUNCIONARIO+)
/admin                     → Painel admin (ADMIN)
/admin/livros/novo         → Cadastrar livro (ADMIN)
/admin/livros/editar/:id   → Editar livro (ADMIN)
/admin/usuarios/novo       → Cadastrar usuário (ADMIN)
```

## Comandos Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento (Vite)
npm run build    # Type-check + build de produção em dist/
npm run preview  # Visualiza o build localmente
npm run lint     # Executa ESLint
```

## Deploy na Vercel

1. Configure o projeto com **Root Directory** `Front-End`.
2. Framework: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Adicione `VITE_API_URL` e `VITE_API_TIMEOUT` em Environment Variables.
6. Faça o redeploy.

O `vercel.json` já configura os rewrites da SPA.

## Solução de Problemas

**Erro de CORS:**
Inclua o domínio da Vercel em `CORS_ALLOWED_ORIGINS` no backend do Render.

**Tela branca em produção:**
Confirme que `VITE_API_URL` começa com `https://`, que o backend está online e
que foi feito um novo deploy após alterar a variável.

**Backend demora na primeira requisição:**
O Render free hiberna após 15 minutos. A primeira chamada pode levar ~30 s.

**Erro "Cannot find module":**
Execute `npm install` novamente para garantir que todas as dependências estão instaladas.
