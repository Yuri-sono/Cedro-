import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

function AdminSessoes() {
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    pacienteId: '',
    psicologoId: '',
    dataSessao: '',
    duracao: 60,
    valor: '',
    statusSessao: 'agendada',
    observacoes: ''
  });

  useEffect(() => {
    carregarSessoes();
  }, []);

  const carregarSessoes = async () => {
    try {
      const response = await api.get('/api/sessoes');
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
        await api.put(`/api/sessoes/${editando}`, form);
      } else {
        await api.post('/api/sessoes', form);
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
      pacienteId: sessao.pacienteId,
      psicologoId: sessao.psicologoId,
      dataSessao: sessao.dataSessao?.substring(0, 16),
      duracao: sessao.duracao,
      valor: sessao.valor,
      statusSessao: sessao.statusSessao,
      observacoes: sessao.observacoes || ''
    });
  };

  const deletar = async (id) => {
    if (!confirm('Deseja realmente deletar esta sessão?')) return;
    try {
      await api.delete(`/api/sessoes/${id}`);
      carregarSessoes();
    } catch (error) {
      alert('Erro ao deletar sessão');
    }
  };

  const limparForm = () => {
    setEditando(null);
    setForm({
      pacienteId: '',
      psicologoId: '',
      dataSessao: '',
      duracao: 60,
      valor: '',
      statusSessao: 'agendada',
      observacoes: ''
    });
  };

  const getStatusBadge = (status) => {
    const map = {
      agendada: ['Agendada', 'sr-primary'],
      confirmada: ['Confirmada', 'sr-info'],
      realizada: ['Realizada', 'sr-success'],
      cancelada: ['Cancelada', 'sr-danger']
    };
    const found = map[status] || [status, 'sr-muted'];
    return { label: found[0], cls: found[1] };
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-5 admin-page">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-1">
          <li className="breadcrumb-item"><a href="/admin/dashboard" className="text-decoration-none">Dashboard</a></li>
          <li className="breadcrumb-item active" aria-current="page">Sessões</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1 className="admin-page-title mb-0">
          <i className="bi bi-calendar3 me-2"></i>Gerenciar Sessões
        </h1>
        <span className="badge admin-count-badge"><i className="bi bi-list-check me-1"></i>{sessoes.length} sessões</span>
      </div>

      <div className="card admin-form-card mb-4">
        <div className="card-body">
          <h5 className="admin-form-title mb-3">{editando ? 'Editar' : 'Nova'} Sessão</h5>
          <form onSubmit={salvar}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Paciente ID</label>
                <input type="number" className="form-control" value={form.pacienteId}
                  onChange={e => setForm({...form, pacienteId: e.target.value})} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Psicólogo ID</label>
                <input type="number" className="form-control" value={form.psicologoId}
                  onChange={e => setForm({...form, psicologoId: e.target.value})} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Data/Hora</label>
                <input type="datetime-local" className="form-control" value={form.dataSessao}
                  onChange={e => setForm({...form, dataSessao: e.target.value})} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Duração (min)</label>
                <input type="number" className="form-control" value={form.duracao}
                  onChange={e => setForm({...form, duracao: e.target.value})} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Valor (R$)</label>
                <input type="number" step="0.01" className="form-control" value={form.valor}
                  onChange={e => setForm({...form, valor: e.target.value})} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.statusSessao}
                  onChange={e => setForm({...form, statusSessao: e.target.value})}>
                  <option value="agendada">Agendada</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="realizada">Realizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Observações</label>
                <textarea className="form-control" value={form.observacoes}
                  onChange={e => setForm({...form, observacoes: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-success me-2"><i className="bi bi-check-lg me-1"></i>Salvar</button>
            {editando && <button type="button" className="btn btn-secondary" onClick={limparForm}>Cancelar</button>}
          </form>
        </div>
      </div>

      <div className="card admin-table-card">
        <table className="table admin-table mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Terapeuta</th>
              <th>Data</th>
              <th>Valor</th>
              <th>Status</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sessoes.length === 0 && (
              <tr><td colSpan="7" className="text-center text-muted py-4"><i className="bi bi-inbox me-2"></i>Nenhuma sessão cadastrada</td></tr>
            )}
            {sessoes.map(sessao => {
              const st = getStatusBadge(sessao.statusSessao);
              return (
                <tr key={sessao.id}>
                  <td><span className="admin-id">{sessao.id}</span></td>
                  <td><strong>{sessao.pacienteId}</strong></td>
                  <td>{sessao.psicologoId}</td>
                  <td className="admin-email">{new Date(sessao.dataSessao).toLocaleString('pt-BR')}</td>
                  <td className="fw-semibold text-success">R$ {parseFloat(sessao.valor).toFixed(2)}</td>
                  <td><span className={`badge sessoes-status ${st.cls}`}>{st.label}</span></td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-action btn-edit" onClick={() => editar(sessao)}><i className="bi bi-pencil me-1"></i>Editar</button>
                    <button className="btn btn-sm btn-action btn-del" onClick={() => deletar(sessao.id)}><i className="bi bi-trash3 me-1"></i>Deletar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminSessoes;
