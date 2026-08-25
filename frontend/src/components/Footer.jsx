import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="footer-logo mb-3">
              <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
                <i className="bi bi-tree me-2 fs-3"></i>
                <span className="fw-bold fs-4">CEDRO</span>
              </Link>
            </div>
            <p>Apoio psicológico acessível e de qualidade para todos que buscam bem-estar emocional e saúde mental.</p>
          </div>
          
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3">Links Rápidos</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-white text-decoration-none">Início</Link></li>
              <li className="mb-2"><a href="/#sobre" className="text-white text-decoration-none">Sobre Nós</a></li>
              <li className="mb-2"><a href="/#servicos" className="text-white text-decoration-none">Serviços</a></li>
              <li className="mb-2"><a href="/#recursos" className="text-white text-decoration-none">Recursos</a></li>
              <li><a href="/#contato" className="text-white text-decoration-none">Contato</a></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Serviços</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/atendimento-online" className="text-white text-decoration-none">Atendimento Online</Link></li>
              <li className="mb-2"><Link to="/psicologos" className="text-white text-decoration-none">Psicólogos</Link></li>
              <li className="mb-2"><Link to="/autoavaliacoes" className="text-white text-decoration-none">Autoavaliações</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Ajuda Imediata</h5>
            <p className="small mb-3">Em crise? Ligue agora, é gratuito e sigiloso.</p>
            <a href="tel:188" className="d-flex align-items-center gap-2 text-white text-decoration-none mb-2 fw-bold">
              <span className="badge bg-danger px-2 py-1">188</span>
              CVV — Apoio emocional 24h
            </a>
            <a href="tel:192" className="d-flex align-items-center gap-2 text-white text-decoration-none mb-2">
              <span className="badge bg-warning text-dark px-2 py-1">192</span>
              SAMU — Emergência médica
            </a>
            <a href="tel:190" className="d-flex align-items-center gap-2 text-white text-decoration-none">
              <span className="badge bg-primary px-2 py-1">190</span>
              Polícia Militar
            </a>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <p className="mb-0">&copy; {new Date().getFullYear()} Cedro. Todos os direitos reservados.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/termos-uso" className="text-white text-decoration-none me-3">Termos de Uso</Link>
            <Link to="/politica-privacidade" className="text-white text-decoration-none">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);