

# 🔧 Gerenciador Biblioteca - Backend

API RESTful desenvolvida em Spring Boot para gerenciamento completo de bibliotecas, oferecendo endpoints seguros para controle de acervo, empréstimos, reservas e usuários.

## 📋 Pré-requisitos

- **Java**: JDK 21 ou superior
- **Maven**: 3.9+
- **PostgreSQL**: 15+
- **Git**: Para clonar o repositório

## 🛠️ Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/sandersonElias/Gerenciador_Biblioteca.git

cd Gerenciador_Biblioteca/Back-End
```

### 2. Configure o banco de dados

Crie o banco de dados PostgreSQL:

```bash
createdb biblioteca
# ou via psql
psql -U postgres -c "CREATE DATABASE biblioteca;"
```

### 3. Configure as variáveis de ambiente

Crie ou edite src/main/resources/application.properties:

```
# Configuração do Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/biblioteca
spring.datasource.username=postgres
spring.datasource.password=sua_senha_segura
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=chave_secreta_deve_ter_no_minimo_32_caracteres_256bits
jwt.expiration=86400000

# Flyway (Migrações)
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true

# Server
server.port=8080
server.servlet.context-path=/

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:4200
```

### 4. Execute as migrações

```bash
mvn clean compile flyway:migrate
```

### 5. Compile e execute

```bash
# Modo desenvolvimento
mvn spring-boot:run

# Ou compile e execute o JAR
mvn clean package
java -jar target/Back-End-0.0.1-SNAPSHOT.jar
```
A API estará disponível em http://localhost:8080

## 🔐 Variáveis de Ambiente

| Variável                     | Descrição                         | Obrigatório | Padrão                                        |
| ---------------------------- | --------------------------------- | ----------- | --------------------------------------------- |
| `SPRING_DATASOURCE_URL`      | URL JDBC do PostgreSQL            | Sim         | `jdbc:postgresql://localhost:5432/biblioteca` |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco                  | Sim         | `postgres`                                    |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco                    | Sim         | -                                             |
| `JWT_SECRET`                 | Chave secreta JWT (mín. 256 bits) | Sim         | -                                             |
| `JWT_EXPIRATION`             | Tempo de expiração do token (ms)  | Não         | `86400000` (24h)                              |
| `SERVER_PORT`                | Porta da aplicação                | Não         | `8080`                                        |

## 🗄️ Migrações (Flyway)

O projeto utiliza Flyway para versionamento do schema. Os scripts localizam-se em src/main/resources/db/migration/:7

| Arquivo                         | Descrição                                       |
| ------------------------------- | ----------------------------------------------- |
| `V1__create_tb_autor.sql`       | Cria tabela de autores                          |
| `V2__create_tb_catalogacao.sql` | Cria tabela de catalogação (CDD)                |
| `V3__create_tb_genero.sql`      | Cria tabela de gêneros literários               |
| `V4__create_tb_livro.sql`       | Cria tabela principal de livros                 |
| `V5__create_tb_roles.sql`       | Cria tabela de perfis de acesso                 |
| `V6__create_tb_user.sql`        | Cria tabela de usuários                         |
| `V7__insert_roles.sql`          | Insere roles padrão (ADMIN, FUNCIONARIO, ALUNO) |
| `V8__create_tb_aluno.sql`       | Cria tabela específica para alunos              |
| `V9__create_tb_emprestimo.sql`  | Cria tabela de empréstimos                      |
| `V10__create_tb_reserva.sql`    | Cria tabela de reservas                         |

### Comandos Flyway

```bash
# Executar migrações pendentes
mvn flyway:migrate

# Verificar status
mvn flyway:info

# Reparar checksums
mvn flyway:repair

# Limpar banco (CUIDADO: apaga todos os dados)
mvn flyway:clean
```

## 🧪 Testes

```bash
# Executar todos os testes
mvn test

# Executar com relatório de cobertura
mvn clean test jacoco:report

# Ver relatório em: target/site/jacoco/index.html
```

## 🚀 Modos de Execução

### Desenvolvimento

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Produção
```bash
# Build otimizado
mvn clean package -DskipTests

# Execução com perfil de produção
java -jar -Dspring.profiles.active=prod target/Back-End-0.0.1-SNAPSHOT.jar
```

## 📡 Exemplos de Chamadas API

### Autenticação

```bash
# Login
curl -X POST http://localhost:8080/auth \
-H "Content-Type: application/json" \
-d '{
"email": "admin@monsa.com",
"password": "123"
}'
# Resposta: Bearer <token_jwt>
```

### Livros
```bash
# Listar todos os livros
curl http://localhost:8080/livro/todos \
-H "Authorization: Bearer SEU_TOKEN"
```

```bash
# Buscar por título
curl http://localhost:8080/livro/buscar/titulo/Dom%20Casmurro \
-H "Authorization: Bearer SEU_TOKEN"
```

```bash
# Criar livro (ADMIN)
curl -X POST http://localhost:8080/livro \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN" \
-d '{
"titulo": "O Senhor dos Anéis",
"autor": "J.R.R. Tolkien",
"genero": "Fantasia",
"catalogacao": "823.912",
"totalExemplares": 5,
"quantidadeDisponivel": 5
}'
```

### Empréstimos
```bash
# Criar empréstimo
curl -X POST http://localhost:8080/emprestimo \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN" \
-d '{
"userId": 1,
"livroId": 5,
"dataDevolucao": "2024-12-31"
}'
```

```bash
# Renovar empréstimo
curl -X PUT http://localhost:8080/emprestimo/renovar/1 \
-H "Authorization: Bearer SEU_TOKEN"
```

```bash
# Devolver livro
curl -X PUT http://localhost:8080/emprestimo/devolver/1 \
-H "Authorization: Bearer SEU_TOKEN"
```

### Reservas

```bash
# Criar reserva
curl -X POST http://localhost:8080/reserva \
-H "Content-Type: application/json" \
-H "Authorization: Bearer SEU_TOKEN" \
-d '{
"livroId": 5,
"userId": 1
}'
```

```bash
# Cancelar reserva
curl -X DELETE http://localhost:8080/reserva/1 \
-H "Authorization: Bearer SEU_TOKEN"
```

## 🐳 Docker Compose
Para executar o backend com PostgreSQL via Docker:

```yaml
version: '3.8'

services:
postgres:
image: postgres:15-alpine
container_name: biblioteca-db
environment:
POSTGRES_DB: biblioteca
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres123
ports:
- "5432:5432"
volumes:
- postgres_data:/var/lib/postgresql/data
networks:
- biblioteca-network

backend:
build: .
container_name: biblioteca-api
environment:
SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/biblioteca
SPRING_DATASOURCE_USERNAME: postgres
SPRING_DATASOURCE_PASSWORD: postgres123
JWT_SECRET: sua_chave_secreta_aqui_deve_ser_bem_longa_e_segura_256bits
JWT_EXPIRATION: 86400000
ports:
- "8080:8080"
depends_on:
- postgres
networks:
- biblioteca-network

volumes:
postgres_data:

networks:
biblioteca-network:
driver: bridge
```

Execute com:
```bash
docker-compose up -d
```

## 📚 Documentação API
A documentação Swagger UI disponibiliza-se automaticamente em:

```plain
http://localhost:8080/swagger-ui.html
```

Endpoints protegidos requerem autenticação via botão "Authorize" (ícone de cadeado), inserindo o token JWT no formato: Bearer seu_token_aqui.

## 🔍 Troubleshooting
* Erro de CORS
* Verifique se cors.allowed-origins inclui a URL do frontend.
* Erro "relation does not exist"
* Execute as migrações Flyway: mvn flyway:migrate
* Token expirado
* Verifique JWT_EXPIRATION ou gere novo token via endpoint /auth.
* Porta 8080 em uso
* Altere SERVER_PORT ou encerre processo ocupante: lsof -ti:8080 | xargs kill -9

## 📄 Licença
* MIT License - veja LICENSE
* 👤 Autor
* Sanderson Elias - GitHub