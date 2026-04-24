# 📡 Guia de Integração com API

## Configuração Base

O arquivo `src/services/api.ts` contém toda a configuração de comunicação com o backend.

### Axios Instance

```typescript
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## Interceptors

### Request Interceptor
Adiciona automaticamente o token JWT em todas as requisições:

```typescript
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

### Response Interceptor
Trata erros 401 (não autorizado) redirecionando para login e limpando o storage:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Serviços Disponíveis

### Auth API
```typescript
// Login - retorna token JWT
authApi.login({ email, password }): Promise<string>

// Registrar usuário (apenas admin)
authApi.register(userData): Promise<UserResponse>
```

### User API
```typescript
// Buscar usuários por nome (para autocomplete em formulários)
userApi.getUserName(name): Promise<UserResponse[]>
```

### Livro API
```typescript
// Listar todos os livros
livroApi.getAll(): Promise<Livro[]>

// Buscar por ID
livroApi.getById(id): Promise<Livro>

// Buscar com filtros
livroApi.searchByFilter(filter, term): Promise<Livro[]>
// filter: 'titulo' | 'autor' | 'genero' | 'catalogacao'

// Livros mais populares
livroApi.getPopulares(limite): Promise<Livro[]>

// CRUD (apenas admin)
livroApi.create(livro): Promise<Livro>
livroApi.update(id, livro): Promise<Livro>
livroApi.delete(id): Promise<void>
```

### Autor API
```typescript
// Criar autor (admin)
autorApi.create(autor): Promise<AutorResponse>

// Buscar autores por nome (para autocomplete)
autorApi.getByAutor(autor): Promise<AutorResponse[]>
```

### Gênero API
```typescript
// Criar gênero (admin)
generoApi.create(genero): Promise<GeneroResponse>

// Buscar gêneros por nome (para autocomplete)
generoApi.getByGenero(genero): Promise<GeneroResponse[]>
```

### Catalogação API
```typescript
// Criar catalogação CDD (admin)
catalogacaoApi.create(catalogacao): Promise<CatalogacaoResponse>

// Buscar catalogações por nome (para autocomplete)
catalogacaoApi.getByCatalogacao(catalogacao): Promise<CatalogacaoResponse[]>
```

### Exemplar API
```typescript
// Listar todos os exemplares de um livro
exemplarApi.listarPorLivro(livroId): Promise<Exemplar[]>

// Listar apenas os exemplares disponíveis
exemplarApi.listarDisponiveisPorLivro(livroId): Promise<Exemplar[]>

// Obter sugestão de exemplar disponível (para autocomplete no empréstimo)
exemplarApi.sugerirExemplar(livroId): Promise<Exemplar>

// Adicionar exemplares manualmente (admin)
exemplarApi.adicionarExemplares(livroId, quantidade): Promise<Exemplar[]>
```

### Empréstimo API
```typescript
// Listar todos (funcionário+)
emprestimoApi.getAll(): Promise<EmprestimoResponse[]>

// Buscar por ID
emprestimoApi.getById(id): Promise<EmprestimoResponse>

// Criar empréstimo
emprestimoApi.create(emprestimo): Promise<EmprestimoResponse>

// Renovar empréstimo
emprestimoApi.renovar(id): Promise<EmprestimoResponse>

// Devolver livro
emprestimoApi.devolver(id): Promise<void>

// Buscar por nome do usuário
emprestimoApi.searchByUser(nome): Promise<EmprestimoResponse[]>

// Buscar por título do livro
emprestimoApi.searchByLivro(titulo): Promise<EmprestimoResponse[]>

// Buscar por status
emprestimoApi.searchByStatus(status): Promise<EmprestimoResponse[]>
// status: StatusEmprestimo enum

// Buscar devoluções de uma data específica (formato YYYY-MM-DD)
emprestimoApi.getDevolucoesDoDia(data): Promise<EmprestimoResponse[]>
```

### Meus Empréstimos API (perfil do aluno)
```typescript
// Retorna empréstimo ativo + histórico do usuário pelo email
meusEmprestimosApi.getMeusEmprestimos(email): Promise<MeusEmprestimosResponse>

// MeusEmprestimosResponse:
// {
//   emprestimosAtivo: EmprestimosAtivoDto | null,
//   historico: EmprestimoHistoricoDto[]
// }
```

### Reserva API
```typescript
// Listar todas (funcionário+)
reservaApi.getAll(): Promise<ReservaResponse[]>

// Reservas do usuário por email (aluno+)
reservaApi.getReservaEmail(email): Promise<ReservaResponse[]>

// Criar reserva
reservaApi.create(reserva): Promise<ReservaResponse>

// Cancelar reserva
reservaApi.cancelar(reservaId): Promise<void>

// Buscar reservas por livro
reservaApi.getByLivro(livroId): Promise<ReservaResponse[]>
```

### Solicitação de Renovação API
```typescript
// Aluno solicita renovação de um empréstimo
solicitacaoRenovacaoApi.solicitar(emprestimoId, email): Promise<SolicitacaoRenovacaoResponse>

// Listar solicitações pendentes (funcionário+)
solicitacaoRenovacaoApi.getPendentes(): Promise<SolicitacaoPendenteDto[]>

// Aprovar solicitação (funcionário+)
solicitacaoRenovacaoApi.aprovar(id, email): Promise<void>

// Rejeitar solicitação com observação opcional (funcionário+)
solicitacaoRenovacaoApi.rejeitar(id, email, observacao?): Promise<void>
```

## Exemplos de Uso

### Buscar Livros
```typescript
import { livroApi } from '@/services/api';

// Buscar por título
const books = await livroApi.searchByFilter('titulo', 'Harry Potter');

// Buscar por autor
const books = await livroApi.searchByFilter('autor', 'J.K. Rowling');
```

### Criar Empréstimo
```typescript
import { emprestimoApi } from '@/services/api';

const newLoan = await emprestimoApi.create({
  exemplarId: 10,
  userEmail: 'aluno@monsa.com'
});
```

### Meu Perfil — Empréstimos do Aluno
```typescript
import { meusEmprestimosApi } from '@/services/api';

const { emprestimosAtivo, historico } = await meusEmprestimosApi.getMeusEmprestimos('aluno@monsa.com');
```

### Gerenciar Reservas
```typescript
import { reservaApi } from '@/services/api';

// Fazer reserva
const reservation = await reservaApi.create({ livroId: 123 });

// Cancelar reserva
await reservaApi.cancelar(456);
```

### Solicitar Renovação
```typescript
import { solicitacaoRenovacaoApi } from '@/services/api';

await solicitacaoRenovacaoApi.solicitar(emprestimoId, 'aluno@monsa.com');
```

## Tratamento de Erros

### Estrutura de Erro
```typescript
interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

### Exemplo de Tratamento
```typescript
try {
  const data = await livroApi.create(bookData);
} catch (error: any) {
  if (error.response) {
    // Erro da API (4xx, 5xx)
    const message = error.response.data?.message || 'Erro desconhecido';
    console.error('API Error:', message);
  } else if (error.request) {
    // Sem resposta do servidor
    console.error('Network Error');
  } else {
    // Erro na configuração
    console.error('Error:', error.message);
  }
}
```

## Autenticação

### Login
```typescript
const token = await authApi.login({
  email: 'user@example.com',
  password: 'senha123'
});

// Token é armazenado automaticamente pelo AuthContext
```

### Verificar Autenticação
```typescript
import { useAuth } from '@/context/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, user, hasAnyRole } = useAuth();

  if (isAuthenticated) {
    console.log('Usuário:', user.name);
    console.log('É admin?', hasAnyRole(['ROLE_ADMIN']));
  }
};
```

## Configuração de CORS

Para desenvolvimento, adicione no `package.json`:

```json
{
  "proxy": "http://localhost:8080"
}
```

Ou configure o CORS no backend para aceitar requisições do frontend.

## Testando a API

Você pode testar os endpoints usando:

1. **Browser DevTools** - Network tab
2. **Postman/Insomnia** - Coleção de requisições
3. **Swagger UI** - `http://localhost:8080/swagger-ui.html`

Exemplo com curl:
```bash
# Login
curl -X POST http://localhost:8080/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@monsa.com","password":"123"}'

# Listar livros (com token)
curl http://localhost:8080/livro/todos \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Dicas

1. **Sempre use try/catch** ao chamar APIs
2. **Utilize o hook useLoading** para mostrar loading states
3. **Use o hook useToast** para feedback ao usuário
4. **Valide dados no frontend** antes de enviar para a API
5. **Reutilize os serviços** - não crie novas instâncias de axios

## Troubleshooting

### Erro 401 Unauthorized
- Token expirado ou inválido
- Usuário não tem permissão para o recurso

### Erro 403 Forbidden
- Usuário autenticado mas sem permissão (ex: aluno tentando acessar área de admin)

### Erro 404 Not Found
- Recurso não existe
- URL incorreta

### Erro 500 Internal Server Error
- Erro no backend
- Verifique os logs do servidor

### Network Error
- Backend não está rodando
- Problema de conexão
- CORS não configurado
