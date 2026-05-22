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

#### 📱 Ambiente de Desenvolvimento
1. Navegue até a pasta `mobile/`:
```bash
cd mobile
```

2. Crie o arquivo `.env.development` com a URL do backend:
```env
# Para emulador Android
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080

# Para iOS Simulator (Mac)
# EXPO_PUBLIC_API_URL=http://localhost:8080

# Para dispositivo físico (na mesma rede)
# EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor de desenvolvimento:
```bash
# Para desenvolvimento rápido (Expo Go)
npx expo start

# Para Android
npx expo run:android

# Para iOS (Mac)
npx expo run:ios
```

#### 🏗️ Builds de Produção com EAS

Para gerar builds otimizados para produção:

1. **Configuração inicial (uma vez):**
```bash
# Login na conta Expo
npx eas-cli login

# Configurar projeto EAS
npx eas-cli init
```

2. **Build para Android:**
```bash
# Build de preview (teste interno)
npx eas-cli build --platform android --profile preview

# Build de produção
npx eas-cli build --platform android --profile production
```

3. **Build para iOS (requer Mac):**
```bash
# Build de preview
npx eas-cli build --platform ios --profile preview

# Build de produção
npx eas-cli build --platform ios --profile production
```

#### 🔧 Configurações Importantes

**EAS Build (`eas.json`):**
```json
{
  "cli": {
    "version": ">= 19.0.8",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Configuração Babel (`babel.config.js`):**
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
```

#### 🚨 Solução de Problemas Comuns

**Erro: "Cannot find module 'babel-preset-expo'"**
```bash
# Verifique se está instalado
npm ls babel-preset-expo

# Instale a versão correta
npm install babel-preset-expo@~54.0.10
```

**Erro: Assets não encontrados**
- Certifique-se que todos os arquivos referenciados em `require()` existem na pasta `assets/`
- Nomes devem ser exatos (Linux é case-sensitive)

**Cache persistente do EAS**
```bash
# Limpe o cache
npx eas-cli build --platform android --profile preview --clear-cache
```

#### 📦 Dependências Críticas
Certifique-se que estas versões estão corretas no `package.json`:
```json
"dependencies": {
  "@react-native-async-storage/async-storage": "2.2.0",
  "@react-native-community/netinfo": "11.4.1",
  "babel-plugin-module-resolver": "^5.0.0",
  "babel-preset-expo": "~54.0.10",
  "expo": "~54.0.33",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

#### 📱 Testando no Dispositivo Físico
1. Instale o app **Expo Go** na Play Store/App Store
2. Escaneie o QR code gerado por `npx expo start`
3. Para recursos nativos (Agora.io), use builds EAS

#### 🎯 Dicas de Performance
- Use `npx expo prebuild --clean` antes de builds importantes
- Configure variáveis de ambiente no EAS Console para builds de produção
- Use `--clear-cache` quando houver problemas persistentes

---

## 🔒 Variáveis de Ambiente & Segurança

### Backend (Spring Boot)
- `application.properties` - Configurações de banco, JWT, etc.
- **NUNCA** commit arquivos com credenciais reais

### Frontend Web (React + Vite)
- `.env` - URL da API, chaves públicas
- `.env.production` - Configurações de produção

### Mobile (React Native / Expo)
- `.env.development` - Desenvolvimento local
- `.env.production` - Produção (configurado no EAS Console)
- `app.config.ts` - Configurações do app (Expo)

**Variáveis críticas NUNCA no versionamento:**
- JWT Secrets
- Chaves de API do Google OAuth  
- Tokens do Agora.io
- RevenueCat SDK Keys
- Credenciais de banco de dados

**Configuração no EAS (produção):**
1. Acesse [Expo Dashboard](https://expo.dev)
2. Navegue até seu projeto
3. Em "Environment Variables" configure:
   - `EXPO_PUBLIC_API_URL` (URL do backend em produção)
   - `EXPO_PUBLIC_RC_APPLE` (RevenueCat Apple)
   - `EXPO_PUBLIC_RC_GOOGLE` (RevenueCat Google)
   - Tokens do Agora.io

### 🛡️ Boas Práticas de Segurança
1. Use variáveis de ambiente para todos os secrets
2. Configure `.gitignore` para excluir arquivos sensíveis
3. Use diferentes credenciais por ambiente (dev/staging/prod)
4. Revise permissões regularmente
5. Monitore logs de acesso

Todos os tokens **não devem ser incluídos no controle de versão**. Utilize sempre arquivos locais como `.env` e configure-os com segurança no seu serviço de nuvem/hospedagem no ambiente de Produção.

---
*Feito com propósito e dedicação para melhorar a saúde mental e expandir a acessibilidade ao suporte psicológico.* 💙
