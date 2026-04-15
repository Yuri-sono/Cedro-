import api from './api';


const psicologoService = {
  listar: async () => {
    try {
      const response = await api.get('/api/psicologos');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao listar psicólogos: ' + (error?.message || 'Erro desconhecido'));
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/api/psicologos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar psicólogo por ID: ' + (error?.message || 'Erro desconhecido'));
    }
  },

  criar: async (dados) => {
    try {
      const response = await api.post('/api/auth/register', {
        ...dados,
        tipoUsuario: 'psicologo'
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar psicólogo: ' + (error?.message || 'Erro desconhecido'));
    }
  },

  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/api/psicologos/${id}`, dados);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar psicólogo: ' + (error?.message || 'Erro desconhecido'));
    }
  },

  deletar: async (id) => {
    try {
      const response = await api.delete(`/api/psicologos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao deletar psicólogo: ' + (error?.message || 'Erro desconhecido'));
    }
  }
};

export default psicologoService;
