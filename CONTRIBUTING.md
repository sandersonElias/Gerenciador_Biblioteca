# Contribuindo para o Gerenciador Biblioteca

Obrigado por interesse em contribuir! Este documento descreve como participar do desenvolvimento.

## Pré-requisitos

- Java 21
- Node.js 18+
- Docker e Docker Compose
- Git

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/sandersonElias/Gerenciador_Biblioteca.git
cd Gerenciador_Biblioteca
```

2. Inicie o banco de dados:
```bash
docker-compose up -d postgres
```

3. Configure o backend:
```bash
cd Back-End
cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties
# Edite as credenciais conforme necessário
mvn spring-boot:run
```

4. Configure o frontend:
```bash
cd Front-End
npm install
cp .env.example .env.local
npm start
```

## Fluxo de Trabalho

1. Crie um branch para sua feature:
```bash
git checkout -b feature/nome-da-feature
```

2. Faça suas alterações seguindo os padrões do projeto

3. Execute os testes:
```bash
# Backend
cd Back-End
mvn test

# Frontend
cd Front-End
npm test
```

4. Faça commit com mensagens descritivas:
```bash
git commit -m "feat: adiciona nova funcionalidade de X"
```

5. Envie para o repositório:
```bash
git push origin feature/nome-da-feature
```

6. Abra um Pull Request

## Convenções de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/pt-BR/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação (não afeta lógica)
- `refactor:` refatoração
- `test:` adiciona ou corrige testes
- `chore:` tarefas de manutenção

Exemplos:
```
feat: adiciona sistema de notificações por email
fix: corrige cálculo de data de vencimento
docs: atualiza README com instruções de instalação
```

## Estrutura do Projeto

### Backend (Back-End/)
- `controller/` - Endpoints REST
- `service/` - Lógica de negócio
- `repository/` - Acesso a dados
- `entity/` - Entidades JPA
- `dto/` - Data Transfer Objects
- `security/` - Autenticação e autorização
- `config/` - Configurações

### Frontend (Front-End/)
- `src/features/` - Módulos por funcionalidade
- `src/components/` - Componentes reutilizáveis
- `src/services/` - Camada de API
- `src/context/` - Providers React

## Padrões de Código

### Java
- Use Lombok para reduzir boilerplate
- Valide dados com Jakarta Validation
- Escreva testes para services e controllers
- Siga o padrão Controller → Service → Repository

### TypeScript/React
- Use TypeScript estrito
- Siga o padrão MVVM (Model-View-ViewModel)
- Componentes funcionais com hooks
- Estilos com SCSS

## Pull Requests

- Uma feature por PR
- Inclua descrição clara das mudanças
- Adicione testes quando aplicável
- Atualize a documentação se necessário
- Certifique-se que todos os testes passam

## Issues

Ao reportar bugs, inclua:
1. Passos para reproduzir
2. Comportamento esperado
3. Comportamento atual
4. Ambiente (SO, navegador, versões)

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a MIT License.