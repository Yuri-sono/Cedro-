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

## Chamadas de voz

O chat usa WebRTC para ligação de voz. Em redes simples, o STUN público já funciona. Para funcionar bem em redes restritas, configure um TURN no backend:

### Metered

```env
TURN_METERED_DOMAIN=seu-app.metered.live
TURN_METERED_SECRET_KEY=sua-secret-key
```

### Coturn com secret compartilhado

```env
TURN_URLS=turn:seu-dominio.com:3478?transport=udp,turn:seu-dominio.com:3478?transport=tcp,turns:seu-dominio.com:5349?transport=tcp
TURN_SHARED_SECRET=segredo-rest-api-do-coturn
```

Se o seu provedor não tiver secret temporário, também funciona com credencial fixa:

```env
TURN_URLS=turn:seu-dominio.com:3478?transport=udp,turns:seu-dominio.com:5349?transport=tcp
TURN_USERNAME=usuario-turn
TURN_CREDENTIAL=senha-turn
```

Prefira `TURN_SHARED_SECRET` quando usar coturn, porque o backend gera credenciais temporárias para usuários autenticados.
