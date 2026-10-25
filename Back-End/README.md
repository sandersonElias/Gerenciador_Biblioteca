# 🔧 Gerenciador Biblioteca - Backend

API RESTful desenvolvida em Spring Boot para gerenciamento completo de bibliotecas, oferecendo endpoints seguros para controle de acervo, empréstimos, reservas e usuários.

## 📋 Pré-requisitos

- **Java**: JDK 21 ou superior
- **Maven**: 3.9+
- **PostgreSQL**: 15+
- **Git**: Para clonar o repositório

## 🛠️ Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/sandersonElias/Gerenciador_Biblioteca.git
cd Gerenciador_Biblioteca/Back-End
```

### 2. Configure o banco de dados

```bash
psql -U postgres -c "CREATE DATABASE gerenciador_biblioteca;"
```

### 3. Configure as variáveis de ambiente

Os valores padrão de `application.properties` apontam para
`jdbc:postgresql://localhost:5432/gerenciador_biblioteca` com usuário `postgres`.
Para sobrescrever, use:

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/gerenciador_biblioteca
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=sua_senha_segura
JWT_SECRET=sua_chave_secreta_com_no_minimo_32_caracteres
JWT_EXPIRATION=86400000
PORT=8080
```

As migrações Flyway são executadas automaticamente no start.

### 4. Compile e execute

```bash
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | URL do PostgreSQL no Render (`postgresql://...`); convertida para JDBC pelo `DatabaseConfig` | Sim no Render |
| `SPRING_DATASOURCE_URL` | JDBC completo para execução local | Não |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco local | Não |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco local | Não |
| `JWT_SECRET` | Chave secreta JWT (mín. 32 caracteres) | Sim |
| `JWT_EXPIRATION` | Tempo de expiração do token (ms) | Não (padrão: 86400000) |
| `PORT` | Porta da aplicação | Não (padrão: 8080) |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas, separadas por vírgula | Não |
| `ADMIN_NAME` | Nome do admin inicial | Não |
| `ADMIN_EMAIL` | E-mail do admin inicial | Não |
| `ADMIN_PASSWORD` | Senha do admin inicial (mín. 8 caracteres) | Não |
| `DEMO_DATA_ENABLED` | Cria dados fictícios no primeiro start | Não (padrão: false) |
| `DEMO_PASSWORD` | Senha das contas fictícias | Sim se demo habilitada |
| `EMAIL_ENABLED` | Habilita envio de e-mail | Não (padrão: false) |
| `EMAIL_USERNAME` | Usuário SMTP | Não |
| `EMAIL_PASSWORD` | Senha SMTP | Não |
| `SHOW_SQL` | Exibe SQL no log | Não (padrão: false no Render) |

> O Render fornece `DATABASE_URL` automaticamente via `fromDatabase.connectionString`.
> Não é necessário configurar `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` ou `PGPASSWORD`.

## 🗄️ Migrações (Flyway)

Scripts em `src/main/resources/db/migration/`:

| Arquivo | Descrição |
|---------|-----------|
| `V1__create_tb_autor.sql` | Cria tabela de autores |
| `V2__create_tb_catalogacao.sql` | Cria tabela de catalogação |
| `V3__create_tb_genero.sql` | Cria tabela de gêneros |
| `V4__create_tb_livro.sql` | Cria tabela de livros |
| `V5__create_tb_roles.sql` | Cria tabela de perfis |
| `V6__create_tb_user.sql` | Cria tabela de usuários |
| `V7__insert_roles.sql` | Insere roles padrão |
| `V8__create_tb_aluno.sql` | Cria tabela de alunos |
| `V9__create_tb_emprestimo.sql` | Cria tabela de empréstimos |
| `V10__create_tb_reserva.sql` | Cria tabela de reservas |
| `V11__create_tb_solicitacao_renovacao.sql` | Cria tabela de solicitações de renovação |
| `V12__create_tb_exemplar.sql` | Cria tabela de exemplares |
| `V13__add_matricula_e_senha_alterada.sql` | Adiciona matrícula e troca de senha |
| `V14__insert_role_professor.sql` | Insere o perfil de professor |
| `V15__add_performance_indexes.sql` | Adiciona índices de performance |
| `V16__add_optimistic_locking_and_auditing.sql` | Adiciona versionamento e auditoria |
| `V17__add_unique_exemplar_livro_codigo.sql` | Garante código único por exemplar |

## 🌐 Deploy (Render)

O `render.yaml` na raiz do repositório cria:

- PostgreSQL 16 free (`biblioteca-monsa-db`).
- Web service Docker free (`biblioteca-monsa-api`), usando `./Back-End` como contexto.
- `DATABASE_URL` vinculada automaticamente ao banco.
- Health check em `/livro/populares`.
- Dados de demonstração habilitados e e-mail desabilitado.

No dashboard do Render, informe `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `DEMO_PASSWORD`
quando o Blueprint solicitar. O `JWT_SECRET` é gerado automaticamente.

**Gerar segredos localmente (opcional):**

```bash
openssl rand -hex 64
# ou
python -c "import secrets; print(secrets.token_hex(64))"
```

### Build local da imagem

```bash
docker build -t biblioteca-backend ./Back-End
docker run --rm -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/gerenciador_biblioteca \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=senha123 \
  -e JWT_SECRET=local-secret-com-no-minimo-32-caracteres \
  biblioteca-backend
```

> O plano free do Render hiberna após 15 minutos de inatividade e o PostgreSQL
> free expira em 30 dias.

## 📡 Principais Endpoints

### Autenticação
```bash
POST /auth                    # Login (retorna token JWT)
POST /auth/registrar          # Registrar usuário (ADMIN)
```

### Livros
```bash
GET  /livro/todos             # Listar todos (público)
GET  /livro/id/{id}           # Buscar por ID (público)
GET  /livro/buscar/{f}/{t}    # Buscar com filtro (público)
GET  /livro/populares         # Livros populares (público)
POST /livro                   # Criar livro (ADMIN)
PUT  /livro/{id}              # Atualizar livro (ADMIN)
DELETE /livro/{id}            # Deletar livro (ADMIN)
```

### Empréstimos
```bash
GET  /emprestimo/todos                  # Listar todos (FUNCIONARIO+)
GET  /emprestimo/id/{id}               # Buscar por ID (FUNCIONARIO+)
GET  /emprestimo/minha-conta           # Empréstimos do usuário autenticado (ALUNO+)
GET  /emprestimo/user/{nome}           # Buscar por nome do usuário (FUNCIONARIO+)
GET  /emprestimo/livro/{titulo}        # Buscar por título do livro (FUNCIONARIO+)
GET  /emprestimo/livro/renovar/{titulo} # Buscar para renovação por livro (FUNCIONARIO+)
GET  /emprestimo/user/renovar/{nome}   # Buscar para renovação por usuário (FUNCIONARIO+)
GET  /emprestimo/status/{status}       # Buscar por status (FUNCIONARIO+)
GET  /emprestimo/devolucao/{data}      # Devoluções do dia (FUNCIONARIO+)
POST /emprestimo                       # Criar empréstimo (FUNCIONARIO+)
PUT  /emprestimo/renovar/{id}          # Renovar (FUNCIONARIO+)
PUT  /emprestimo/devolver/{id}         # Devolver (FUNCIONARIO+)
```

### Reservas
```bash
GET    /reserva/todos                  # Listar todas (FUNCIONARIO+)
GET    /reserva/username/{name}        # Reservas por nome do usuário (ALUNO+)
GET    /reserva/useremail/{email}      # Reservas por email do usuário (ALUNO+)
GET    /reserva/livro/{livroId}        # Reservas por livro (FUNCIONARIO+)
POST   /reserva                        # Criar reserva (ALUNO+)
DELETE /reserva/{id}                   # Cancelar reserva (ALUNO+)
```

### Exemplares
```bash
GET  /exemplar/livro/{livroId}              # Todos os exemplares do livro (FUNCIONARIO+)
GET  /exemplar/livro/{livroId}/disponiveis  # Exemplares disponíveis (FUNCIONARIO+)
GET  /exemplar/livro/{livroId}/sugestao     # Sugerir exemplar disponível (FUNCIONARIO+)
POST /exemplar/livro/{livroId}/adicionar    # Adicionar exemplares manualmente (ADMIN)
```

### Solicitações de Renovação
```bash
POST /solicitacoes-renovacao/{email}              # Solicitar renovação (ALUNO+)
GET  /solicitacoes-renovacao/pendentes            # Listar pendentes (FUNCIONARIO+)
PUT  /solicitacoes-renovacao/{id}/aprovar/{email} # Aprovar solicitação (FUNCIONARIO+)
PUT  /solicitacoes-renovacao/{id}/rejeitar/{email} # Rejeitar solicitação (FUNCIONARIO+)
```

### Autores
```bash
POST /autor                  # Criar autor (ADMIN)
GET  /autor/buscar/{autor}   # Buscar autores (FUNCIONARIO+)
```

### Gêneros
```bash
POST /genero                 # Criar gênero (ADMIN)
GET  /genero/buscar/{genero} # Buscar gêneros (FUNCIONARIO+)
```

### Catalogação (CDD)
```bash
POST /catalogacao                        # Criar catalogação (ADMIN)
GET  /catalogacao/buscar/{catalogacao}   # Buscar catalogações (FUNCIONARIO+)
```

### Usuários
```bash
GET /user/name/{name}   # Buscar usuários por nome (FUNCIONARIO+)
```

## 📚 Documentação API (Swagger)

Disponível em: `http://localhost:8080/swagger-ui.html`

Endpoints protegidos requerem autenticação via botão "Authorize" com o token JWT no formato: `Bearer seu_token_aqui`

## 🔍 Troubleshooting

**Erro de CORS:**
- Inclua a origem do frontend em `CORS_ALLOWED_ORIGINS`, separando múltiplas origens por vírgula.

**Erro "relation does not exist":**
- Execute as migrações: `mvn flyway:migrate`

**Token expirado:**
- Verifique `JWT_EXPIRATION` ou gere novo token via `POST /auth`

**Driver not accept jdbcUrl:**
- O `DatabaseConfig` converte `DATABASE_URL` (`postgres://` ou `postgresql://`) para JDBC.
- Em execução local, prefira `SPRING_DATASOURCE_URL` com o prefixo `jdbc:`.

## 📄 Licença

MIT License