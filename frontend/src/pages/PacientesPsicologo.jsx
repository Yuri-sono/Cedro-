import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
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

const PacientesPsicologo = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  // Modais
  const [pacientePerfil, setPacientePerfil] = useState(null);
  const [pacienteHistorico, setPacienteHistorico] = useState(null);
  const [novaConsultaPacienteId, setNovaConsultaPacienteId] = useState(null);

  // Busca pacientes reais + todas as sessões do psicólogo (para "Última Consulta",
  // total de sessões e histórico — sem endpoints novos).
  const carregarDados = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setErro('');
      const [pacientesRes, sessoesRes] = await Promise.all([
        api.get(`/api/psicologos/${user.id}/pacientes`),
        api.get(`/api/sessoes/psicologo/${user.id}`)
      ]);
      setPacientes(pacientesRes.data || []);
      setSessoes(sessoesRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      setErro(error?.response?.data?.error || 'Não foi possível carregar os pacientes.');
      setPacientes([]);
      setSessoes([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    carregarDados();
  }, [user, authLoading, carregarDados]);

  // Cruzamento pacientes × sessões pelo pacienteId:
  // - totalSessoes: quantidade de sessões de cada paciente com este psicólogo
  // - ultimaConsulta: data da sessão mais recente já passada (senão null → "—")
  const pacientesComInfo = useMemo(() => {
    const sessoesPorPaciente = sessoes.reduce((acc, sessao) => {
      const lista = acc[sessao.pacienteId] || [];
      lista.push(sessao);
      acc[sessao.pacienteId] = lista;
      return acc;
    }, {});

    const agora = new Date();
    return pacientes.map((paciente) => {
      const sessoesPaciente = sessoesPorPaciente[paciente.id] || [];
      const passadas = sessoesPaciente
        .filter((s) => new Date(s.dataSessao) < agora)
        .sort((a, b) => new Date(b.dataSessao) - new Date(a.dataSessao));

      return {
        ...paciente,
        sessoes: sessoesPaciente,
        totalSessoes: sessoesPaciente.filter((s) => s.statusSessao !== 'cancelada').length,
        ultimaConsulta: passadas.length > 0 ? passadas[0].dataSessao : null
      };
    });
  }, [pacientes, sessoes]);

  const filteredPacientes = pacientesComInfo.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const historicoDoPaciente = pacienteHistorico
    ? [...pacienteHistorico.sessoes].sort((a, b) => new Date(b.dataSessao) - new Date(a.dataSessao))
    : [];

  const getStatusLabel = (status) => STATUS_LABEL[status] || status || '-';
  const getStatusColor = (status) => STATUS_COLOR[status] || 'secondary';

  const formatarData = (dataStr) => {
    if (!dataStr) return '—';
    return new Date(dataStr).toLocaleDateString('pt-BR');
  };

  const formatarHora = (dataStr) => {
    if (!dataStr) return '-';
    const parte = String(dataStr).split('T')[1];
    return parte ? parte.slice(0, 5) : new Date(dataStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard-terapeuta">
      <NavbarPsicologo />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold">Pacientes</h1>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-2 mb-0">Carregando pacientes...</p>
                  </div>
                ) : erro ? (
                  <div className="text-center py-5">
                    <div className="alert alert-danger mx-4 mb-0">{erro}</div>
                  </div>
                ) : pacientes.length === 0 ? (
                  <div className="text-center py-5 px-4">
                    <i className="bi bi-people fs-1 text-muted"></i>
                    <p className="text-muted mt-3 mb-0">
                      Você ainda não tem pacientes. Eles aparecerão aqui após a primeira sessão agendada.
                    </p>
                  </div>
                ) : filteredPacientes.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">Nenhum paciente encontrado com o termo buscado.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Nome</th>
                          <th>Email</th>
                          <th>Última Consulta</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPacientes.map(paciente => (
                          <tr key={paciente.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                  <i className="bi bi-person text-primary"></i>
                                </div>
                                <strong>{paciente.nome}</strong>
                              </div>
                            </td>
                            <td>{paciente.email}</td>
                            <td>{formatarData(paciente.ultimaConsulta)}</td>
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
                                      onClick={() => setPacientePerfil(paciente)}
                                    >
                                      Ver Perfil
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      type="button"
                                      onClick={() => setNovaConsultaPacienteId(paciente.id)}
                                    >
                                      Agendar Consulta
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      type="button"
                                      onClick={() => setPacienteHistorico(paciente)}
                                    >
                                      Histórico
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Perfil do Paciente ── */}
      {pacientePerfil && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setPacientePerfil(null)} aria-hidden="true" />
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Perfil do Paciente</h5>
                  <button type="button" className="btn-close" aria-label="Fechar" onClick={() => setPacientePerfil(null)} />
                </div>
                <div className="modal-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-person text-primary fs-4"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{pacientePerfil.nome}</h6>
                      <small className="text-muted">{pacientePerfil.email}</small>
                    </div>
                  </div>
                  <div className="bg-light rounded p-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">Total de sessões</div>
                      <small className="text-muted">Sessões com você</small>
                    </div>
                    <span className="badge bg-primary rounded-pill fs-6">{pacientePerfil.totalSessoes}</span>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setPacientePerfil(null)}>
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Modal: Histórico do Paciente ── */}
      {pacienteHistorico && (
        <>
          <div className="modal-backdrop fade show" onClick={() => setPacienteHistorico(null)} aria-hidden="true" />
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Histórico — {pacienteHistorico.nome}</h5>
                  <button type="button" className="btn-close" aria-label="Fechar" onClick={() => setPacienteHistorico(null)} />
                </div>
                <div className="modal-body">
                  {historicoDoPaciente.length === 0 ? (
                    <p className="text-muted text-center mb-0">Nenhuma sessão registrada.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Data</th>
                            <th>Horário</th>
                            <th>Duração</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historicoDoPaciente.map(sessao => (
                            <tr key={sessao.id}>
                              <td>{formatarData(sessao.dataSessao)}</td>
                              <td>{formatarHora(sessao.dataSessao)}</td>
                              <td>{sessao.duracao || 60} min</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(sessao.statusSessao)}`}>
                                  {getStatusLabel(sessao.statusSessao)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setPacienteHistorico(null)}>
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Modal: Nova Consulta (compartilhado com ConsultasPsicologo) ── */}
      <NovaConsultaModal
        show={Boolean(novaConsultaPacienteId)}
        onClose={() => setNovaConsultaPacienteId(null)}
        psicologoId={user?.id}
        pacienteIdInicial={novaConsultaPacienteId}
        onSuccess={carregarDados}
      />
    </div>
  );
};

export default PacientesPsicologo;
