import { useQuery } from '@tanstack/react-query';
import { psicologoService } from '../services/psicologoService';

export const usePsicologos = () => {
  const listarQuery = useQuery({
    queryKey: ['psicologos'],
    queryFn: () => psicologoService.listar(),
  });

  return {
    psicologos: listarQuery.data || [],
    isLoading: listarQuery.isLoading,
    isError: listarQuery.isError,
    refetch: listarQuery.refetch,
  };
};

export const usePsicologoDetail = (id: number) => {
  const detailQuery = useQuery({
    queryKey: ['psicologo', id],
    queryFn: () => psicologoService.buscarPorId(id),
    enabled: !!id,
  });

  return {
    psicologo: detailQuery.data,
    isLoading: detailQuery.isLoading,
    isError: detailQuery.isError,
    refetch: detailQuery.refetch,
  };
};
