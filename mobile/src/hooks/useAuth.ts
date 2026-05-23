import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../components/Toast';
import { LoginRequest, RegisterRequest } from '../types/api.types';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const authStore = useAuthStore();

  const showAuthError = (title: string, message: string) => {
    showToast.error(title, message);
    Alert.alert(title, message);
  };

  const handleLogin = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);
      await authStore.login(response.usuario, response.token);
      showToast.success('Bem-vindo!', `Olá, ${response.usuario.nome}.`);
      return true;
    } catch (error: any) {
      showAuthError('Erro no Login', error.message || 'E-mail ou senha inválidos.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      showToast.success('Conta criada!', response.message || 'Faça login para continuar.');
      return true;
    } catch (error: any) {
      showAuthError('Erro no Cadastro', error.message || 'Não foi possível criar a conta.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecuperarSenha = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await authService.recuperarSenha(email);
      showToast.success('E-mail enviado', response.message || 'Verifique sua caixa de entrada.');
      return true;
    } catch (error: any) {
      showAuthError('Erro', error.message || 'Não foi possível enviar o e-mail.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authStore.logout();
  };

  return {
    isLoading,
    login: handleLogin,
    register: handleRegister,
    recuperarSenha: handleRecuperarSenha,
    logout: handleLogout,
  };
};
