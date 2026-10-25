# Backup do Banco de Dados

Este documento descreve como realizar backups do banco de dados PostgreSQL utilizado pelo sistema Biblioteca Monsa.

## Ambiente de Produção (Render)

O PostgreSQL free do Render expira em 30 dias e não deve ser tratado como
armazenamento permanente. Confirme no dashboard quais backups automáticos estão
disponíveis no seu plano.

### Backup Manual com a Connection String do Render

1. No Render, abra o banco `biblioteca-monsa-db`.
2. Copie a **External Connection String**.
3. Execute o dump localmente:

```bash
pg_dump "postgresql://usuario:senha@host:5432/gerenciador_biblioteca?sslmode=require" \
  --no-owner --no-privileges \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

> Para uma demo de portfólio, recrie o banco e o seed ao final dos 30 dias do
> plano free. Não armazene dados reais nesse ambiente.

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
docker exec biblioteca-db pg_dump -U postgres gerenciador_biblioteca > backup.sql

# Restauração
cat backup.sql | docker exec -i biblioteca-db psql -U postgres gerenciador_biblioteca
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