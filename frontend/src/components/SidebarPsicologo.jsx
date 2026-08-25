import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarPsicologo = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/psicologo/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/psicologo/agenda', icon: 'bi-calendar3', label: 'Agenda' },
    { path: '/psicologo/pacientes', icon: 'bi-people', label: 'Pacientes' },
    { path: '/psicologo/consultas', icon: 'bi-clipboard-pulse', label: 'Consultas' },
    { path: '/psicologo/chats', icon: 'bi-chat-dots', label: 'Mensagens' },
    { path: '/psicologo/financeiro', icon: 'bi-graph-up', label: 'Financeiro' },
    { path: '/psicologo/estatisticas', icon: 'bi-bar-chart-line', label: 'Estatísticas' },
    { path: '/psicologo/perfil', icon: 'bi-person-circle', label: 'Perfil' },
    { path: '/psicologo/configuracoes', icon: 'bi-gear', label: 'Configurações' }
  ];

  return (
    <>
      {/* Toggle do menu — visível apenas em mobile (d-md-none) */}
      <div className="col-12 d-md-none">
        <button
          type="button"
          className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-between"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="sidebar-psicologo-menu"
        >
          <span><i className="bi bi-list me-2"></i>Menu do Psicólogo</span>
          <i className={`bi ${isMobileMenuOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
        </button>
      </div>

      <div className="col-md-3 col-lg-2">
        <div
          className={`card border-0 shadow-sm ${isMobileMenuOpen ? '' : 'd-none d-md-block'}`}
          id="sidebar-psicologo-menu"
        >
          <div className="card-body p-0">
            <div className="list-group list-group-flush sidebar-psicologo-list">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`list-group-item list-group-item-action ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`bi ${item.icon} me-2`}></i>{item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarPsicologo;