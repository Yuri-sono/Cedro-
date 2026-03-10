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
              <li className="mb-2"><Link to="/terapia-individual" className="text-white text-decoration-none">Terapia Individual</Link></li>
              <li className="mb-2"><Link to="/terapia-grupo" className="text-white text-decoration-none">Terapia em Grupo</Link></li>
              <li className="mb-2"><Link to="/atendimento-online" className="text-white text-decoration-none">Atendimento Online</Link></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">Palestras e Workshops</a></li>
              <li><a href="#" className="text-white text-decoration-none">Programas Corporativos</a></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Newsletter</h5>
            <p>Receba dicas de saúde mental e novidades sobre nossos serviços.</p>
            <form className="mt-3">
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Seu email" required />
                <button className="btn btn-primary" type="submit">Inscrever</button>
              </div>
            </form>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <p className="mb-0">&copy; 2023 Cedro. Todos os direitos reservados.</p>
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

export default Footer;