import { useQuery } from '@tanstack/react-query';
import { psicologoService } from '../services/psicologoService';
import { useAuthStore } from '../store/authStore';
import { TipoUsuario } from '../types/api.types';

export const usePsychologistDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const enabled = user?.tipoUsuario === TipoUsuario.psicologo;

  const statsQuery = useQuery({
    queryKey: ['psicologo', 'dashboard', 'stats', user?.id],
    queryFn: () => psicologoService.estatisticas(),
    enabled,
  });

  const appointmentsQuery = useQuery({
    queryKey: ['psicologo', 'dashboard', 'appointments', user?.id],
    queryFn: () => psicologoService.proximasConsultas(),
    enabled,
  });

  return {
    estatisticas: statsQuery.data,
    proximasConsultas: appointmentsQuery.data || [],
    isLoading: statsQuery.isLoading || appointmentsQuery.isLoading,
    refetch: async () => {
      await Promise.all([statsQuery.refetch(), appointmentsQuery.refetch()]);
    },
  };
};
