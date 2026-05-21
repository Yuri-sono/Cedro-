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
      showToast.success('Sessão agendada', 'Sua consulta foi agendada com sucesso!');
    },
    onError: (error: any) => {
      showToast.error('Erro ao agendar', error.message || 'Tente novamente mais tarde.');
    },
  });

  const cancelarSessaoMutation = useMutation({
    mutationFn: (id: number) => sessaoService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessoes', 'minhas'] });
      showToast.success('Sessão cancelada', 'Consulta cancelada com sucesso.');
    },
    onError: (error: any) => {
      showToast.error('Erro ao cancelar', error.message || 'Não foi possível cancelar a sessão.');
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
