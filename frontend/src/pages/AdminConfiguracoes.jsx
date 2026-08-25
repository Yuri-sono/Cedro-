import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const AdminConfiguracoes = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tema, setTema] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [nomeSistema, setNomeSistema] = useState(localStorage.getItem('cedro_system_name') || 'Cedro Plus');
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('theme', tema);
  }, [tema]);

  const aplicarTema = (novoTema) => {
    setTema(novoTema);
    document.documentElement.setAttribute('data-theme', novoTema);
    localStorage.setItem('theme', novoTema);
  };

  const salvarNomeSistema = () => {
    localStorage.setItem('cedro_system_name', nomeSistema.trim() || 'Cedro Plus');
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const canaisAjuda = [
    { nome: 'CVV — Centro de Valorização da Vida', numero: '188', desc: 'Apoio emocional e prevenção ao suicídio — 24h', tel: '188', cor: 'danger', icone: 'bi-heart-pulse' },
    { nome: 'SAMU', numero: '192', desc: 'Emergências médicas / ambulância', tel: '192', cor: 'warning', icone: 'bi-ambulance' },
    { nome: 'Polícia Militar', numero: '190', desc: 'Emergência policial', tel: '190', cor: 'primary', icone: 'bi-shield' },
    { nome: 'Corpo de Bombeiros', numero: '193', desc: 'Incêndios e resgates', tel: '193', cor: 'danger', icone: 'bi-fire' },
    { nome: 'Disque Direitos Humanos', numero: '100', desc: 'Direitos humanos e denúncias', tel: '100', cor: 'info', icone: 'bi-megaphone' },
    { nome: 'Disque Denúncia', numero: '181', desc: 'Denúncias anônimas', tel: '181', cor: 'secondary', icone: 'bi-phone-vibrate' }
  ];

  return (
    <div className="admin-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="bi bi-gear me-2"></i>Configurações do Sistema
          </span>
          <div className="navbar-nav ms-auto">
            <button className="btn btn-outline-light btn-sm me-2" onClick={() => navigate('/admin/dashboard')}>
              <i className="bi bi-arrow-left me-1"></i>Voltar
            </button>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4 admin-bg">
        <style>{`
          .admin-bg { background-color: var(--bg-secondary, #f8f9fa); min-height: calc(100vh - 56px); }
          [data-theme="dark"] .admin-bg { background-color: #0d0f0d; }
          .config-section-title {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            font-weight: 700;
            color: #198754;
            margin-bottom: 1rem;
          }
          [data-theme="dark"] .config-section-title { color: #20c997; }
        `}</style>

        <div className="row g-4">
          {/* Aparência */}
          <div className="col-lg-6">
            <div className="config-card h-100">
              <div className="config-card-header">
                <h5 className="mb-0"><i className="bi bi-palette me-2"></i>Aparência</h5>
              </div>
              <div className="card-body p-4">
                <div className="config-option mb-3">
                  <div>
                    <h6 className="fw-semibold mb-1">Tema do sistema</h6>
                    <small className="text-muted">Alterna entre claro e escuro em toda a plataforma</small>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 ${tema === 'light' ? 'btn-warning' : 'btn-outline-secondary'}`}
                      onClick={() => aplicarTema('light')}
                    >
                      <i className="bi bi-sun me-1"></i>Claro
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 ${tema === 'dark' ? 'btn-dark' : 'btn-outline-secondary'}`}
                      onClick={() => aplicarTema('dark')}
                    >
                      <i className="bi bi-moon-stars me-1"></i>Escuro
                    </button>
                  </div>
                </div>

                <div className="config-option">
                  <div>
                    <h6 className="fw-semibold mb-1">Nome do sistema</h6>
                    <small className="text-muted">Aparece no título da plataforma</small>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="text"
                      className="form-control"
                      style={{ maxWidth: '180px' }}
                      value={nomeSistema}
                      onChange={e => setNomeSistema(e.target.value)}
                    />
                    <button className="btn btn-success btn-sm" onClick={salvarNomeSistema}>
                      <i className="bi bi-check-lg me-1"></i>Salvar
                    </button>
                  </div>
                </div>
                {salvo && (
                  <div className="alert alert-success mt-3 mb-0 py-2">
                    <i className="bi bi-check-circle me-1"></i>Configuração salva!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Canais de ajuda / emergência */}
          <div className="col-lg-6">
            <div className="config-card h-100">
              <div className="config-card-header">
                <h5 className="mb-0"><i className="bi bi-telephone-plus me-2"></i>Canais de socorro (reais)</h5>
              </div>
              <div className="card-body p-4">
                <p className="text-muted mb-3">
                  <i className="bi bi-info-circle me-1"></i>
                  Números oficiais disponíveis em todo o Brasil. O <strong>CVV (188)</strong> oferece apoio emocional gratuito, 24h.
                </p>
                <div className="row g-3">
                  {canaisAjuda.map((canal, idx) => (
                    <div className="col-sm-6" key={idx}>
                      <a
                        href={`tel:${canal.tel}`}
                        className={`list-group-item list-group-item-action d-flex align-items-center gap-3 rounded-3 mb-0 border-0 bg-${canal.cor} bg-opacity-10 text-decoration-none`}
                        style={{ padding: '0.85rem 1rem' }}
                      >
                        <span className={`btn btn-sm btn-${canal.cor} text-white rounded-circle flex-shrink-0`} style={{ width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={`bi ${canal.icone}`}></i>
                        </span>
                        <span className="flex-grow-1">
                          <strong className="d-block" style={{ fontSize: '0.9rem' }}>{canal.nome}</strong>
                          <small className="text-muted d-block">{canal.desc}</small>
                        </span>
                        <span className="fw-bold h5 mb-0">{canal.numero}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sobre o sistema */}
          <div className="col-12">
            <div className="config-card">
              <div className="config-card-header">
                <h5 className="mb-0"><i className="bi bi-info-square me-2"></i>Sobre o sistema</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <span className="config-chip"><i className="bi bi-tree"></i>{nomeSistema}</span>
                  </div>
                  <div className="col-md-4">
                    <span className="config-chip"><i className="bi bi-box-seam"></i>Backend Spring Boot 3</span>
                  </div>
                  <div className="col-md-4">
                    <span className="config-chip"><i className="bi bi-shield-lock"></i>Autenticação JWT</span>
                  </div>
                </div>
                <p className="text-muted small mt-3 mb-0">
                  <i className="bi bi-shield-exclamation me-1"></i>
                  Em caso de crise, ligue 188 (CVV) — atendimento gratuito 24 horas. Esta plataforma não substitui atendimento emergencial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;