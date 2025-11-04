# Guia de Integração: Backend Spring Boot com Frontend

Este documento fornece instruções completas para uma IA integrar o backend Spring Boot (ms-smartmanagement) com o frontend. O backend é uma API RESTful com autenticação JWT, suportando gerenciamento de usuários, empresas e outras funcionalidades.

## 1. Visão Geral da API

- **Base URL**: `http://localhost:8080/api`
- **Tecnologia**: Spring Boot 3.x, JWT Authentication
- **Banco de Dados**: H2 (desenvolvimento) ou PostgreSQL (produção)
- **Autenticação**: Stateless com JWT tokens
- **Content-Type**: `application/json` para todas as requisições

### Configuração Inicial
1. O backend roda na porta 8080 por padrão
2. Console H2: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`, user: `sa`, password: vazio)
3. Para iniciar: execute `mvn spring-boot:run` ou `./mvnw spring-boot:run` na pasta do projeto

## 2. Sistema de Autenticação

### Fluxo de Autenticação
1. **Registro**: POST `/api/auth/register` para criar conta
2. **Login**: POST `/api/auth/login` para obter token JWT  
3. **Requests Autenticados**: Incluir header `Authorization: Bearer <token>`
4. **Expiração**: Tokens expiram em 24h (configurável)

### Headers Obrigatórios
```javascript
// Para requests que enviam JSON
headers: {
  'Content-Type': 'application/json'
}

// Para requests autenticados
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

## 3. Endpoints da API

### 3.1 Autenticação (`/api/auth`)

#### POST `/api/auth/register` - Registrar Usuário
```javascript
// Request
{
  "name": "João Silva",
  "email": "joao@example.com", 
  "password": "senha123",
  "phone": "11999999999",
  "companyId": 1  // Opcional
}

// Response (200 OK)
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11999999999", 
  "role": "USER",
  "createdAt": "2025-11-04T15:00:00",
  "company": {
    "id": 1,
    "name": "Empresa X"
  }
}
```

#### POST `/api/auth/login` - Fazer Login
```javascript
// Request
{
  "email": "joao@example.com",
  "password": "senha123"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2FvQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk5MzYwODAwLCJleHAiOjE2OTk0NDcyMDB9...",
  "type": "Bearer"
}
```

### 3.2 Usuários (`/api/users`) - Requer Autenticação

#### GET `/api/users` - Listar Usuários
```javascript
// Response (200 OK)
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11999999999",
    "role": "USER", 
    "createdAt": "2025-11-04T15:00:00",
    "company": {
      "id": 1,
      "name": "Empresa X"
    }
  }
]
```

#### GET `/api/users/{id}` - Obter Usuário por ID
```javascript
// Response (200 OK) - mesmo formato da lista
// Response (404 Not Found) - usuário não existe
```

#### POST `/api/users` - Criar Usuário
```javascript
// Request
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha456", 
  "phone": "11888888888",
  "role": "ADMIN"
}

// Query params opcionais: ?companyId=1
// Response (200 OK) - usuário criado
```

#### PUT `/api/users/{id}` - Atualizar Usuário
```javascript  
// Request (campos opcionais para atualizar)
{
  "name": "João Silva Santos",
  "phone": "11777777777",
  "role": "ADMIN"
}

// Response (200 OK) - usuário atualizado
```

#### DELETE `/api/users/{id}` - Deletar Usuário
```javascript
// Response (204 No Content)
```

### 3.3 Empresas (`/api/companies`) - Requer Autenticação

#### GET `/api/companies` - Listar Empresas
```javascript
// Response (200 OK)
[
  {
    "id": 1,
    "name": "Empresa X",
    "email": "empresa@example.com",
    "cnpj": "12345678000123", 
    "phone": "1133333333",
    "address": "Rua A, 123"
  }
]
```

#### POST `/api/companies` - Criar Empresa
```javascript
// Request
{
  "name": "Nova Empresa",
  "email": "nova@empresa.com",
  "cnpj": "98765432000198",
  "phone": "1144444444", 
  "address": "Rua B, 456"
}

// Response (200 OK) - empresa criada
```

#### PUT `/api/companies/{id}` - Atualizar Empresa
```javascript
// Request (campos opcionais)
{
  "name": "Empresa Atualizada",
  "address": "Nova Rua C, 789"
}

// Response (200 OK) - empresa atualizada  
```

#### DELETE `/api/companies/{id}` - Deletar Empresa
```javascript
// Response (204 No Content)
```

## 4. Códigos de Status HTTP

- **200 OK**: Sucesso
- **201 Created**: Recurso criado
- **204 No Content**: Sucesso sem conteúdo (DELETE)
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Token inválido/expirado
- **403 Forbidden**: Sem permissão
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro no servidor

## 5. Implementação no Frontend

### 5.1 Gerenciamento de Token
```javascript
// Salvar token após login
localStorage.setItem('authToken', response.token);

// Recuperar token para requests
const token = localStorage.getItem('authToken');

// Remover token no logout
localStorage.removeItem('authToken');

// Verificar se usuário está logado
const isAuthenticated = () => !!localStorage.getItem('authToken');
```

### 5.2 Função de Request Base
```javascript
const API_BASE_URL = 'http://localhost:8080/api';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Redirect to login if unauthorized
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return;
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.status === 204 ? null : response.json();
};
```

### 5.3 Funções de Autenticação
```javascript
// Login
const login = async (email, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (response.token) {
    localStorage.setItem('authToken', response.token);
  }
  
  return response;
};

// Registro
const register = async (userData) => {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

// Logout
const logout = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};
```

### 5.4 Funções CRUD - Usuários
```javascript
// Listar usuários
const getUsers = async () => {
  return await apiRequest('/users');
};

// Obter usuário por ID
const getUser = async (id) => {
  return await apiRequest(`/users/${id}`);
};

// Criar usuário
const createUser = async (userData) => {
  return await apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

// Atualizar usuário  
const updateUser = async (id, userData) => {
  return await apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
};

// Deletar usuário
const deleteUser = async (id) => {
  return await apiRequest(`/users/${id}`, {
    method: 'DELETE'
  });
};
```

### 5.5 Funções CRUD - Empresas  
```javascript
// Listar empresas
const getCompanies = async () => {
  return await apiRequest('/companies');
};

// Criar empresa
const createCompany = async (companyData) => {
  return await apiRequest('/companies', {
    method: 'POST',
    body: JSON.stringify(companyData)
  });
};

// Atualizar empresa
const updateCompany = async (id, companyData) => {
  return await apiRequest(`/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(companyData)
  });
};

// Deletar empresa
const deleteCompany = async (id) => {
  return await apiRequest(`/companies/${id}`, {
    method: 'DELETE'
  });
};
```

## 6. Exemplo de Integração Completa (React)

### 6.1 Hook de Autenticação
```javascript
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verificar se token é válido fazendo uma request
      apiRequest('/users/me')
        .then(setUser)
        .catch(() => localStorage.removeItem('authToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      // Buscar dados do usuário após login
      const userData = await apiRequest('/users/me');
      setUser(userData);
    }
    
    return response;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 6.2 Componente de Lista de Usuários
```javascript
import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Usuários</h2>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.role}</p>
          <button onClick={() => handleDelete(user.id)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
};
```

## 7. Tratamento de Erros

### 7.1 Interceptador de Erros Global
```javascript
const handleApiError = (error) => {
  if (error.status === 401) {
    // Token inválido
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  } else if (error.status === 403) {
    // Sem permissão
    alert('Você não tem permissão para esta ação');
  } else if (error.status === 404) {
    // Não encontrado
    alert('Recurso não encontrado');
  } else {
    // Erro genérico
    alert('Ocorreu um erro. Tente novamente.');
  }
};
```

## 8. Considerações Importantes

### 8.1 CORS
O backend já está configurado para aceitar requests do frontend. Se houver problemas de CORS, verifique a configuração no `SecurityConfig.java`.

### 8.2 Validação
- Sempre validar dados no frontend antes de enviar
- O backend também valida e retorna erros 400 para dados inválidos

### 8.3 Performance  
- Implementar loading states durante requests
- Cache dados quando apropriado
- Usar debounce em campos de busca

### 8.4 Segurança
- Nunca armazenar senhas em localStorage
- Validar permissões no frontend (além da validação do backend)
- Implementar timeout para tokens expirados

## 9. Expansão Futura

Quando implementar novos recursos (produtos, vendas, etc.), seguir o mesmo padrão:

1. **Endpoints**: `/api/products`, `/api/sales`
2. **Métodos HTTP**: GET (listar), POST (criar), PUT (atualizar), DELETE (deletar)
3. **Autenticação**: Mesmo sistema de JWT
4. **Estrutura**: Mesmas convenções de request/response

### Exemplo para Produtos (futuro):
```javascript
// GET /api/products
const getProducts = async () => {
  return await apiRequest('/products');
};

// POST /api/products  
const createProduct = async (productData) => {
  return await apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
};
```

## 10. Debugging

### 10.1 Console H2
Para verificar dados no banco durante desenvolvimento:
- Acesse: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- User: `sa`
- Password: (vazio)

### 10.2 Logs do Backend
O backend loga informações no console. Para debug mais detalhado, adicione em `application.properties`:
```
logging.level.io.github.joaovmundel.mssmartmanagement=DEBUG
```

Este guia fornece tudo necessário para integrar o backend Spring Boot com qualquer frontend. Para dúvidas específicas, consulte os logs do servidor ou teste os endpoints diretamente com ferramentas como Postman ou curl.
