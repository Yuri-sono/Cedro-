# 🌳 Cedro Plus

**Cedro Plus** é uma plataforma inovadora voltada para a saúde mental, desenhada para conectar **Pacientes** e **Psicólogos** de forma segura, fluida e eficiente. O ecossistema abrange uma aplicação Web robusta para gestão, um aplicativo Mobile focado no paciente, e um Backend unificado servindo como a fonte da verdade para toda a arquitetura.

---

## 🏛️ Arquitetura do Sistema

O sistema é construído sobre uma arquitetura **Centralizada baseada em API**, garantindo que todas as interfaces (Web e Mobile) consumam a mesma camada de segurança, regras de negócios e persistência.

* **Backend Central (A Fonte da Verdade)**: Desenvolvido em Spring Boot (Java), ele expõe endpoints REST para dados transacionais e um servidor WebSocket (STOMP) para a mensageria em tempo real.
* **Banco de Dados**: Microsoft SQL Server hospedado remotamente, sendo o único repositório de persistência de usuários, sessões, chat e métricas.
* **Cliente Web (Admin/Psicólogos)**: SPA desenvolvida em React + Vite.
* **Cliente Mobile (Pacientes)**: Aplicativo híbrido desenvolvido com React Native (Expo SDK).

```mermaid
graph TD
    A[📱 App Mobile (React Native / Expo)] -->|REST / JWT| C((⚙️ Backend Central - Spring Boot))
    A -->|STOMP / WebSocket| C
    A -->|Telemetria / RTC Tokens| D[📞 Agora.io SDK]
    A -->|Verificação Nativa| F[💳 RevenueCat SDK]
    
    B[💻 Portal Web (React + Vite)] -->|REST / JWT| C
    
    C -->|Persistência| E[(🗄️ SQL Server)]
    F -.->|Webhooks de Assinatura| C
```

---

## 🚀 Principais Tecnologias e Funcionalidades

### 1. Backend (Spring Boot 3)
* **Segurança**: Autenticação unificada via **JWT** (JSON Web Tokens). Endpoints mapeados para `Paciente`, `Psicologo` e `Admin`.
* **Mensageria Realtime**: Spring WebSockets acoplado ao protocolo **STOMP** para viabilizar o chat bidirecional em tempo real (substituindo lógicas onerosas de polling).
* **Gestão de Sessões**: Rotinas para agendamento, controle de status das sessões, e apuração de pagamentos.

### 2. Frontend Web (React + Vite)
* **Gestão de Perfil**: Painel do psicólogo para gestão de biografia, CRP, especialidades e valor das sessões.
* **Dashboard de Agendamentos**: Visualização das consultas marcadas.
* **Estilização**: Uso de design system com tokens bem definidos, focando em performance.

### 3. Mobile (React Native / Expo)
* **Motor RTC Nativo**: Integração direta com `react-native-agora` para realizar **Chamadas de Voz e Vídeo** de alta resolução e baixa latência dentro do próprio app. O acesso aos canais é orquestrado pelos tokens emitidos pelo Spring Boot.
* **Assinatura Premium In-App**: Integração transparente com a App Store e Google Play através do **RevenueCat**, desbloqueando cotas ilimitadas de chamadas, enquanto a regra do "limite mensal" continua assegurada pelo backend (SQL Server).
* **Notificações Push**: Registradas nativamente via Expo Notifications.
* **Gestão de Estado Robusta**: Uso intensivo de Zustand e TanStack Query (React Query) para sincronização e cache eficiente da UI com as respostas do servidor.

---

## 🛠️ Como Rodar Localmente

### 1. Clonando o Repositório
```bash
git clone https://github.com/Kayquebrigadeiro/Cedroplus.git
cd Cedroplus
```

### 2. Configurando o Backend (Spring Boot)
1. Certifique-se de ter o **Java 17+** e o Maven instalados.
2. Navegue até a pasta `backend/cedro-backend` (ou o respectivo diretório do Spring).
3. O projeto utiliza um banco remoto (`CedroDB.mssql.somee.com`), mas pode ser testado em um SQL Server local. Verifique o `application.properties`.
4. Inicie o servidor:
```bash
mvn spring-boot:run
```
> O backend rodará na porta `8080` (ex: `http://localhost:8080`).

### 3. Configurando o Frontend (Web)
1. Navegue até a pasta do frontend.
2. Crie seu arquivo `.env` referenciando a API local: `VITE_API_URL=http://localhost:8080`
3. Instale e execute:
```bash
npm install
npm run dev
```

### 4. Configurando o Mobile (App)
1. Navegue até a pasta `mobile/`.
2. Crie o arquivo `.env.development` com a URL apontando para a sua máquina (*Ex: Se for no emulador Android, a ponte pro localhost é `10.0.2.2`*):
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```
3. Instale as dependências:
```bash
npm install
```
4. Gere a Build Nativa para simular o motor de chamadas do Agora.io (*o Expo Go tradicional não executa código nativo modificado*):
```bash
npx expo run:android
# ou, se quiser testar no iOS via Mac: npx expo run:ios
```

---

## 🔒 Variáveis de Ambiente & Segurança
Todos os tokens (JWT Secrets, Chaves de API do Google OAuth, Tokens do Agora.io e RevenueCat SDK Keys) **não devem ser incluídos no controle de versão**. Utilize sempre arquivos locais como `.env` e configure-os com segurança no seu serviço de nuvem/hospedagem no ambiente de Produção.

---
*Feito com propósito e dedicação para melhorar a saúde mental e expandir a acessibilidade ao suporte psicológico.* 💙
