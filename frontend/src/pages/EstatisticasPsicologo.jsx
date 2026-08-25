import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import api from '../services/api.js';

const EstatisticasPsicologo = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/api/psicologos/estatisticas')
      .then(res => setStats(res.data))
      .catch(() => setErro('Não foi possível carregar as estatísticas.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-psicologo">
      <NavbarPsicologo psicologo={user} />
      <div className="container-fluid">
        <div className="row">
          <SidebarPsicologo />
          <div className="col-md-9 col-lg-10">
            <div className="main-content p-4 estatisticas-content">
              <div className="mb-4">
                <h2 className="text-primary fw-bold">
                  <i className="bi bi-graph-up me-2"></i>Estatísticas
                </h2>
                <p className="text-muted">Acompanhe o desempenho da sua prática profissional</p>
              </div>

              {erro && <div className="alert alert-danger">{erro}</div>}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : stats && (
                <>
                  <div className="row g-4 mb-5">
                    <div className="col-lg-3 col-md-6">
                      <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <div className="card-body text-white p-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="card-title mb-2 opacity-75">Pacientes Ativos</p>
                              <h2 className="mb-0 fw-bold">{stats.pacientesAtivos}</h2>
                            </div>
                            <div className="bg-white bg-opacity-25 rounded-circle p-3">
                              <i className="bi bi-people fs-2"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <div className="card-body text-white p-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="card-title mb-2 opacity-75">Sessões esta Semana</p>
                              <h2 className="mb-0 fw-bold">{stats.consultasSemana}</h2>
                            </div>
                            <div className="bg-white bg-opacity-25 rounded-circle p-3">
                              <i className="bi bi-calendar-check fs-2"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <div className="card-body text-white p-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="card-title mb-2 opacity-75">Receita do Mês</p>
                              <h2 className="mb-0 fw-bold">
                                R$ {Number(stats.faturamentoMes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </h2>
                            </div>
                            <div className="bg-white bg-opacity-25 rounded-circle p-3">
                              <i className="bi bi-currency-dollar fs-2"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <div className="card-body text-white p-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="card-title mb-2 opacity-75">Consultas Hoje</p>
                              <h2 className="mb-0 fw-bold">{stats.consultasHoje}</h2>
                            </div>
                            <div className="bg-white bg-opacity-25 rounded-circle p-3">
                              <i className="bi bi-calendar-day fs-2"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                      <h5 className="mb-0 text-primary fw-bold">
                        <i className="bi bi-lightning-charge me-2"></i>Ações Rápidas
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <button className="btn btn-outline-primary w-100 py-3 border-2" onClick={() => window.location.href = '/psicologo/pacientes'}>
                            <i className="bi bi-people fs-4 d-block mb-2"></i>
                            <span className="fw-semibold">Ver Pacientes</span>
                          </button>
                        </div>
                        <div className="col-md-4">
                          <button className="btn btn-outline-success w-100 py-3 border-2" onClick={() => window.location.href = '/psicologo/agenda'}>
                            <i className="bi bi-calendar fs-4 d-block mb-2"></i>
                            <span className="fw-semibold">Ver Agenda</span>
                          </button>
                        </div>
                        <div className="col-md-4">
                          <button className="btn btn-outline-info w-100 py-3 border-2" onClick={() => window.location.href = '/psicologo/financeiro'}>
                            <i className="bi bi-graph-up fs-4 d-block mb-2"></i>
                            <span className="fw-semibold">Financeiro</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatisticasPsicologo;
