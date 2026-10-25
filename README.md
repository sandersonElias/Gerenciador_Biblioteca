# 📚 Gerenciador Biblioteca

Sistema completo de gerenciamento bibliotecário desenvolvido com arquitetura moderna full-stack, oferecendo controle de acervo, empréstimos, reservas e usuários com segurança e escalabilidade.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.11-green.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)

## 🎯 Objetivos

O Gerenciador Biblioteca visa automatizar processos operacionais em bibliotecas escolares e institucionais, proporcionando:

- **Gestão inteligente de acervo**: Cadastro, catalogação e busca avançada de livros
- **Controle de circulação**: Empréstimos, renovações e devoluções automatizadas
- **Reservas online**: Fila de espera digital com notificações automáticas
- **Segurança robusta**: Autenticação JWT com controle de acesso por perfis
- **Relatórios gerenciais**: Estatísticas e dashboards para tomada de decisão

## ✨ Principais Funcionalidades

### 📖 Gestão de Livros
- Cadastro completo com metadados (título, autor, editora, gênero, CDD)
- Controle de exemplares e disponibilidade em tempo real
- Busca multifacetada (título, autor, gênero, catalogação)
- Ranking de livros mais populares

### 🔄 Empréstimos e Devoluções
- Registro rápido de saída e retorno
- Renovação automática (até 3 vezes)
- Controle de prazos e status
- Histórico completo de movimentações

### 📋 Reservas
- Fila de espera para livros indisponíveis
- Notificação automática quando disponível
- Expiração automática em 24 horas
- Cancelamento pelo usuário

### 👥 Gestão de Usuários
- Perfis: Administrador, Funcionário e Aluno
- Autenticação segura via JWT
- Cadastro de alunos com dados de turma/ano
- Controle granular de permissões

### 📊 Relatórios
- Dashboard com indicadores principais
- Gráficos de empréstimos por período
- Livros mais solicitados
- Usuários mais ativos

## 📁 Estrutura de Pastas

```
Gerenciador_Biblioteca/
├── Back-End/                  # API REST (Spring Boot)
│   ├── src/main/java/
│   │   └── dev/sanderson/Back_End/
│   │       ├── config/        # Configurações (CORS, OpenAPI)
│   │       ├── controller/    # Endpoints REST
│   │       ├── dto/           # Data Transfer Objects
│   │       ├── entity/        # Entidades JPA
│   │       ├── exception/     # Exceções customizadas
│   │       ├── repository/    # Interfaces Spring Data
│   │       ├── security/      # JWT e configurações de segurança
│   │       └── service/       # Regras de negócio
│   ├── src/main/resources/
│   │   └── db/migration/      # Scripts Flyway (V1__ a V17__)
│   ├── Dockerfile             # Imagem Docker do backend
│   ├── pom.xml                # Dependências Maven
│   └── README.md              # Documentação específica do backend
├── Front-End/                 # Aplicação React + Vite (TypeScript)
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # Integração com API
│   │   ├── context/           # Contextos React (Auth, Toast, Loading)
│   │   └── types/             # Definições TypeScript
│   ├── Dockerfile             # Build Vite + nginx
│   ├── nginx.conf             # Proxy para /api e fallback SPA
│   ├── vercel.json            # Configuração do deploy na Vercel
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml         # Stack local completa
├── render.yaml                # Blueprint do backend + PostgreSQL no Render
└── README.md                  # Este arquivo
```

## 🚀 Executando Localmente

### Pré-requisitos
- Java 21 JDK
- Node.js 18+
- PostgreSQL 15+
- Maven 3.9+
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/sandersonElias/Gerenciador_Biblioteca.git
cd Gerenciador_Biblioteca
```

### 2. Configure o Backend

```bash
cd Back-End

# Opcional: configure as variáveis no ambiente ou em um .env local.
# Os valores padrão usam PostgreSQL em localhost:5432/gerenciador_biblioteca.
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/gerenciador_biblioteca
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=sua_senha
export JWT_SECRET=sua_chave_secreta_com_no_minimo_32_caracteres

mvn clean install
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`.

### 3. Configure o Frontend

```bash
cd ../Front-End

npm install
cp .env.example .env

# Edite .env:
# VITE_API_URL=http://localhost:8080
# VITE_API_TIMEOUT=10000

npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

### 4. Stack completa com Docker (opcional)

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

O Compose já habilita dados fictícios (`DEMO_DATA_ENABLED=true`) com as contas:
`admin@biblioteca-demo.com` / `admin1234` e
`funcionario@biblioteca-demo.com`, `ana.aluna@biblioteca-demo.com`,
`bruno.aluno@biblioteca-demo.com`, `carla.aluna@biblioteca-demo.com` / `demo1234`.

## 🌐 Deploy em Produção

| Serviço | Plataforma | URL |
|---------|-----------|-----|
| Frontend | Vercel | [biblioteca-monsa.vercel.app](https://biblioteca-monsa.vercel.app) |
| Backend | Render (Docker) | URL gerada ao aplicar o `render.yaml` |
| Banco de dados | Render PostgreSQL | Referenciado por `DATABASE_URL` |

### Backend + banco no Render

1. No Render, crie um **Blueprint** apontando para este repositório.
2. O `render.yaml` cria o PostgreSQL 16 e o serviço Docker do backend.
3. Informe no momento do deploy:
   - `ADMIN_EMAIL` e `ADMIN_PASSWORD` do administrador.
   - `DEMO_PASSWORD` usado pelas contas fictícias.
4. O backend cria o admin e os dados de demonstração no primeiro start.
5. O e-mail fica desabilitado (`EMAIL_ENABLED=false`); o SMTP do Render free é bloqueado.

O plano free do PostgreSQL expira em 30 dias. Para uma demo de portfólio,
recrie o banco ao final desse período ou migre para um plano pago.

### Frontend na Vercel

Configure o projeto com **Root Directory** `Front-End` e framework **Vite**:

- Build Command: `npm run build`
- Output Directory: `dist`
- `VITE_API_URL`: URL pública do backend no Render
- `VITE_API_TIMEOUT`: `90000` (o serviço free pode levar ~30 s para acordar)

O `Front-End/vercel.json` já define build, saída e rewrites da SPA.

## 🛠️ Tecnologias Utilizadas

**Backend:**
- Java 21 + Spring Boot 3.5.11
- Spring Security + JWT
- Spring Data JPA + PostgreSQL
- Flyway (migrações)
- Lombok
- OpenAPI/Swagger

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router v6
- React Query
- Axios (HTTP client)
- Chart.js (gráficos)
- SCSS (estilização)

**DevOps:**
- Docker e Docker Compose
- Render (backend + PostgreSQL)
- Vercel (frontend)
- Maven (build)

## 📄 Documentação Técnica
Este projeto possui um relatório técnico completo de 27 páginas, documentando arquitetura, modelo de dados, API, metodologia e decisões de design.

👉 [**Ler o Relatório Técnico (PDF)**](./docs/Relatorio_Biblioteca_Monsa.pdf)

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

## 👤 Autor

- **Sanderson Elias**
- GitHub: [@sandersonElias](https://github.com/sandersonElias)

## 🙏 Agradecimentos

- Comunidade Spring e React pelas excelentes documentações
- Professores orientadores pela valiosa contribuição metodológica