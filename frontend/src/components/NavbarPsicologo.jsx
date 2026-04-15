import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const NavbarPsicologo = ({ psicologo }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const closeMenu = () => {
    const btnClose = document.querySelector('#offcanvasPsicologo .btn-close');
    if (btnClose) btnClose.click();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid d-flex align-items-center">
          <Link className="navbar-brand fw-bold" to="/psicologo/dashboard">
            <i className="bi bi-tree me-2"></i>Cedro | Área do Psicólogo
          </Link>
          <div className="d-flex align-items-center ms-auto">
            <span className="header-greeting d-none d-md-block me-4 fw-medium text-white">
              Olá, {psicologo?.nome || 'Psicólogo'}
            </span>
            <button 
              className="navbar-toggler custom-toggler border-0 shadow-none" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#offcanvasPsicologo" 
              aria-label="Abrir menu"
            >
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
        </div>
      </nav>

      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasPsicologo">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <div className="text-center mb-4 pb-3 border-bottom">
            <div className="profile-avatar-small mx-auto mb-2" style={(psicologo?.fotoUrl || psicologo?.foto_url) ? {
              backgroundImage: `url(${psicologo?.fotoUrl || psicologo?.foto_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}>
              {!(psicologo?.fotoUrl || psicologo?.foto_url) && <i className="bi bi-person-fill"></i>}
            </div>
            <p className="mb-0 fw-bold">{psicologo?.nome || 'Psicólogo'}</p>
          </div>

          <ul className="list-unstyled">
            <li className="mb-2"><Link className="d-block p-2" to="/psicologo/perfil" onClick={closeMenu}>
              <i className="bi bi-person-circle me-2"></i>Meu Perfil
            </Link></li>
            <li className="mb-2"><Link className="d-block p-2" to="/psicologo/configuracoes" onClick={closeMenu}>
              <i className="bi bi-gear me-2"></i>Configurações
            </Link></li>
            <li className="mb-2"><Link className="d-block p-2" to="/psicologo/estatisticas" onClick={closeMenu}>
              <i className="bi bi-graph-up me-2"></i>Estatísticas
            </Link></li>
            <li className="mb-2"><button className="btn btn-link d-block p-2 text-start w-100 text-decoration-none" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Sair
            </button></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavbarPsicologo;