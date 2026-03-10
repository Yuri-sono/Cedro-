import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const NavbarPsicologo = ({ psicologo }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/psicologo/dashboard">
          <i className="bi bi-tree me-2"></i>Cedro | Área do Psicólogo
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarPsicologo"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarPsicologo">
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <div className="profile-avatar-small" style={(psicologo?.fotoUrl || psicologo?.foto_url) ? {
                  backgroundImage: `url(${psicologo?.fotoUrl || psicologo?.foto_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : {}}>
                  {!(psicologo?.fotoUrl || psicologo?.foto_url) && <i className="bi bi-person-fill"></i>}
                </div>
                <span className="ms-2">{psicologo?.nome || 'Psicólogo'}</span>
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/psicologo/perfil">
                  <i className="bi bi-person-circle"></i>Meu Perfil
                </Link></li>
                <li><Link className="dropdown-item" to="/psicologo/configuracoes">
                  <i className="bi bi-gear"></i>Configurações
                </Link></li>
                <li><Link className="dropdown-item" to="/psicologo/estatisticas">
                  <i className="bi bi-graph-up"></i>Estatísticas
                </Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>Sair
                </button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPsicologo;