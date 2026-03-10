# Cedro - Apoio Psicológico

Plataforma de apoio psicológico com React e Spring Boot.

## Funcionalidades

- Autenticação JWT + Google OAuth
- Perfis: Paciente, Psicólogo, Admin
- Agendamento de sessões
- Lista de psicólogos
- Dashboard do psicólogo
- Chat de emergência
- Modo escuro
- Recuperação de senha
- Responsivo

## Como rodar

### Precisa ter
- Node.js 16+
- npm

### Instalação
```bash
npm install

# Frontend (porta 3000)
npm run dev

# Backend (porta 3001)
cd backend/cedro-backend
run.bat  # Windows
./mvnw spring-boot:run  # Linux/Mac
```

### Scripts
- `npm run dev` - Dev server
- `npm run build` - Build produção
- `npm run preview` - Preview build

## Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Bootstrap 5
- Bootstrap Icons
- Axios

### Backend
- Spring Boot 3.5.7
- Spring Security
- Spring Data JPA
- JWT Authentication
- SQL Server
- Maven

## Deploy

- Frontend: https://cedro-eight.vercel.app
- Backend: https://cedro-backend-tsyg.onrender.com

## Estrutura
```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (Auth, etc)
├── pages/          # Páginas da aplicação
├── styles/         # Arquivos de estilo
├── App.jsx         # Componente principal
└── main.jsx        # Ponto de entrada

backend/cedro-backend/
├── src/main/java/com/cedro/
│   ├── controller/     # Controllers REST
│   ├── service/        # Lógica de negócio
│   ├── repository/     # Repositórios JPA
│   ├── model/          # Entidades e DTOs
│   ├── config/         # Configurações
│   └── security/       # Segurança JWT
├── .env            # Variáveis de ambiente
└── pom.xml         # Dependências Maven
```

## Segurança

- Configure suas credenciais no `.env`
- Use senhas fortes
- HTTPS em produção
- Mantenha dependências atualizadas