# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- Configuração de cache com Caffeine para endpoints de leitura
- Rate limiting interceptor (60 requisições/minuto por IP)
- Logging estruturado de requests com duração e IP
- Spring Boot Actuator para health checks e métricas
- GitHub Actions CI/CD pipelines para backend e frontend
- Testes unitários para TokenService
- Testes de integração para LivroController
- Testes de componentes React (Button, Input)
- Docker Compose para desenvolvimento local
- Documentação de backup do banco de dados

### Changed
- Externalização de secrets (JWT_SECRET, DB_PASSWORD) para variáveis de ambiente
- Substituição de `ex.printStackTrace()` por SLF4J logging
- README do Front-End atualizado com documentação específica

### Fixed
- Inconsistência de nomenclatura: pasta `componentes` renomeada para `components`
- `.gitignore` raiz atualizado com padrões abrangentes

### Security
- Removido `.env.local` do tracking do git (contém token OIDC)
- Criado `.env.example` para documentação de variáveis de ambiente
- Swagger desabilitado em produção por padrão

## [1.1.0] - 2026-07-11

### Added
- Sistema completo de gerenciamento bibliotecário
- Backend: Java 21 + Spring Boot 3.5.11
- Frontend: React 18 + TypeScript
- Autenticação JWT com 4 perfis de acesso
- Controle de empréstimos, reservas e renovações
- Relatórios e dashboards com Chart.js
- Deploy: Railway (backend) + Vercel (frontend)