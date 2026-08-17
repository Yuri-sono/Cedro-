import { useQuery } from '@tanstack/react-query';
import { psicologoService } from '../services/psicologoService';
import { PacienteResumo } from '../types/api.types';

/**
 * Pacientes que já possuem pelo menos uma sessão com o psicólogo.
 * Consome GET /api/psicologos/{id}/pacientes (Novo endpoint da Parte 1).
 */
export const usePacientes = (psicologoId?: number) => {
  const query = useQuery<PacienteResumo[]>({
    queryKey: ['psicologos', psicologoId, 'pacientes'],
    queryFn: () => psicologoService.pacientes(psicologoId as number),
    enabled: Boolean(psicologoId),
  });

  return {
    pacientes: query.data || [],
    isLoadingPacientes: query.isLoading,
    refetchPacientes: query.refetch,
  };
};