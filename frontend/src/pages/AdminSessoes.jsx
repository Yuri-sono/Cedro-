import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function AdminSessoes() {
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    paciente_id: '',
    terapeuta_id: '',
    data_sessao: '',
    duracao: 60,
    valor: '',
    status_sessao: 'agendada',
    observacoes: ''
  });

  useEffect(() => {
    carregarSessoes();
  }, []);

  const carregarSessoes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sessoes`);
      setSessoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`${API_BASE_URL}/api/sessoes/${editando}`, form);
      } else {
        await axios.post(`${API_BASE_URL}/api/sessoes`, form);
      }
      limparForm();
      carregarSessoes();
    } catch (error) {
      alert('Erro ao salvar sessão');
    }
  };

  const editar = (sessao) => {
    setEditando(sessao.id);
    setForm({
      paciente_id: sessao.pacienteId,
      terapeuta_id: sessao.terapeutaId,
      data_sessao: sessao.dataSessao?.substring(0, 16),
      duracao: sessao.duracao,
      valor: sessao.valor,
      status_sessao: sessao.statusSessao,
      observacoes: sessao.observacoes || ''
    });
  };

  const deletar = async (id) => {
    if (!confirm('Deseja realmente deletar esta sessão?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/sessoes/${id}`);
      carregarSessoes();
    } catch (error) {
      alert('Erro ao deletar sessão');
    }
  };

  const limparForm = () => {
    setEditando(null);
    setForm({
      paciente_id: '',
      terapeuta_id: '',
      data_sessao: '',
      duracao: 60,
      valor: '',
      status_sessao: 'agendada',
      observacoes: ''
    });
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Gerenciar Sessões</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5>{editando ? 'Editar' : 'Nova'} Sessão</h5>
          <form onSubmit={salvar}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Paciente ID</label>
                <input type="number" className="form-control" value={form.paciente_id} 
                  onChange={e => setForm({...form, paciente_id: e.target.value})} required />
              </div>
              <div className="col-md-6 mb-3">
                <label>Terapeuta ID</label>
                <input type="number" className="form-control" value={form.terapeuta_id}
                  onChange={e => setForm({...form, terapeuta_id: e.target.value})} required />
              </div>
              <div className="col-md-4 mb-3">
                <label>Data/Hora</label>
                <input type="datetime-local" className="form-control" value={form.data_sessao}
                  onChange={e => setForm({...form, data_sessao: e.target.value})} required />
              </div>
              <div className="col-md-4 mb-3">
                <label>Duração (min)</label>
                <input type="number" className="form-control" value={form.duracao}
                  onChange={e => setForm({...form, duracao: e.target.value})} />
              </div>
              <div className="col-md-4 mb-3">
                <label>Valor</label>
                <input type="number" step="0.01" className="form-control" value={form.valor}
                  onChange={e => setForm({...form, valor: e.target.value})} required />
              </div>
              <div className="col-md-6 mb-3">
                <label>Status</label>
                <select className="form-select" value={form.status_sessao}
                  onChange={e => setForm({...form, status_sessao: e.target.value})}>
                  <option value="agendada">Agendada</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="realizada">Realizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label>Observações</label>
                <textarea className="form-control" value={form.observacoes}
                  onChange={e => setForm({...form, observacoes: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-success me-2">Salvar</button>
            {editando && <button type="button" className="btn btn-secondary" onClick={limparForm}>Cancelar</button>}
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Terapeuta</th>
              <th>Data</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sessoes.map(sessao => (
              <tr key={sessao.id}>
                <td>{sessao.id}</td>
                <td>{sessao.pacienteId}</td>
                <td>{sessao.terapeutaId}</td>
                <td>{new Date(sessao.dataSessao).toLocaleString()}</td>
                <td>R$ {parseFloat(sessao.valor).toFixed(2)}</td>
                <td><span className="badge bg-info">{sessao.statusSessao}</span></td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => editar(sessao)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deletar(sessao.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminSessoes;
