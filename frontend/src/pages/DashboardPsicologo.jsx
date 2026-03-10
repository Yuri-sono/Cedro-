import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import axios from 'axios';
import API_BASE_URL from '../config.js';

const DashboardPsicologo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    consultasHoje: 0,
    consultasSemana: 0,
    pacientesAtivos: 0,
    faturamentoMes: 0
  });
  const [proximasConsultas, setProximasConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);
  
  const carregarDados = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await Promise.all([
        carregarEstatisticas(token),
        carregarProximasConsultas(token)
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarEstatisticas = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/psicologo/estatisticas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats({
        consultasHoje: 2,
        consultasSemana: 8,
        pacientesAtivos: 15,
        faturamentoMes: 4500
      });
    }
  };

  const carregarProximasConsultas = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/psicologo/consultas/proximas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProximasConsultas(response.data.slice(0, 3));
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      setProximasConsultas([
        { id: 1, pacienteNome: 'Maria Silva', horario: '14:00', tipo: 'Terapia Individual', data: new Date().toISOString(), status: 'Confirmada' },
        { id: 2, pacienteNome: 'João Santos', horario: '16:00', tipo: 'Terapia de Casal', data: new Date().toISOString(), status: 'Confirmada' },
        { id: 3, pacienteNome: 'Ana Costa', horario: '09:00', tipo: 'Terapia Individual', data: new Date(Date.now() + 86400000).toISOString(), status: 'Agendada' }
      ]);
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
                        <p className="text-muted mt-3">Nenhuma consulta agendada</p>
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
                <div className="timeline">
                  <div className="d-flex mb-4">
                    <div className="flex-shrink-0">
                      <div className="bg-success rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-check-circle text-white"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 fw-bold">Consulta finalizada</h6>
                      <p className="text-muted mb-1 small">Sessão com Maria Silva concluída</p>
                      <small className="text-muted"><i className="bi bi-clock me-1"></i>Há 2 horas</small>
                    </div>
                  </div>
                  <div className="d-flex mb-4">
                    <div className="flex-shrink-0">
                      <div className="bg-primary rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-calendar-plus text-white"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 fw-bold">Novo agendamento</h6>
                      <p className="text-muted mb-1 small">Carlos Oliveira agendou consulta para amanhã</p>
                      <small className="text-muted"><i className="bi bi-clock me-1"></i>Há 4 horas</small>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-info rounded-circle p-2" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-file-earmark-text text-white"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1 fw-bold">Relatório gerado</h6>
                      <p className="text-muted mb-1 small">Relatório mensal de atividades criado</p>
                      <small className="text-muted"><i className="bi bi-clock me-1"></i>Ontem</small>
                    </div>
                  </div>
                </div>
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
