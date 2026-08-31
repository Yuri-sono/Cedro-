import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import api from '../services/api.js';
import { useSessionReminders } from '../hooks/useSessionReminders';

const DashboardPsicologo = () => {
  useSessionReminders();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    consultasHoje: 0,
    consultasSemana: 0,
    pacientesAtivos: 0,
    faturamentoMes: 0
  });
  const [proximasConsultas, setProximasConsultas] = useState([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);
  
  const carregarDados = async () => {
    setLoading(true);
    setErro('');
    try {
      const [estatisticasResponse, consultasResponse, atividadesResponse] = await Promise.all([
        api.get('/api/psicologos/estatisticas'),
        api.get('/api/psicologos/consultas/proximas'),
        api.get('/api/psicologos/atividades-recentes')
      ]);
      setStats(estatisticasResponse.data);
      setProximasConsultas((consultasResponse.data || []).slice(0, 3));
      setAtividadesRecentes(atividadesResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        'Não foi possível carregar o dashboard.'
      );
      setStats({
        consultasHoje: 0,
        consultasSemana: 0,
        pacientesAtivos: 0,
        faturamentoMes: 0
      });
      setProximasConsultas([]);
      setAtividadesRecentes([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    if (data.toDateString() === hoje.toDateString()) return 'Hoje';
    if (data.toDateString() === amanha.toDateString()) return 'Amanhã';
    return data.toLocaleDateString('pt-BR');
  };

  const formatarTempoRelativo = (dataStr) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    const agora = new Date();
    const diffMs = agora.getTime() - data.getTime();

    if (diffMs < 60000) return 'Agora mesmo';

    const minutos = Math.floor(diffMs / 60000);
    if (minutos < 60) return `Há ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;

    const ontem = new Date(agora);
    ontem.setDate(ontem.getDate() - 1);
    if (data.toDateString() === ontem.toDateString()) return 'Ontem';

    const dias = Math.floor(horas / 24);
    if (dias < 30) return `Há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
    return data.toLocaleDateString('pt-BR');
  };

  const formatarMensagemAtividade = (atividade) => {
    if (atividade.tipo === 'consulta_finalizada') {
      return `Consulta finalizada com ${atividade.pacienteNome}`;
    }
    if (atividade.tipo === 'novo_agendamento') {
      return `${atividade.pacienteNome} agendou consulta para ${formatarData(atividade.dataSessao || atividade.data)}`;
    }
    return '';
  };

  return (
    <div className="dashboard-psicologo">
      <NavbarPsicologo psicologo={user} />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          {/* Main Content */}
          <div className="col-md-9 col-lg-10">
            {/* Welcome */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 fw-bold">Bem-vindo, Dr(a). {user.nome}</h1>
                <p className="text-muted">
                  <i className="bi bi-calendar-event me-2"></i>
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <span className="badge bg-success fs-6">
                  <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.5rem' }}></i>
                  Online
                </span>
              </div>
            </div>

            {erro && (
              <div className="alert alert-danger" role="alert">
                {erro}
              </div>
            )}

            {/* Onboarding: configurar horários de atendimento */}
            {(() => {
              const semDias = !user.diasAtendimento || user.diasAtendimento.length === 0;
              const semHorarios = !user.horariosAtendimento || user.horariosAtendimento.length === 0;
              if (!semDias && !semHorarios) return null;
              return (
                <div className="alert alert-success d-flex align-items-center gap-3 flex-wrap mb-4" role="alert">
                  <span className="onboarding-icone"><i className="bi bi-calendar-range"></i></span>
                  <div className="flex-grow-1">
                    <strong className="d-block">
                      <i className="bi bi-magic me-1"></i>
                      Finalize seu cadastro: defina os horários que você atende!
                    </strong>
                    <small>
                      Isso permite que pacientes vejam sua disponibilidade e agendem consultas nos dias e horários corretos.
                      Horários já ocupados aparecem bloqueados automaticamente.
                    </small>
                  </div>
                  <Link to="/psicologo/configuracoes" className="btn btn-success btn-sm">
                    <i className="bi bi-gear me-1"></i>Configurar horários
                  </Link>
                </div>
              );
            })()}

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-6 col-lg-3">
                <Link to="/psicologo/consultas" className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 hover-shadow transition">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                            <i className="bi bi-calendar-check text-primary fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h3 className="h4 fw-bold mb-0 text-dark">{stats.consultasHoje}</h3>
                          <p className="text-muted mb-0 small">Consultas Hoje</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-lg-3">
                <Link to="/psicologo/consultas" className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 hover-shadow transition">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-success bg-opacity-10 rounded-3 p-3">
                            <i className="bi bi-calendar-week text-success fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h3 className="h4 fw-bold mb-0 text-dark">{stats.consultasSemana}</h3>
                          <p className="text-muted mb-0 small">Esta Semana</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-lg-3">
                <Link to="/psicologo/pacientes" className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 hover-shadow transition">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-info bg-opacity-10 rounded-3 p-3">
                            <i className="bi bi-people text-info fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h3 className="h4 fw-bold mb-0 text-dark">{stats.pacientesAtivos}</h3>
                          <p className="text-muted mb-0 small">Pacientes Ativos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col-md-6 col-lg-3">
                <Link to="/psicologo/financeiro" className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 hover-shadow transition">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                            <i className="bi bi-currency-dollar text-warning fs-4"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h3 className="h4 fw-bold mb-0 text-dark">R$ {stats.faturamentoMes.toLocaleString('pt-BR')}</h3>
                          <p className="text-muted mb-0 small">Faturamento Mês</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0 pt-4">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                      Ações Rápidas
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-3">
                      <Link to="/psicologo/consultas" className="btn btn-primary btn-lg">
                        <i className="bi bi-plus-circle me-2"></i>Nova Consulta
                      </Link>
                      <Link to="/psicologo/agenda" className="btn btn-outline-primary">
                        <i className="bi bi-calendar-plus me-2"></i>Ver Agenda Completa
                      </Link>
                      <Link to="/psicologo/pacientes" className="btn btn-outline-success">
                        <i className="bi bi-person-plus me-2"></i>Gerenciar Pacientes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0 pt-4">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-clock-history text-primary me-2"></i>
                      Próximas Consultas
                    </h5>
                  </div>
                  <div className="card-body">
                    {proximasConsultas.length > 0 ? (
                      <>
                        <div className="list-group list-group-flush">
                          {proximasConsultas.map((consulta) => (
                            <div key={consulta.id} className="list-group-item px-0 border-0 mb-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="d-flex align-items-start">
                                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i className="bi bi-person text-primary"></i>
                                  </div>
                                  <div>
                                    <h6 className="mb-1 fw-bold">{consulta.pacienteNome}</h6>
                                    <small className="text-muted d-block">
                                      <i className="bi bi-clock me-1"></i>{consulta.horario} - {consulta.tipo}
                                    </small>
                                  </div>
                                </div>
                                <span className={`badge bg-${formatarData(consulta.data) === 'Hoje' ? 'primary' : 'secondary'}`}>
                                  {formatarData(consulta.data)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center mt-3">
                          <Link to="/psicologo/agenda" className="btn btn-sm btn-outline-primary w-100">
                            <i className="bi bi-calendar3 me-2"></i>Ver Agenda Completa
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-3">
                          {erro ? 'Não foi possível carregar as consultas' : 'Nenhuma consulta agendada'}
                        </p>
                        <Link to="/psicologo/agenda" className="btn btn-sm btn-primary">
                          Agendar Consulta
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 pt-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-activity text-success me-2"></i>
                  Atividades Recentes
                </h5>
              </div>
              <div className="card-body">
                {atividadesRecentes.length > 0 ? (
                  <div className="timeline">
                    {atividadesRecentes.map((atividade) => (
                      <div key={atividade.sessaoId} className="d-flex mb-4">
                        <div className="flex-shrink-0">
                          <div className={`${atividade.tipo === 'consulta_finalizada' ? 'bg-success' : 'bg-primary'} rounded-circle p-2`} style={{ width: '40px', height: '40px' }}>
                            <i className={`${atividade.tipo === 'consulta_finalizada' ? 'bi bi-check-circle' : 'bi bi-calendar-plus'} text-white`}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-bold">
                            {atividade.tipo === 'consulta_finalizada' ? 'Consulta finalizada' : 'Novo agendamento'}
                          </h6>
                          <p className="text-muted mb-1 small">{formatarMensagemAtividade(atividade)}</p>
                          <small className="text-muted"><i className="bi bi-clock me-1"></i>{formatarTempoRelativo(atividade.data)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mt-3">Nenhuma atividade recente</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .transition {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default DashboardPsicologo;
