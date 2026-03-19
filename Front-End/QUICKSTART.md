# 🚀 Quick Start Guide - Biblioteca Monsa Frontend

## Instalação Rápida

```bash
# 1. Clone ou extraia o projeto
cd biblioteca-monsa-frontend

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite .env e ajuste REACT_APP_API_BASE_URL para sua API

# 4. Inicie o servidor de desenvolvimento
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## Configuração da API

Edite o arquivo `.env`:

```env
# Para desenvolvimento local com backend na porta 8080
REACT_APP_API_BASE_URL=http://localhost:8080

# Para produção
REACT_APP_API_BASE_URL=https://sua-api.com
```

## Contas de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@monsa.com | 123 |
| Funcionário | func@monsa.com | 123 |
| Aluno | aluno@monsa.com | 123 |

## Funcionalidades por Perfil

### 👤 Público (Sem login)
- Visualizar página inicial
- Buscar livros
- Ver detalhes dos livros

### 🎓 Aluno (ROLE_ALUNO)
- Tudo do público +
- Fazer reservas
- Ver minhas reservas
- Cancelar reservas

### 👔 Funcionário (ROLE_FUNCIONARIO)
- Tudo do aluno +
- Gerenciar empréstimos
- Renovar empréstimos
- Registrar devoluções
- Ver relatórios

### 👑 Administrador (ROLE_ADMIN)
- Tudo do funcionário +
- Cadastrar novos livros
- Editar livros
- Cadastrar usuários
- Acesso total ao sistema

## Estrutura de Rotas

```
/                    - Home (público)
/login               - Login (público)
/buscar              - Buscar livros (público)
/livro/:id           - Detalhes do livro (público)
/reservas            - Minhas reservas (aluno+)
/emprestimos         - Gerenciar empréstimos (funcionário+)
/relatorios          - Relatórios (funcionário+)
/admin               - Painel admin (admin)
/admin/livros/novo   - Cadastrar livro (admin)
/admin/usuarios/novo - Cadastrar usuário (admin)
```

## Comandos Disponíveis

```bash
npm start      # Inicia servidor de desenvolvimento
npm run build  # Cria build de produção
npm test       # Executa testes
npm run lint   # Executa linter
```

## Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, verifique se o backend está configurado para aceitar requisições do frontend.

### Porta já em uso
Se a porta 3000 estiver ocupada, o React perguntará se deseja usar outra porta.

### Erro "Cannot find module"
Execute `npm install` novamente para garantir que todas as dependências estão instaladas.

## Suporte

Para mais informações, consulte o README.md completo ou entre em contato com a equipe de desenvolvimento.