import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';

const EstatisticasPsicologo = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPacientes: 15,
    sessoesMes: 42,
    receitaMes: 3150.00,
    avaliacaoMedia: 4.8
  });

  return (
    <div className="dashboard-psicologo">
      <NavbarPsicologo psicologo={user} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2 p-0">
            <SidebarPsicologo />
          </div>
          <div className="col-md-9 col-lg-10">
            <div className="main-content p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
              <div className="mb-4">
                <h2 className="text-primary fw-bold">
                  <i className="bi bi-graph-up me-2"></i>Estatísticas
                </h2>
                <p className="text-muted">Acompanhe o desempenho da sua prática profissional</p>
              </div>

              <div className="row g-4 mb-5">
                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="card-body text-white p-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="card-title mb-2 opacity-75">Total de Pacientes</p>
                          <h2 className="mb-0 fw-bold">{stats.totalPacientes}</h2>
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
                          <p className="card-title mb-2 opacity-75">Sessões este Mês</p>
                          <h2 className="mb-0 fw-bold">{stats.sessoesMes}</h2>
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
                          <h2 className="mb-0 fw-bold">R$ {stats.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
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
                          <p className="card-title mb-2 opacity-75">Avaliação Média</p>
                          <h2 className="mb-0 fw-bold">{stats.avaliacaoMedia} <small className="fs-5">/5</small></h2>
                        </div>
                        <div className="bg-white bg-opacity-25 rounded-circle p-3">
                          <i className="bi bi-star-fill fs-2"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                      <h5 className="mb-0 text-primary fw-bold">
                        <i className="bi bi-lightning-charge me-2"></i>Ações Rápidas
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <button 
                            className="btn btn-outline-primary w-100 py-3 border-2" 
                            onClick={() => window.location.href = '/psicologo/pacientes'}
                            style={{ transition: 'all 0.3s ease' }}
                          >
                            <i className="bi bi-people fs-4 d-block mb-2"></i>
                            <span className="fw-semibold">Ver Pacientes</span>
                          </button>
                        </div>
                        <div className="col-md-4">
                          <button 
                            className="btn btn-outline-success w-100 py-3 border-2" 
                            onClick={() => window.location.href = '/psicologo/agenda'}
                            style={{ transition: 'all 0.3s ease' }}
                          >
                            <i className="bi bi-calendar fs-4 d-block mb-2"></i>
                            <span className="fw-semibold">Ver Agenda</span>
                          </button>
                        </div>
                        <div className="col-md-4">
                          <button 
                            className="btn btn-outline-info w-100 py-3 border-2" 
                            onClick={() => window.location.href = '/psicologo/financeiro'}
                            style={{ transition: 'all 0.3s ease' }}
                          >
                            <i className="bi bi-graph-up fs-4 d-block mb-2"></i>
                            <span className="fw-semibold">Financeiro</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                      <h5 className="mb-0 text-primary fw-bold">
                        <i className="bi bi-calendar-month me-2"></i>Resumo Mensal
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3 p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="bg-success rounded-circle p-2 me-3">
                          <i className="bi bi-check-circle text-white"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{stats.sessoesMes}</div>
                          <small className="text-muted">Sessões realizadas</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3 p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="bg-primary rounded-circle p-2 me-3">
                          <i className="bi bi-people text-white"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{stats.totalPacientes}</div>
                          <small className="text-muted">Pacientes ativos</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mb-3 p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="bg-warning rounded-circle p-2 me-3">
                          <i className="bi bi-star text-white"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{stats.avaliacaoMedia}/5</div>
                          <small className="text-muted">Avaliação média</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                        <div className="bg-info rounded-circle p-2 me-3">
                          <i className="bi bi-currency-dollar text-white"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">R$ {stats.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                          <small className="text-muted">Receita mensal</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstatisticasPsicologo;

// Adicionar estilos CSS inline para hover effects
const style = document.createElement('style');
style.textContent = `
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;
document.head.appendChild(style);