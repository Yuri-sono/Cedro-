import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FotoPerfilUpload, usuarioService } from '../services/usuarioService';
import { UpdatePerfilRequest, AlterarSenhaRequest } from '../types/api.types';
import { ClassifiedError } from '../services/api';
import { showToast } from '../components/Toast';
import { useAuthStore } from '../store/authStore';

export const usePerfil = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  const getErrorMessage = (error: unknown, fallback: string) => {
    const err = error as Partial<ClassifiedError> | Error;
    return 'message' in err && typeof err.message === 'string' ? err.message : fallback;
  };

  const atualizarPerfilMutation = useMutation({
    mutationFn: (data: UpdatePerfilRequest) => usuarioService.atualizarPerfil(data),
    onSuccess: async (_, variables) => {
      // Atualiza o estado global e o storage
      await updateUser(variables);
      await queryClient.invalidateQueries({ queryKey: ['psicologos'] });
      // Opcional: invalidar query de usuário se tivermos uma
      showToast.success('Perfil atualizado', 'Seus dados foram salvos com sucesso.');
    },
    onError: (error) => {
      showToast.error('Nao foi possivel salvar', getErrorMessage(error, 'Revise os dados e tente novamente.'));
    },
  });

  const atualizarFotoMutation = useMutation({
    mutationFn: (foto: FotoPerfilUpload) => usuarioService.uploadFoto(foto),
    onSuccess: (response) => {
      if (response.fotoUrl) {
        updateUser({ fotoUrl: response.fotoUrl });
      }
      showToast.success('Foto atualizada', 'Sua foto de perfil foi salva.');
    },
    onError: (error) => {
      showToast.error('Nao foi possivel salvar a foto', getErrorMessage(error, 'Escolha outra imagem e tente novamente.'));
    },
  });

  const alterarSenhaMutation = useMutation({
    mutationFn: (data: AlterarSenhaRequest) => usuarioService.alterarSenha(data),
    onSuccess: () => {
      showToast.success('Senha alterada', 'Sua senha foi atualizada com sucesso.');
    },
    onError: (error) => {
      showToast.error('Erro ao alterar senha', getErrorMessage(error, 'Verifique sua senha atual.'));
    },
  });

  return {
    atualizarPerfil: atualizarPerfilMutation.mutateAsync,
    isAtualizando: atualizarPerfilMutation.isPending,
    atualizarFoto: atualizarFotoMutation.mutateAsync,
    isAtualizandoFoto: atualizarFotoMutation.isPending,
    alterarSenha: alterarSenhaMutation.mutateAsync,
    isAlterandoSenha: alterarSenhaMutation.isPending,
  };
};
