import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessaoService } from '../services/sessaoService';
import { SessaoRequest } from '../types/api.types';
import { showToast } from '../components/Toast';

export const useSessoes = () => {
  const queryClient = useQueryClient();

  const minhasSessoesQuery = useQuery({
    queryKey: ['sessoes', 'minhas'],
    queryFn: () => sessaoService.minhasSessoes(),
  });

  const criarSessaoMutation = useMutation({
    mutationFn: (data: SessaoRequest) => sessaoService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessoes', 'minhas'] });
      showToast.success('Sessao agendada', 'Sua consulta foi agendada com sucesso.');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : undefined;
      showToast.error('Erro ao agendar', message || 'Tente novamente mais tarde.');
    },
  });

  const cancelarSessaoMutation = useMutation({
    mutationFn: (id: number) => sessaoService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessoes', 'minhas'] });
      showToast.success('Sessao cancelada', 'Consulta cancelada com sucesso.');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : undefined;
      showToast.error('Erro ao cancelar', message || 'Nao foi possivel cancelar a sessao.');
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
