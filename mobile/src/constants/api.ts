/**
 * Constantes de endpoints da API — Cedro Mobile
 * Espelha os endpoints do backend Spring Boot.
 * Centralizado para evitar strings hardcoded nas services.
 */

export const API_ENDPOINTS = {
  // ── Auth ──
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    HEALTH: '/api/auth/health',
    PERFIL: '/api/auth/perfil',
    ALTERAR_SENHA: '/api/auth/alterar-senha',
    CONTA: '/api/auth/conta',
    RECUPERAR_SENHA: '/api/auth/recuperar-senha',
    GOOGLE: '/api/auth/google',
    FOTO_PERFIL: '/api/auth/foto-perfil',
    FOTO_PERFIL_UPLOAD: '/api/auth/foto-perfil-upload',
  },

  // ── Psicólogos ──
  PSICOLOGOS: {
    LISTAR: '/api/psicologos',
    POR_ID: (id: number) => `/api/psicologos/${id}`,
    PACIENTES: (id: number) => `/api/psicologos/${id}/pacientes`,
    ESTATISTICAS: '/api/psicologos/estatisticas',
    PROXIMAS_CONSULTAS: '/api/psicologos/consultas/proximas',
  },

  // ── Mensagens ──
  MENSAGENS: {
    ENVIAR: '/api/mensagens',
    CONVERSA: (userId: number) => `/api/mensagens/conversa/${userId}`,
    NAO_LIDAS: '/api/mensagens/nao-lidas',
    NAO_LIDAS_COUNT: '/api/mensagens/nao-lidas/count',
    MARCAR_LIDA: (id: number) => `/api/mensagens/${id}/lida`,
    MARCAR_TODAS_LIDAS: (remetenteId: number) =>
      `/api/mensagens/marcar-lidas/${remetenteId}`,
    CONVERSAS: '/api/mensagens/conversas',
  },

  // ── Sessões ──
  SESSOES: {
    LISTAR: '/api/sessoes',
    POR_ID: (id: number) => `/api/sessoes/${id}`,
    LINK_REUNIAO: (id: number) => `/api/sessoes/${id}/link-reuniao`,
    MINHAS: '/api/sessoes/minhas',
    POR_PACIENTE: (pacienteId: number) => `/api/sessoes/paciente/${pacienteId}`,
    POR_PSICOLOGO: (psicologoId: number) =>
      `/api/sessoes/psicologo/${psicologoId}`,
    DISPONIBILIDADE: (psicologoId: number, data: string) =>
      `/api/sessoes/disponibilidade/${psicologoId}?data=${data}`,
    CRIAR: '/api/sessoes',
    DELETAR: (id: number) => `/api/sessoes/${id}`,
    STATUS: (id: number) => `/api/sessoes/${id}/status`,
  },

  // ── Usuários ──
  USUARIOS: {
    POR_ID: (id: number) => `/api/usuarios/${id}`,
  },

  // ── Push Notifications (Sprint 4 — endpoint novo) ──
  PUSH: {
    REGISTER: '/api/push/register',
    UNREGISTER: '/api/push/unregister',
  },

  // ── Assinatura (Sprint 6 — endpoint novo) ──
  ASSINATURA: {
    STATUS: '/api/assinatura/status',
    LIMITE_CHAMADAS: '/api/assinatura/limite-chamadas',
  },

  NOTIFICACOES: {
    REGISTRAR_TOKEN: '/api/notificacoes/token',
    REMOVER_TOKEN: '/api/notificacoes/token/remover',
  },
} as const;
