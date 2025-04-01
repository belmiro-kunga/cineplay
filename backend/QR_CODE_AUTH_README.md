# Autenticação com QR Code

Este documento descreve a implementação do sistema de autenticação via QR Code para o backend CinePlay.

## Visão Geral

O sistema permite que um usuário se autentique através de um QR Code temporário que expira após 5 minutos. O fluxo básico é:

1. O frontend solicita a geração de um QR Code para um determinado usuário
2. O backend gera um QR Code único e o armazena temporariamente no Redis
3. O frontend exibe o QR Code para o usuário escanear
4. Após a verificação do QR Code, o backend retorna um token JWT válido

## Endpoints disponíveis

### Gerar QR Code

```
POST /auth/qrcode/generate
```

Body:
```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000"
}
```

Resposta:
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "token": "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
  "expiresIn": 300
}
```

O `qrCode` é uma string base64 que pode ser exibida diretamente como uma imagem.
O `token` é um identificador único para este QR Code.
O `expiresIn` é o tempo de validade do QR Code em segundos (5 minutos).

### Validar QR Code

```
POST /auth/qrcode/validate
```

Body:
```json
{
  "token": "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890"
}
```

Resposta:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com",
    "name": "Usuário Exemplo",
    "isAdmin": false
  }
}
```

### Verificar Status do QR Code

```
GET /auth/qrcode/status/:token
```

Resposta:
```json
{
  "valid": true,
  "message": "QR Code válido"
}
```

ou

```json
{
  "valid": false,
  "message": "QR Code inválido ou expirado"
}
```

## Implementação Técnica

A implementação utiliza as seguintes tecnologias:

- Redis para armazenamento temporário (expiração de 5 minutos)
- Biblioteca `qrcode` para geração do QR Code em formato de URL de dados
- Biblioteca `speakeasy` para geração de segredos OTP
- UUID para geração de tokens únicos

## Fluxo de Autenticação Sugerido (Frontend)

1. **Na aplicação que gera o QR Code:**
   - Chame o endpoint `/auth/qrcode/generate` com o ID do usuário
   - Exiba o QR Code retornado
   - Inicie um polling no endpoint `/auth/qrcode/status/:token` a cada 2-3 segundos

2. **Na aplicação que valida o QR Code (ex: aplicativo móvel):**
   - Escaneie o QR Code
   - Envie o token para o endpoint `/auth/qrcode/validate`
   - Use o token JWT retornado para autenticar o usuário

3. **Após validação bem-sucedida:**
   - A aplicação que exibe o QR Code detectará que o código foi validado através do polling
   - O usuário será redirecionado para a aplicação principal já autenticado 