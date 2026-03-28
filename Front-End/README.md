# Gerenciador Biblioteca - Frontend

Sistema de Gerenciamento de Biblioteca desenvolvido em React.js com TypeScript e SCSS.

## 🎨 Design System

### Paleta de Cores
- **Light Cyan**: `#9FE7F5` - Cor de destaque clara
- **Blue Green**: `#429EBD` - Cor secundária
- **Prussian Blue**: `#053F5C` - Cor primária
- **Amber**: `#F7AD19` - Cor de ênfase/alerta

### Tipografia
- Fonte principal: Inter
- Tamanhos: 0.75rem (small), 0.875rem (body), 1rem (base), 1.25rem (h3), 1.5rem (h2), 1.875rem (h1)

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **React Router v6** - Roteamento
- **SCSS** - Estilização com variáveis e mixins
- **Chart.js** - Gráficos e relatórios
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── auth/           # Componentes de autenticação
│   │   └── ProtectedRoute.tsx
│   ├── books/          # Componentes relacionados a livros
│   │   ├── BookCard.tsx
│   │   └── SearchBar.tsx
│   ├── common/         # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── layout/         # Componentes de layout
│       ├── Footer.tsx
│       ├── Header.tsx
│       └── Layout.tsx
├── context/            # Contextos React
│   ├── AuthContext.tsx
│   ├── LoadingContext.tsx
│   └── ToastContext.tsx
├── pages/              # Páginas da aplicação
│   ├── AdminPage.tsx
│   ├── BookDetailPage.tsx
│   ├── BookFormPage.tsx
│   ├── BookSearchPage.tsx
│   ├── HomePage.tsx
│   ├── LoansPage.tsx
│   ├── LoginPage.tsx
│   ├── ReportsPage.tsx
│   ├── ReservationsPage.tsx
│   └── UserFormPage.tsx
├── services/           # Serviços de API
│   └── api.ts
├── styles/             # Estilos globais
│   └── _variables.scss
├── types/              # Tipos TypeScript
│   └── index.ts
├── utils/              # Utilitários
├── App.tsx
└── index.tsx
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=10000

# Authentication
REACT_APP_TOKEN_KEY=auth_token
REACT_APP_REFRESH_TOKEN_KEY=refresh_token

# Feature Flags
REACT_APP_ENABLE_DEBUG_LOGS=true
```

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test
```

## 🔐 Controle de Acesso

### Perfis de Usuário

| Perfil | Páginas Acessíveis |
|--------|-------------------|
| **Público** | Home, Buscar Livros, Detalhes do Livro, Login |
| **ROLE_ALUNO** | + Reservas, Minhas Reservas |
| **ROLE_FUNCIONARIO** | + Empréstimos, Relatórios |
| **ROLE_ADMIN** | + Admin, Cadastrar Livros, Cadastrar Usuários |

### Contas de Teste

```
Administrador:
- Email: admin@monsa.com
- Senha: 123

Funcionário:
- Email: func@monsa.com
- Senha: 123

Aluno:
- Email: aluno@monsa.com
- Senha: 123
```

## 📡 API Endpoints

### Autenticação
- `POST /auth` - Login
- `POST /auth/registrar` - Registrar usuário

### Livros
- `GET /livro/todos` - Listar todos
- `GET /livro/{id}` - Buscar por ID
- `GET /livro/buscar/{filtro}/{termo}` - Buscar com filtros
- `GET /livro/populares` - Livros mais populares
- `POST /livro` - Criar livro
- `PUT /livro/{id}` - Atualizar livro

### Empréstimos
- `GET /emprestimo/todos` - Listar todos
- `POST /emprestimo` - Criar empréstimo
- `PUT /emprestimo/renovar/{id}` - Renovar
- `PUT /emprestimo/devolver/{id}` - Devolver

### Reservas
- `GET /reserva/todos` - Listar todas
- `GET /reserva/minhas` - Minhas reservas
- `POST /reserva/{livroId}` - Criar reserva
- `DELETE /reserva/{id}` - Cancelar reserva

## 🎯 Funcionalidades

### Público
- ✅ Landing page com hero section
- ✅ Busca de livros com filtros (título, autor, gênero, catalogação)
- ✅ Visualização de detalhes do livro
- ✅ Login com JWT

### Aluno
- ✅ Reservar livros disponíveis
- ✅ Visualizar status das reservas
- ✅ Cancelar reservas

### Funcionário
- ✅ Gerenciar empréstimos (criar, renovar, devolver)
- ✅ Visualizar relatórios com gráficos
- ✅ Listar todas as reservas

### Administrador
- ✅ Cadastrar novos livros
- ✅ Editar livros existentes
- ✅ Cadastrar novos usuários
- ✅ Acesso total ao sistema

## ♿ Acessibilidade

- Semântica HTML5 adequada
- Atributos ARIA para componentes interativos
- Navegação por teclado completa
- Contraste de cores adequado
- Suporte a leitores de tela

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar com coverage
npm test -- --coverage

# Executar em modo watch
npm test -- --watch
```

## 📝 Convenções de Código

### Nomenclatura
- Componentes: PascalCase (ex: `BookCard.tsx`)
- Hooks: camelCase com prefixo "use" (ex: `useAuth.ts`)
- Estilos: Mesmo nome do componente com extensão `.scss`
- Tipos: PascalCase em arquivo `types/index.ts`

### Estrutura de Componentes
```typescript
// Imports
import React from 'react';

// Types
interface Props {}

// Component
const Component: React.FC<Props> = () => {
  return <div />;
};

export default Component;
```

## 🔒 Segurança

- Tokens JWT armazenados em localStorage (com fallback para httpOnly cookies quando implementado no backend)
- Validação de roles no frontend e backend
- Sanitização de inputs
- Proteção contra XSS com React

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

O build será gerado na pasta `build/` e pode ser servido por qualquer servidor estático.

### Configuração para Deploy
1. Atualize a `REACT_APP_API_BASE_URL` no arquivo `.env`
2. Execute `npm run build`
3. Faça upload dos arquivos da pasta `build/`

## 📄 Licença

Este projeto é privado e desenvolvido para a Biblioteca Monsa.

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para a Biblioteca Monsa**
