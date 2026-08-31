import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import PersonalizacaoMenu from './PersonalizacaoMenu.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const closeMenu = () => {
    const btnClose = document.querySelector('#offcanvasMenu .btn-close');
    if (btnClose) btnClose.click();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const handleInicio = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    closeMenu();
  };
  
  return (
    <>
      <nav className="navbar navbar-dark sticky-top">
        <div className="container d-flex align-items-center">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="bi bi-tree me-2 fs-3"></i>
            <span className="fw-bold fs-4">CEDRO</span>
          </Link>
          {/* Navegação inline — visível apenas em desktop (>= 992px) */}
          <ul className="navbar-nav flex-row gap-1 d-none d-lg-flex mx-auto mb-0">
            <li className="nav-item"><a className="nav-link text-white" href="/" onClick={handleInicio}>Início</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="/#sobre">Sobre Nós</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="/#servicos">Serviços</a></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/psicologos">Psicólogos</Link></li>
            <li className="nav-item"><a className="nav-link text-white" href="/#contato">Contato</a></li>
          </ul>
          <div className="d-flex align-items-center ms-auto">
            {isAuthenticated && (
              <span className="header-greeting d-none d-md-block me-4 fw-medium text-white">
                Olá, {user?.nome || 'Usuário'}
              </span>
            )}
            {/* Itens de conta — visíveis apenas em desktop (>= 992px) */}
            {isAuthenticated ? (
              <div className="dropdown d-none d-lg-block me-3">
                <button
                  className="btn btn-link nav-link dropdown-toggle text-white p-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Minha Conta
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/perfil">Meu Perfil</Link></li>
                  <li><Link className="dropdown-item" to="/minhas-sessoes">Minhas Sessões</Link></li>
                  {user?.tipoUsuario === 'psicologo' && (
                    <li><Link className="dropdown-item" to="/psicologo/dashboard">Dashboard</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" type="button" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Sair
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-none d-lg-flex align-items-center gap-3 me-3">
                <Link className="nav-link text-white p-0" to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>Login Paciente
                </Link>
                <Link className="nav-link text-white p-0" to="/login-psicologo">
                  <i className="bi bi-box-arrow-in-right me-1"></i>Login Psicólogo
                </Link>
              </div>
            )}
            <button
              className="navbar-toggler custom-toggler border-0 shadow-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
              aria-label="Abrir menu"
            >
              <span className="navbar-burger-line d-block"></span>
              <span className="navbar-burger-line d-block"></span>
              <span className="navbar-burger-line d-block"></span>
            </button>
          </div>
        </div>
      </nav>

      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasMenu">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {isAuthenticated && (
            <div className="text-center mb-4 pb-3 border-bottom">
              <div className="profile-avatar-small mx-auto mb-2" style={(user?.fotoUrl || user?.foto_url) ? {
                backgroundImage: `url(${user?.fotoUrl || user?.foto_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}>
                {!(user?.fotoUrl || user?.foto_url) && <i className="bi bi-person-fill"></i>}
              </div>
              <p className="mb-0 fw-bold">{user?.nome || 'Usuário'}</p>
            </div>
          )}

          <ul className="list-unstyled">
            <div className="d-lg-none">
              <li className="mb-2"><a className="d-block p-2" href="/" onClick={handleInicio}>Início</a></li>
              <li className="mb-2"><a className="d-block p-2" href="/#sobre" onClick={closeMenu}>Sobre Nós</a></li>
              <li className="mb-2"><a className="d-block p-2" href="/#servicos" onClick={closeMenu}>Serviços</a></li>
              <li className="mb-2"><Link className="d-block p-2" to="/psicologos" onClick={closeMenu}>Psicólogos</Link></li>
              <li className="mb-2"><a className="d-block p-2" href="/#contato" onClick={closeMenu}>Contato</a></li>
            </div>
            <li className="mb-2"><Link className="d-block p-2" to="/saude-mental" onClick={closeMenu}>
              <i className="bi bi-heart-pulse me-2 text-danger"></i>Saúde Mental
            </Link></li>
            <li className="mb-2"><Link className="d-block p-2" to="/relaxar" onClick={closeMenu}>
              <i className="bi bi-controller me-2 text-info"></i>Passatempos
            </Link></li>
            <li className="mb-2"><Link className="d-block p-2" to="/premium" onClick={closeMenu}>
              <i className="bi bi-star-fill text-warning me-2"></i>Premium
            </Link></li>
          </ul>

          <PersonalizacaoMenu />

          <hr />

          {isAuthenticated ? (
            <ul className="list-unstyled">
              <li className="mb-2"><Link className="d-block p-2" to="/perfil" onClick={closeMenu}>
                <i className="bi bi-person-circle me-2"></i>Meu Perfil
              </Link></li>
              <li className="mb-2"><Link className="d-block p-2" to="/minhas-conversas" onClick={closeMenu}>
                <i className="bi bi-chat-dots me-2"></i>Minhas Conversas
              </Link></li>
              <li className="mb-2"><Link className="d-block p-2" to="/minhas-sessoes" onClick={closeMenu}>
                <i className="bi bi-calendar-check me-2"></i>Minhas Sessões
              </Link></li>
              {user?.tipoUsuario === 'psicologo' && (
                <li className="mb-2"><Link className="d-block p-2" to="/psicologo/dashboard" onClick={closeMenu}>
                  <i className="bi bi-speedometer2 me-2"></i>Dashboard
                </Link></li>
              )}
              <li className="mb-2"><a className="d-block p-2" href="/#ajuda" onClick={closeMenu}>
                <i className="bi bi-question-circle me-2"></i>Preciso de Ajuda
              </a></li>
              <li className="mb-2"><button className="btn btn-link d-block p-2 text-start w-100 text-decoration-none" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Sair
              </button></li>
            </ul>
          ) : (
            <ul className="list-unstyled">
              <li className="mb-2"><Link className="d-block p-2" to="/login" onClick={closeMenu}>
                <i className="bi bi-box-arrow-in-right me-2"></i>Login Paciente
              </Link></li>
              <li className="mb-2"><Link className="d-block p-2" to="/login-psicologo" onClick={closeMenu}>
                <i className="bi bi-box-arrow-in-right me-2"></i>Login Psicólogo
              </Link></li>
              <li className="mb-2"><a className="d-block p-2" href="/#ajuda" onClick={closeMenu}>
                <i className="bi bi-question-circle me-2"></i>Preciso de Ajuda
              </a></li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Navbar);