/**
 * Types da API — Cedro Mobile
 * Mapeados diretamente dos DTOs Java do backend Spring Boot.
 * NUNCA inventar contratos diferentes da API existente.
 */

// ── Enum TipoUsuario (TipoUsuario.java) ──
export enum TipoUsuario {
  paciente = 'paciente',
  psicologo = 'psicologo',
  admin = 'admin',
}

// ── LoginRequest (LoginRequest.java) ──
export interface LoginRequest {
  email: string;
  senha: string;
}

// ── LoginResponse (LoginResponse.java) ──
export interface LoginResponse {
  token: string;
  usuario: UsuarioResponse;
}

// ── RegisterRequest (RegisterRequest.java) ──
export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  dataNascimento?: string;
  genero?: string;
  telefone?: string;
  tipoUsuario?: TipoUsuario;
  especialidade?: string;
  tipoPsicologo?: string;
  crp?: string;
  areaInteresse?: string;
  precoSessao?: number;
}

// ── UsuarioResponse (UsuarioResponse.java) ──
export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: TipoUsuario;
  telefone: string | null;
  dataNascimento: string | null;
  genero: string | null;
  endereco: string | null;
  bio: string | null;
  fotoUrl: string | null;
  especialidade: string | null;
  tipoPsicologo: string | null;
  crp: string | null;
  areaInteresse: string | null;
  precoSessao: number | null;
  diasAtendimento?: number[];
  horariosAtendimento?: string[];
}

// ── PsicologoResponse (PsicologoResponse.java) ──
export interface PsicologoResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  bio: string | null;
  especialidade: string | null;
  tipoPsicologo: string | null;
  precoSessao: number | null;
  avaliacao: number | null;
  fotoUrl: string | null;
  diasAtendimento?: number[];
  horariosAtendimento?: string[];
}

// ── PsicologoListItem (retorno de GET /api/psicologos) ──
export interface PsicologoListItem {
  id: number;
  nome: string;
  especialidade: string | null;
  tipoPsicologo: string | null;
  bio: string | null;
  precoSessao: number | null;
  avaliacao: number | null;
  fotoUrl: string | null;
  diasAtendimento?: number[];
  horariosAtendimento?: string[];
}

// ── MensagemRequest (MensagemRequest.java) ──
export interface MensagemRequest {
  destinatarioId: number;
  mensagem: string;
}

// ── Mensagem (Mensagem.java entity) ──
export interface Mensagem {
  id: number;
  remetenteId: number;
  destinatarioId: number;
  mensagem: string;
  lida: boolean;
  dataCriacao: string;
}

// ── SessaoRequest (SessaoRequest.java) ──
export interface SessaoRequest {
  psicologoId: number;
  pacienteId?: number;
  dataSessao: string;
  duracao?: number;
  valor?: number;
  statusSessao?: string;
  observacoes?: string;
}

// ── Sessao (Sessao.java entity) ──
export interface Sessao {
  id: number;
  pacienteId: number;
  psicologoId: number;
  dataSessao: string;
  duracao: number;
  valor: number;
  statusSessao: string;
  observacoes: string | null;
  dataCriacao: string;
}

export interface DisponibilidadeResponse {
  data: string;
  atendeNesteDia: boolean;
  horariosDisponiveis: string[];
  horariosOcupados: string[];
}

export interface LinkReuniaoResponse {
  liberado: boolean;
  disponivelEm?: string;
  link?: string | null;
  erro?: string;
}

// ── UpdatePerfilRequest (UpdatePerfilRequest.java) ──
export interface UpdatePerfilRequest {
  nome?: string;
  telefone?: string;
  dataNascimento?: string;
  genero?: string;
  endereco?: string;
  bio?: string;
  especialidade?: string;
  tipoPsicologo?: string;
  crp?: string;
  areaInteresse?: string;
  precoSessao?: number;
  diasAtendimento?: number[];
  horariosAtendimento?: string[];
}

export interface PsicologoAgendaConfig {
  psicologoId: number;
  diasAtendimento: number[];
  horariosAtendimento: string[];
  precoSessao?: number | null;
}

// ── AlterarSenhaRequest (AlterarSenhaRequest.java) ──
export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

// ── Respostas genéricas do backend ──
export interface ApiMessage {
  message: string;
  senhaTemporaria?: string;
  fotoUrl?: string;
}

export interface ApiError {
  error: string;
}

// ── Conversas (endpoint futuro: GET /api/mensagens/conversas) ──
export interface ConversaResumo {
  userId: number;
  nome: string;
  fotoUrl: string | null;
  ultimaMensagem: string;
  dataUltimaMensagem: string;
  naoLidas: number;
}

// ── Estatísticas do psicólogo ──
export interface PsicologoEstatisticas {
  consultasHoje: number;
  consultasSemana: number;
  pacientesAtivos: number;
  faturamentoMes: number;
}

// ── Próximas consultas do psicólogo ──
export interface ProximaConsulta {
  id: number;
  pacienteId: number;
  data: string;
  horario: string;
  status: string;
  tipo: string;
  pacienteNome: string;
}
