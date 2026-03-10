import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container text-center text-white">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="error-animation mb-4" style={{ animation: 'bounce 2s infinite' }}>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <i className="bi bi-tree" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                <h1 className="display-1 fw-bold mx-3" style={{ fontSize: '8rem', textShadow: '4px 4px 8px rgba(0,0,0,0.3)' }}>404</h1>
                <i className="bi bi-tree" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
              </div>
            </div>
            
            <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Ops! Página Perdida</h2>
            <p className="lead mb-4" style={{ fontSize: '1.2rem', opacity: 0.9 }}>
              Parece que você se perdeu na floresta... Esta página não existe ou foi movida.
            </p>
            
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/" className="btn btn-light btn-lg shadow">
                <i className="bi bi-house-fill me-2"></i>Voltar para Home
              </Link>
              <Link to="/psicologos" className="btn btn-outline-light btn-lg">
                <i className="bi bi-people me-2"></i>Ver Psicólogos
              </Link>
            </div>
            
            <div className="mt-5">
              <p className="small" style={{ opacity: 0.7 }}>
                <i className="bi bi-info-circle me-2"></i>
                Se você acha que isso é um erro, entre em contato conosco
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .not-found-page {
          position: relative;
          overflow: hidden;
        }
        
        .not-found-page::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: moveBackground 20s linear infinite;
        }
        
        @keyframes moveBackground {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        .btn-light:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        
        .btn-outline-light:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
