import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const isUserLoggedIn = isAuthenticated;
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-tree me-2 fs-3"></i>
          <span className="fw-bold fs-4">CEDRO</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Início</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#sobre">Sobre Nós</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#servicos">Serviços</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/psicologos">Psicólogos</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#recursos">Recursos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#contato">Contato</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/premium">
                <i className="bi bi-star-fill text-warning me-1"></i>
                Premium
              </Link>
            </li>
            {isUserLoggedIn ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <div className="profile-avatar-small" style={(user?.fotoUrl || user?.foto_url) ? {
                    backgroundImage: `url(${user?.fotoUrl || user?.foto_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}>
                    {!(user?.fotoUrl || user?.foto_url) && <i className="bi bi-person-fill"></i>}
                  </div>
                  <span className="ms-2">{user?.nome || 'Usuário'}</span>
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/perfil">
                    <i className="bi bi-person-circle"></i>Meu Perfil
                  </Link></li>
                  {user?.tipoUsuario === 'psicologo' && (
                    <li><Link className="dropdown-item" to="/psicologo/dashboard">
                      <i className="bi bi-speedometer2"></i>Dashboard
                    </Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={logout}>
                    <i className="bi bi-box-arrow-right"></i>Sair
                  </button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </a>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/login">Paciente</Link></li>
                  <li><Link className="dropdown-item" to="/login-psicologo">Psicólogo</Link></li>
                </ul>
              </li>
            )}
          </ul>
          <a href="/#ajuda" className="btn btn-light ms-3">Preciso de Ajuda</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;