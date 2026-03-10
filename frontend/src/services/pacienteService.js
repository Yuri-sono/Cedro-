import axios from 'axios';
import API_BASE_URL from '../config';

const pacienteService = {
  listar: async () => {
    const response = await axios.get(`${API_BASE_URL}/api/usuarios`);
    return response.data.filter(u => u.tipoUsuario === 'paciente');
  },

  buscarPorId: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/api/usuarios/${id}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      ...dados,
      tipoUsuario: 'paciente'
    });
    return response.data;
  },

  atualizar: async (id, dados) => {
    const response = await axios.put(`${API_BASE_URL}/api/usuarios/${id}`, dados);
    return response.data;
  },

  deletar: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/api/usuarios/${id}`);
    return response.data;
  }
};

export default pacienteService;
