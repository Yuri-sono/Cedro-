import api from './api';


const pacienteService = {
  listar: async () => {
    try {
      const response = await api.get('/api/usuarios');
      return response.data.filter(u => u.tipoUsuario === 'paciente');
    } catch (error) {
      throw new Error('Erro ao listar pacientes: ' + (error?.message || 'Erro desconhecido'));
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/api/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar paciente por ID: ' + (error?.message || 'Erro desconhecido'));
    }
  },

  criar: async (dados) => {
    try {
      const response = await api.post('/api/auth/register', {
        ...dados,
        tipoUsuario: 'paciente'
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar paciente: ' + (error?.message || 'Erro desconhecido'));
    }
  },

  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/api/usuarios/${id}`, dados);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar paciente: ' + (error?.message || 'Erro desconhecido'));
    }
  },

  deletar: async (id) => {
    try {
      const response = await api.delete(`/api/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao deletar paciente: ' + (error?.message || 'Erro desconhecido'));
    }
  }
};

export default pacienteService;
