import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioService } from '../services/usuarioService';
import { UpdatePerfilRequest, AlterarSenhaRequest } from '../types/api.types';
import { showToast } from '../components/Toast';
import { useAuthStore } from '../store/authStore';

export const usePerfil = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  const atualizarPerfilMutation = useMutation({
    mutationFn: (data: UpdatePerfilRequest) => usuarioService.atualizarPerfil(data),
    onSuccess: (_, variables) => {
      // Atualiza o estado global e o storage
      updateUser(variables);
      // Opcional: invalidar query de usuário se tivermos uma
      showToast.success('Perfil atualizado', 'Seus dados foram salvos com sucesso.');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : undefined;
      showToast.error('Erro ao atualizar', message || 'Verifique os dados e tente novamente.');
    },
  });

  const alterarSenhaMutation = useMutation({
    mutationFn: (data: AlterarSenhaRequest) => usuarioService.alterarSenha(data),
    onSuccess: () => {
      showToast.success('Senha alterada', 'Sua senha foi atualizada com sucesso.');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : undefined;
      showToast.error('Erro ao alterar senha', message || 'Verifique sua senha atual.');
    },
  });

  return {
    atualizarPerfil: atualizarPerfilMutation.mutateAsync,
    isAtualizando: atualizarPerfilMutation.isPending,
    alterarSenha: alterarSenhaMutation.mutateAsync,
    isAlterandoSenha: alterarSenhaMutation.isPending,
  };
};
