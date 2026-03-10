import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType) {
    const userType = user?.tipoUsuario || user?.tipo_usuario;
    if (requiredUserType === 'psicologo' && userType !== 'psicologo') {
      return <Navigate to="/login-psicologo" replace />;
    }
    if (requiredUserType !== 'psicologo' && userType !== requiredUserType) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;