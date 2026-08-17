import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessaoService } from '../services/sessaoService';
import { SessaoRequest } from '../types/api.types';
import { showToast } from '../components/Toast';
import { useAuthStore } from '../store/authStore';
import { TipoUsuario } from '../types/api.types';

function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'object' && error && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return undefined;
}

export const useSessoes = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isPsicologo = user?.tipoUsuario === TipoUsuario.psicologo;

  const minhasSessoesQuery = useQuery({
    queryKey: ['sessoes', isPsicologo ? 'psicologo' : 'paciente', user?.id],
    queryFn: () => {
      if (!user) return [];
      return isPsicologo
        ? sessaoService.sessoesDoPsicologo(user.id)
        : sessaoService.minhasSessoes();
    },
    enabled: Boolean(user?.id),
  });

  const criarSessaoMutation = useMutation({
    mutationFn: (data: SessaoRequest) => sessaoService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessoes'] });
      showToast.success('Sessao agendada', 'Sua consulta foi agendada com sucesso.');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      showToast.error('Erro ao agendar', message || 'Tente novamente mais tarde.');
    },
  });

  const cancelarSessaoMutation = useMutation({
    mutationFn: (id: number) => sessaoService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessoes'] });
      showToast.success('Sessao cancelada', 'Consulta cancelada com sucesso.');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      showToast.error('Erro ao cancelar', message || 'Nao foi possivel cancelar a sessao.');
    },
  });

  const atualizarStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'realizada' | 'cancelada' }) =>
      sessaoService.atualizarStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessoes'] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      showToast.error('Erro ao atualizar', message || 'Nao foi possivel atualizar a sessao.');
    },
  });

  return {
    sessoes: minhasSessoesQuery.data || [],
    isLoading: minhasSessoesQuery.isLoading,
    isError: minhasSessoesQuery.isError,
    refetch: minhasSessoesQuery.refetch,
    agendarSessao: criarSessaoMutation.mutateAsync,
    isAgendando: criarSessaoMutation.isPending,
    cancelarSessao: cancelarSessaoMutation.mutateAsync,
    isCancelando: cancelarSessaoMutation.isPending,
    atualizarStatus: atualizarStatusMutation.mutateAsync,
    isAtualizandoStatus: atualizarStatusMutation.isPending,
  };
};

export const useDisponibilidade = (psicologoId: number, data?: string) => {
  const query = useQuery({
    queryKey: ['sessoes', 'disponibilidade', psicologoId, data],
    queryFn: () => sessaoService.disponibilidade(psicologoId, data as string),
    enabled: Boolean(data),
  });

  return {
    disponibilidade: query.data,
    isLoadingDisponibilidade: query.isLoading,
    refetchDisponibilidade: query.refetch,
  };
};
