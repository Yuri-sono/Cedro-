# Cedro Backend - Spring Boot

API REST para o sistema de apoio psicológico Cedro.

## 🚀 Execução

```bash
# Configurar .env
cp .env.example .env
# Editar .env com suas credenciais

# Executar
# Windows:
run.bat

# Linux/Mac:
./mvnw spring-boot:run
```

## 📋 Endpoints

- `GET /` - Status da API
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Cadastro

## 🛠️ Tecnologias

- Spring Boot 3.5.6
- Spring Security + JWT
- Spring Data JPA
- SQL Server
- Maven