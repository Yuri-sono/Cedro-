# 🔄 Alterações Realizadas — Cedro

**Data:** 25/08/2026
**Escopo:** Frontend (React) e Backend (Spring Boot)

---

## 1. 🎨 Tela de Psicólogos — Layout totalmente melhorado

Arquivo principal: `frontend/src/pages/ListaPsicologos.jsx`
Novo estilo: `frontend/src/styles/lista-psicologos.css`

### O que mudou na tela `/psicologos`:

- **Hero/banner de destaque** com gradiente verde (padrão visual Cedro) e frases de acolhimento;
- **Barra de busca** em tempo real por nome, especialidade ou palavra-chave da bio;
- **Filtro por especialidade** (gerado dinamicamente a partir dos psicólogos cadastrados);
- **Ordenação**: por relevância (avaliação), melhor avaliado, menor preço e maior preço;
- **Contador de resultados** ("X profissional(is) encontrado(s)");
- **Cards totalmente repaginados**:
  - Avatar circular com foto do profissional (ou ícone padrão);
  - Nome em destaque;
  - Avaliação com estrelas preenchidas + nota numérica;
  - Chip de especialidade/abordagem (ex.: Terapia Cognitivo-Comportamental);
  - Badge de disponibilidade **"Atende hoje"** (verde) ou **"Conferir agenda"** (amarelo), calculado pelo dia da semana cadastrado;
  - Dias de atendimento exibidos como pílulas (o dia atual fica destacado em verde);
  - Horários de atendimento (até 3, com indicativo "…" quando houver mais);
  - Descrição da bio com truncamento elegante;
  - Valor da sessão em destaque verde;
  - Botões **"Agendar Sessão"** (gradiente verde) e **"Conversar com psicólogo"** (contorno);
- **Skeleton loading** animado durante o carregamento dos dados (substitui o spinner genérico);
- **Estado vazio melhorado** com botão "Limpar filtros" quando a busca não encontra resultados;
- Compatibilidade com **tema escuro** (todas as novas classes têm variação `[data-theme="dark"]`);
- **Acessibilidade**: animações respeitam `prefers-reduced-motion`, responsividade para mobile (576px e abaixo).

---

## 2. 👨‍💼 Novo ADMIN criado

Arquivo: `backend/cedro-backend/src/main/java/com/cedro/config/DemoPsychologistSeeder.java`

Adicionado o método `createAdminDemo()`, executado automaticamente na inicialização do backend. Se o e-mail ainda não existir no banco, o administrador é criado:

| Campo | Valor |
|---|---|
| **E-mail** | `admin@cedro.app` |
| **Senha** | `Admin@2026` |
| **Nome** | Administrador Cedro |
| **Tipo** | `admin` |

### Como usar:
1. Suba o backend (ele cria o admin sozinho na primeira execução);
2. Acesse `/admin/login` (ou o link **"Área Administrativa"** no menu);
3. Entre com `admin@cedro.app` / `Admin@2026`;
4. Você será redirecionado ao `/admin/dashboard`.

> ⚠️ A senha é armazenada com hash **BCrypt** — nunca é salva em texto puro.
> Alterar a senha diretamente no banco ou usar a tela de alterar senha mantém o padrão de segurança.

---

## 3. 🧭 Melhorias gerais no site

- **Menu (Navbar)** — adicionado link **"Área Administrativa"** no menu lateral (quando deslogado), dando acesso rápido ao login do admin;
  - Arquivo: `frontend/src/components/Navbar.jsx`
- **Painel Administrativo de Usuários** (`/admin/usuarios`) — adicionado breadcrumb "Dashboard / Administração" para facilitar a navegação de volta ao painel;
  - Arquivo: `frontend/src/pages/AdminUsuarios.jsx`

---

## 4. 📄 Arquivos alterados/criados

| Arquivo | Ação |
|---|---|
| `frontend/src/pages/ListaPsicologos.jsx` | Reescrito (novo layout) |
| `frontend/src/styles/lista-psicologos.css` | **Criado** (estilos novos) |
| `frontend/src/App.jsx` | Import do novo CSS |
| `frontend/src/components/Navbar.jsx` | Link "Área Administrativa" |
| `frontend/src/pages/AdminUsuarios.jsx` | Breadcrumb de navegação |
| `backend/.../config/DemoPsychologistSeeder.java` | Seeder do admin |

---

## 5. ✅ Como validar

```bash
# Frontend
cd frontend
npm run dev        # acesse /psicologos

# Backend (na primeira execução cria o admin)
cd backend/cedro-backend
mvn spring-boot:run
```

Testes sugeridos:
- Buscar por nome/especialidade na tela de psicólogos;
- Filtrar por especialidade e ordenar por preço/avaliação;
- Conferir o badge "Atende hoje" conforme os dias cadastrados;
- Logar como admin em `/admin/login` e verificar o dashboard;
- Alternar tema escuro/claro na tela de psicólogos.