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
psql -U postgres -c "CREATE DATABASE biblioteca;"
```

### 3. Configure o application.properties

Edite `src/main/resources/application.properties`:

```properties
# Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/biblioteca
spring.datasource.username=postgres
spring.datasource.password=sua_senha_segura
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT
jwt.secret=sua_chave_secreta_minimo_256_bits
jwt.expiration=86400000

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

# Server
server.port=${PORT:8080}
```

### 4. Compile e execute

```bash
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`

## 🔐 Variáveis de Ambiente (Produção - Railway)

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `PGHOST` | Host do PostgreSQL | Sim |
| `PGPORT` | Porta do PostgreSQL | Sim |
| `PGDATABASE` | Nome do banco | Sim |
| `PGUSER` | Usuário do banco | Sim |
| `PGPASSWORD` | Senha do banco | Sim |
| `JWT_SECRET` | Chave secreta JWT (mín. 256 bits) | Sim |
| `JWT_EXPIRATION` | Tempo de expiração do token (ms) | Não (padrão: 86400000) |
| `PORT` | Porta da aplicação | Não (padrão: 8080) |

> No Railway, use Variable References para referenciar as variáveis do banco automaticamente:
> `${{Postgres.PGHOST}}`, `${{Postgres.PGUSER}}`, etc.

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

## 🌐 Deploy (Railway)

O projeto inclui um `Dockerfile` na raiz do repositório configurado para o Railway.

**Variáveis necessárias no serviço do Railway:**

```
DATABASE_URL    = ${{Postgres.DATABASE_URL}}
PGHOST          = ${{Postgres.PGHOST}}
PGPORT          = ${{Postgres.PGPORT}}
PGDATABASE      = ${{Postgres.PGDATABASE}}
PGUSER          = ${{Postgres.PGUSER}}
PGPASSWORD      = ${{Postgres.PGPASSWORD}}
JWT_SECRET      = sua_chave_gerada
JWT_EXPIRATION  = 86400000
```

**Gerar JWT_SECRET seguro:**

```bash
openssl rand -hex 64
# ou
python -c "import secrets; print(secrets.token_hex(64))"
```

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
GET /emprestimo/todos         # Listar todos (FUNCIONARIO+)
POST /emprestimo              # Criar empréstimo (FUNCIONARIO+)
PUT /emprestimo/renovar/{id}  # Renovar (FUNCIONARIO+)
PUT /emprestimo/devolver/{id} # Devolver (FUNCIONARIO+)
```

### Reservas
```bash
GET    /reserva/todos                  # Listar todas (FUNCIONARIO+)
GET    /reserva/useremail/{email}      # Reservas por email (ALUNO+)
POST   /reserva                        # Criar reserva (ALUNO+)
DELETE /reserva/{id}                   # Cancelar reserva (ALUNO+)
GET    /reserva/livro/{livroId}        # Reservas por livro (FUNCIONARIO+)
```

## 📚 Documentação API (Swagger)

Disponível em: `http://localhost:8080/swagger-ui.html`

Endpoints protegidos requerem autenticação via botão "Authorize" com o token JWT no formato: `Bearer seu_token_aqui`

## 🔍 Troubleshooting

**Erro de CORS:**
- Verifique se o domínio do frontend está listado no `SecurityConfiguration.java` no método `corsConfigurer()`

**Erro "relation does not exist":**
- Execute as migrações: `mvn flyway:migrate`

**Token expirado:**
- Verifique `JWT_EXPIRATION` ou gere novo token via `POST /auth`

**Driver not accept jdbcUrl:**
- A `DATABASE_URL` do Railway vem no formato `postgresql://...` sem o prefixo `jdbc:`
- Use as variáveis separadas `PGHOST`, `PGPORT`, `PGDATABASE` no `application.properties`

## 📄 Licença

MIT License