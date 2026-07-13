/**
 * Tipagem das Rotas de Navegação — Cedro Mobile
 * Usado pelo React Navigation para garantir type-safety.
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Parâmetros para as rotas de Auth
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Parâmetros para as rotas principais (Bottom Tabs)
export type MainTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  ChatStack: NavigatorScreenParams<ChatStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Parâmetros para a stack da Home
export type HomeStackParamList = {
  Home: undefined;
  PsicologoList: undefined;
  PsicologoDetail: { psicologoId: number };
  ScheduleSession: { psicologoId: number };
  SessionSuccess: { psicologoId: number; psicologoNome: string; avatarUrl?: string; sessaoId: number };
};

// Parâmetros para a stack de Chat/Mensagens
export type ChatStackParamList = {
  Conversas: undefined;
  Chat: { userId: number; userName: string; avatarUrl?: string; sessaoId?: number };
};

// Parâmetros para a stack de Perfil/Sessões
export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  PsychologistSettings: undefined;
  ChangePassword: undefined;
  MySessions: undefined;
  Subscription: undefined; // Sprint 6
};

// Parâmetros globais (Root Navigator)
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  
  // Modais globais ou telas sobrepostas
  Reuniao: { sessaoId: number };
  Paywall: undefined; // Sprint 6
};
