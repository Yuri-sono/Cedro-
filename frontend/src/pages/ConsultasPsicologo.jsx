import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import ReuniaoModal from '../components/ReuniaoModal.jsx';
import NovaConsultaModal from '../components/NovaConsultaModal.jsx';
import api from '../services/api.js';

const STATUS_LABEL = {
  realizada: 'Realizada',
  agendada: 'Agendada',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada'
};

const STATUS_COLOR = {
  realizada: 'success',
  agendada: 'primary',
  confirmada: 'warning',
  cancelada: 'danger'
};

const ConsultasPsicologo = () => {
  const { user, loading: authLoading } = useAuth();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [sessaoReuniao, setSessaoReuniao] = useState(null);
  const [detalhesSessao, setDetalhesSessao] = useState(null);

  // ── Modal "Nova Consulta" (compartilhado — NovaConsultaModal.jsx) ──
  const [modalNova, setModalNova] = useState(false);

  const carregarConsultas = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setErro('');
      const response = await api.get(`/api/sessoes/psicologo/${user.id}`);
      setConsultas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      setErro(error?.response?.data?.error || 'Não foi possível carregar as consultas.');
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    carregarConsultas();
  }, [user, authLoading, carregarConsultas]);

  // ── Estatísticas reais (statuses do backend: agendada | confirmada | realizada | cancelada) ──
  const consultasRealizadas = consultas.filter((c) => c.statusSessao === 'realizada').length;
  const consultasConfirmadas = consultas.filter((c) => c.statusSessao === 'confirmada').length;
  const consultasAgendadas = consultas.filter((c) => c.statusSessao === 'agendada').length;
  const valorTotal = consultas.reduce((total, c) => total + (Number(c.valor) || 0), 0);

  const filteredConsultas = filtroStatus === 'todas'
    ? consultas
    : consultas.filter((c) => c.statusSessao === filtroStatus);

  const getStatusColor = (status) => STATUS_COLOR[status] || 'secondary';
  const getStatusLabel = (status) => STATUS_LABEL[status] || status || '-';

  const formatarHora = (dataStr) => {
    if (!dataStr) return '-';
    const parte = String(dataStr).split('T')[1];
    return parte ? parte.slice(0, 5) : new Date(dataStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatarValor = (valor) => `R$ ${(Number(valor) || 0).toFixed(2)}`;

  // ── Ações ──
  const confirmarStatus = async (sessao, novoStatus) => {
    const acao = novoStatus === 'realizada'
      ? 'marcar esta consulta como realizada'
      : 'cancelar esta consulta';
    if (!window.confirm(`Deseja ${acao}?`)) return;

    try {
      await api.put(`/api/sessoes/${sessao.id}/status`, { status: novoStatus });
      await carregarConsultas();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      window.alert(error?.response?.data?.error || 'Não foi possível atualizar a consulta.');
    }
  };

  // (Lógica do modal "Nova Consulta" extraída para o componente compartilhado
  // NovaConsultaModal.jsx — renderizado ao final do JSX.)

  return (
    <div className="dashboard-terapeuta">
      <NavbarPsicologo />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold">Consultas</h1>
              <button className="btn btn-primary" onClick={() => setModalNova(true)} disabled={!user}>
                <i className="bi bi-plus-circle me-2"></i>Nova Consulta
              </button>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h4 fw-bold text-success">{consultasRealizadas}</h3>
                    <p className="text-muted mb-0">Concluídas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h4 fw-bold text-primary">{consultasConfirmadas}</h3>
                    <p className="text-muted mb-0">Confirmadas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h4 fw-bold text-warning">{consultasAgendadas}</h3>
                    <p className="text-muted mb-0">Agendadas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h4 fw-bold text-success">{formatarValor(valorTotal)}</h3>
                    <p className="text-muted mb-0">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                      <option value="todas">Todas as consultas</option>
                      <option value="realizada">Concluídas</option>
                      <option value="confirmada">Confirmadas</option>
                      <option value="agendada">Agendadas</option>
                      <option value="cancelada">Canceladas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-2 mb-0">Carregando consultas...</p>
                  </div>
                ) : erro ? (
                  <div className="text-center py-5">
                    <div className="alert alert-danger mx-4 mb-0">{erro}</div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Paciente</th>
                          <th>Data</th>
                          <th>Horário</th>
                          <th>Duração</th>
                          <th>Status</th>
                          <th>Valor</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredConsultas.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted py-4">
                              Nenhuma consulta encontrada.
                            </td>
                          </tr>
                        ) : (
                          filteredConsultas.map((consulta) => (
                            <tr key={consulta.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i className="bi bi-person text-primary"></i>
                                  </div>
                                  <strong>{consulta.pacienteNome || `Paciente #${consulta.pacienteId}`}</strong>
                                </div>
                              </td>
                              <td>{new Date(consulta.dataSessao).toLocaleDateString('pt-BR')}</td>
                              <td>{formatarHora(consulta.dataSessao)}</td>
                              <td>{consulta.duracao || 60} min</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(consulta.statusSessao)}`}>
                                  {getStatusLabel(consulta.statusSessao)}
                                </span>
                              </td>
                              <td>{formatarValor(consulta.valor)}</td>
                              <td>
                                <div className="dropdown">
                                  <button className="btn btn-outline-secondary btn-sm" data-bs-toggle="dropdown">
                                    <i className="bi bi-three-dots-vertical"></i>
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={() => setDetalhesSessao(consulta)}
                                      >
                                        Ver Detalhes
                                      </button>
                                    </li>
                                    {consulta.statusSessao === 'agendada' && (
                                      <li>
                                        <button
                                          className="dropdown-item"
                                          type="button"
                                          onClick={() => confirmarStatus(consulta, 'realizada')}
                                        >
                                          Marcar como realizada
                                        </button>
                                      </li>
                                    )}
                                    {(consulta.statusSessao === 'agendada' || consulta.statusSessao === 'confirmada') && (
                                      <li>
                                        <button
                                          className="dropdown-item text-danger"
                                          type="button"
                                          onClick={() => confirmarStatus(consulta, 'cancelada')}
                                        >
                                          Cancelar
                                        </button>
                                      </li>
                                    )}
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        type="button"
                                        onClick={() => setSessaoReuniao(consulta.id)}
                                      >
                                        Entrar na sessão
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Ver Detalhes ── */}
      {detalhesSessao && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setDetalhesSessao(null)} aria-hidden="true" />
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Detalhes da Consulta</h5>
                  <button type="button" className="btn-close" aria-label="Fechar" onClick={() => setDetalhesSessao(null)} />
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <strong>Paciente:</strong> {detalhesSessao.pacienteNome || `Paciente #${detalhesSessao.pacienteId}`}
                  </div>
                  <div className="mb-2">
                    <strong>Psicólogo:</strong> {detalhesSessao.psicologoNome || `Psicólogo #${detalhesSessao.psicologoId}`}
                  </div>
                  <div className="mb-2">
                    <strong>Data:</strong> {new Date(detalhesSessao.dataSessao).toLocaleString('pt-BR')}
                  </div>
                  <div className="mb-2">
                    <strong>Duração:</strong> {detalhesSessao.duracao || 60} minutos
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {getStatusLabel(detalhesSessao.statusSessao)}
                  </div>
                  <div className="mb-2">
                    <strong>Valor:</strong> {formatarValor(detalhesSessao.valor)}
                  </div>
                  <div className="mb-2">
                    <strong>Observações:</strong> {detalhesSessao.observacoes || '—'}
                  </div>
                  <div className="mb-0">
                    <strong>Link da reunião:</strong> {detalhesSessao.linkReuniao || 'Não gerado'}
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setDetalhesSessao(null)}>
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Modal: Nova Consulta (compartilhado — NovaConsultaModal.jsx) ── */}
      <NovaConsultaModal
        show={modalNova}
        onClose={() => setModalNova(false)}
        psicologoId={user?.id}
        onSuccess={carregarConsultas}
      />


      <ReuniaoModal
        show={Boolean(sessaoReuniao)}
        sessaoId={sessaoReuniao}
        onClose={() => setSessaoReuniao(null)}
      />
    </div>
  );
};

export default ConsultasPsicologo;