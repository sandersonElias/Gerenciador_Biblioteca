# Backup do Banco de Dados

Este documento descreve como realizar backups do banco de dados PostgreSQL utilizado pelo sistema Biblioteca Monsa.

## Ambiente de Produção (Railway)

O Railway oferece backups automáticos para bancos de dados PostgreSQL. Para configurar:

1. Acesse o painel do Railway
2. Selecione o serviço de banco de dados
3. Vá para a aba "Settings"
4. Em "Backups", configure:
   - Frequência: Diária
   - Retenção: 7 dias (mínimo recomendado)

### Backup Manual via Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Conectar ao projeto
railway link

# Dump do banco
railway run pg_dump -U postgres gerenciador_biblioteca > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Ambiente Local

### Backup

```bash
pg_dump -U postgres gerenciador_biblioteca > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restauração

```bash
# Criar banco se não existir
createdb -U postgres gerenciador_biblioteca

# Restaurar
psql -U postgres gerenciador_biblioteca < backup.sql
```

### Usando Docker Compose

```bash
# Backup
docker exec biblioteca-postgres pg_dump -U postgres gerenciador_biblioteca > backup.sql

# Restauração
cat backup.sql | docker exec -i biblioteca-postgres psql -U postgres gerenciador_biblioteca
```

## Backup Automatizado (Local)

Para backups automáticos no ambiente local, crie um cron job:

```bash
# Editar crontab
crontab -e

# Adicionar linha para backup diário às 2h da manhã
0 2 * * * pg_dump -U postgres gerenciador_biblioteca > /backups/backup_$(date +\%Y\%m\%d).sql
```

## Verificação de Integridade

Após um backup, verifique a integridade:

```bash
# Verificar se o arquivo não está vazio
ls -lh backup.sql

# Verificar se contém tabelas esperadas
grep -c "CREATE TABLE" backup.sql

# Testar restauração em banco temporário
createdb -U postgres test_restore
psql -U postgres test_restore < backup.sql
dropdb -U postgres test_restore
```

## Retenção de Backups

Recomendações:
- **Produção**: Manter backups diários por 30 dias, semanais por 3 meses
- **Desenvolvimento**: Manter backups semanais por 1 mês

## Restore em Emergência

Se precisar restaurar o banco de produção:

1. **Faça um backup do estado atual** (mesmo que corrompido)
2. **Pare a aplicação** (se possível)
3. **Restaure o backup**
4. **Execute as migrations** se necessário: `mvn flyway:migrate`
5. **Verifique a integridade** dos dados
6. **Reinicie a aplicação**