import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    usuarios: 156,
    psicologos: 23,
    sessoes: 89,
    receita: 12450
  });
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem('adminLogado');
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setAdminData(JSON.parse(admin));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLogado');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!adminData) return null;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard Administrativo
          </span>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              <i className="bi bi-person-circle me-1"></i>
              {adminData.nome}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4 admin-bg" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <style>{`
          .admin-bg {
            background-color: #f8f9fa;
          }
          [data-theme="dark"] .admin-bg {
            background-color: #1a1a1a;
          }
          [data-theme="dark"] .card {
            background-color: #2d2d2d;
            color: #ffffff;
          }
          [data-theme="dark"] .text-muted {
            color: #aaaaaa !important;
          }
        `}</style>
        {/* Cards de Estatísticas */}
        <div className="row mb-5">
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card text-white h-100" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold">{stats.usuarios}</h3>
                    <p className="mb-0 opacity-75">Usuários Ativos</p>
                  </div>
                  <i className="bi bi-people" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card text-white h-100" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold">{stats.psicologos}</h3>
                    <p className="mb-0 opacity-75">Psicólogos</p>
                  </div>
                  <i className="bi bi-person-badge" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card text-white h-100" style={{ background: 'linear-gradient(135deg, #17a2b8, #6f42c1)' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold">{stats.sessoes}</h3>
                    <p className="mb-0 opacity-75">Sessões</p>
                  </div>
                  <i className="bi bi-calendar-check" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-3">
            <div className="card text-white h-100" style={{ background: 'linear-gradient(135deg, #fd7e14, #e83e8c)' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold">R$ {stats.receita.toLocaleString()}</h3>
                    <p className="mb-0 opacity-75">Receita Mensal</p>
                  </div>
                  <i className="bi bi-graph-up-arrow" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu de Ações */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-people text-primary" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">Gerenciar Usuários</h5>
                <p className="text-muted">Visualizar, editar e remover usuários</p>
                <button className="btn btn-primary" onClick={() => navigate('/admin/usuarios')}>Acessar</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-person-badge text-success" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">Gerenciar Psicólogos</h5>
                <p className="text-muted">Aprovar, editar e remover psicólogos</p>
                <button className="btn btn-success" onClick={() => navigate('/admin/usuarios')}>Acessar</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-calendar-check text-warning" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">Gerenciar Sessões</h5>
                <p className="text-muted">Visualizar e gerenciar sessões</p>
                <button className="btn btn-warning" onClick={() => navigate('/admin/sessoes')}>Acessar</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-graph-up text-info" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">Relatórios</h5>
                <p className="text-muted">Gerar relatórios e estatísticas</p>
                <button className="btn btn-info">Acessar</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-gear text-secondary" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">Configurações</h5>
                <p className="text-muted">Configurações do sistema</p>
                <button className="btn btn-secondary">Acessar</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <i className="bi bi-shield-check text-danger" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">Segurança</h5>
                <p className="text-muted">Logs e auditoria do sistema</p>
                <button className="btn btn-danger">Acessar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;