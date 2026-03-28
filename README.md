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
│   │       ├── config/         # Configurações (CORS, OpenAPI)
│   │       ├── controller/   # Endpoints REST
│   │       ├── dto/          # Data Transfer Objects
│   │       ├── entity/       # Entidades JPA
│   │       ├── exception/    # Exceções customizadas
│   │       ├── repository/   # Interfaces Spring Data
│   │       ├── security/     # JWT e configurações de segurança
│   │       └── service/      # Regras de negócio
│   ├── src/main/resources/
│   │   └── db/migration/     # Scripts Flyway (V1__ a V10__)
│   ├── pom.xml               # Dependências Maven
│   └── README.md             # Documentação específica do backend
├── Front-End/                 # Aplicação React (TypeScript)
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Integração com API
│   │   ├── context/          # Contextos React (Auth, Toast)
│   │   └── types/            # Definições TypeScript
│   ├── package.json
│   └── tsconfig.json
├── docs/                      # Documentação técnica
│   └── relatorio_tecnico.pdf
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

# Configure o banco de dados em src/main/resources/application.properties:
# spring.datasource.url=jdbc:postgresql://localhost:5432/biblioteca
# spring.datasource.username=seu_usuario
# spring.datasource.password=sua_senha
# jwt.secret=sua_chave_secreta_minimo_256_bits
# jwt.expiration=86400000

# Execute as migrações e inicie o servidor
mvn clean install
mvn spring-boot:run
```
O backend estará disponível em http://localhost:8080

### 3. Configure o Frontend

```bash
cd ../Front-End

# Instale as dependências
npm install

# Configure a URL da API em .env:
# REACT_APP_API_BASE_URL=http://localhost:8080

# Inicie o servidor de desenvolvimento
npm start
```
O frontend estará disponível em http://localhost:3000

### 🛠️ Tecnologias Utilizadas

Backend:
- Java 21 + Spring Boot 3.5.11
- Spring Security + JWT
- Spring Data JPA + PostgreSQL
- Flyway (migrações)
- Lombok
- OpenAPI/Swagger

Frontend:
- React 18 + TypeScript
- React Router v6
- Axios (HTTP client)
- Chart.js (gráficos)
- SCSS (estilização)
  
DevOps:
- Docker + Docker Compose
- Maven (build)
- npm (gerenciamento de pacotes)

### 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

### 👤 Autor

- Sanderson Elias
- GitHub: @sandersonElias
- Email: sandersonelias@email.com
- LinkedIn: linkedin.com/in/sandersonelias

### 🙏 Agradecimentos

Centro Paula Souza (CPS) pelo suporte acadêmico
Comunidade Spring e React pelas excelentes documentações
Professores orientadores pela valiosa contribuição metodológica
