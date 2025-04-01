# Documentação de Gerenciamento de Usuários

Este documento descreve os endpoints disponíveis para gerenciamento de usuários na API do CinePlay.

## Níveis de Acesso (Perfis)

A API suporta os seguintes níveis de acesso (roles):

- **ADMIN**: Acesso total ao sistema, pode gerenciar outros usuários
- **SUBSCRIBER**: Usuário assinante, com acesso ao conteúdo premium
- **FREE_USER**: Usuário gratuito, com acesso limitado ao conteúdo
- **CONTENT_MANAGER**: Pode gerenciar conteúdo, mas não tem permissões administrativas completas

## Endpoints

### Criar Usuário

```
POST /users
```

Acesso: Somente ADMIN

Body:
```json
{
  "name": "Nome do Usuário",
  "email": "email@exemplo.com",
  "password": "senha123",
  "role": "subscriber",
  "isAdmin": false,
  "profilePicture": "https://example.com/photo.jpg",
  "isEmailVerified": false
}
```

### Listar Todos os Usuários

```
GET /users
```

Acesso: ADMIN, CONTENT_MANAGER

### Buscar Usuário Específico

```
GET /users/:id
```

Acesso: Qualquer usuário autenticado (usuários não-admin só podem ver seu próprio perfil)

### Atualizar Usuário

```
PATCH /users/:id
```

Acesso: Qualquer usuário autenticado (usuários não-admin só podem atualizar seu próprio perfil)

Body (todos os campos são opcionais):
```json
{
  "name": "Novo Nome",
  "email": "novo_email@exemplo.com",
  "password": "nova_senha",
  "profilePicture": "https://example.com/nova_foto.jpg"
}
```

### Alterar Perfil (Role) de Usuário

```
PATCH /users/:id/role
```

Acesso: Somente ADMIN

Body:
```json
{
  "role": "subscriber"
}
```

### Alterar Status de Admin

```
PATCH /users/:id/admin-status
```

Acesso: Somente ADMIN

Body:
```json
{
  "isAdmin": true
}
```

### Excluir Usuário

```
DELETE /users/:id
```

Acesso: Somente ADMIN

## Estrutura de Dados do Usuário

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Nome do Usuário",
  "email": "email@exemplo.com",
  "isAdmin": false,
  "role": "subscriber",
  "profilePicture": "https://example.com/photo.jpg",
  "isEmailVerified": false,
  "lastLogin": "2023-04-01T12:00:00Z",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-04-01T12:00:00Z"
}
```

## Notas

- Os campos `password` nunca são retornados nas respostas da API
- Quando um usuário recebe o perfil `ADMIN`, o campo `isAdmin` é automaticamente definido como `true`
- Da mesma forma, quando o campo `isAdmin` é definido como `true`, o perfil é automaticamente atualizado para `ADMIN` 