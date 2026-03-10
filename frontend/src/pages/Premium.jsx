import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import PagamentoModal from '../components/PagamentoModal.jsx';
import '../styles/premium.css';

const Premium = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPagamento, setShowPagamento] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  const handleAssinar = () => {
    if (!user) {
      alert('Faça login para assinar o Premium');
      navigate('/login');
      return;
    }
    
    setPlanoSelecionado({
      nome: 'Premium',
      preco: '13,90'
    });
    setShowPagamento(true);
  };

  return (
    <div className="premium-section">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-star-fill text-warning me-2"></i>
            Cedro Premium
          </h1>
          <p className="lead text-muted">Eleve sua experiência de bem-estar mental</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-5 mb-4">
            <div className="plan-card free-plan">
              <div className="plan-header">
                <h3>Plano Gratuito</h3>
                <div className="plan-price">
                  <span className="price">R$ 0</span>
                  <span className="period">/mês</span>
                </div>
              </div>
              <div className="plan-body">
                <ul className="benefits-list">
                  <li><i className="bi bi-check-circle-fill"></i> Acesso básico à plataforma</li>
                  <li><i className="bi bi-check-circle-fill"></i> Agendamento de sessões</li>
                  <li><i className="bi bi-check-circle-fill"></i> Chat com psicólogos</li>
                  <li className="disabled"><i className="bi bi-x-circle-fill"></i> Anúncios presentes</li>
                  <li className="disabled"><i className="bi bi-x-circle-fill"></i> Suporte padrão</li>
                </ul>
              </div>
              <div className="plan-footer">
                <button className="btn btn-outline-secondary w-100" disabled>
                  Plano Atual
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5 mb-4">
            <div className="plan-card premium-plan">
              <div className="premium-badge">
                <i className="bi bi-star-fill"></i> Recomendado
              </div>
              <div className="plan-header">
                <h3>Plano Premium</h3>
                <div className="plan-price">
                  <span className="price">R$ 13,90</span>
                  <span className="period">/mês</span>
                </div>
              </div>
              <div className="plan-body">
                <ul className="benefits-list">
                  <li><i className="bi bi-check-circle-fill"></i> Tudo do plano gratuito</li>
                  <li><i className="bi bi-check-circle-fill"></i> <strong>Sem anúncios</strong></li>
                  <li><i className="bi bi-check-circle-fill"></i> <strong>Experiência premium</strong></li>
                  <li><i className="bi bi-check-circle-fill"></i> <strong>Suporte prioritário</strong></li>
                  <li><i className="bi bi-check-circle-fill"></i> Acesso antecipado a novos recursos</li>
                </ul>
              </div>
              <div className="plan-footer">
                <button className="btn btn-premium w-100" onClick={handleAssinar}>
                  <i className="bi bi-star-fill me-2"></i>
                  {user?.plano === 'premium' ? 'Plano Ativo' : 'Assinar Premium'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-features mt-5">
          <h3 className="text-center mb-4">Por que escolher o Premium?</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-badge-ad"></i>
                </div>
                <h5>Sem Anúncios</h5>
                <p>Navegue sem interrupções e foque totalmente no seu bem-estar</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-gem"></i>
                </div>
                <h5>Experiência Premium</h5>
                <p>Interface aprimorada e recursos exclusivos para sua jornada</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-headset"></i>
                </div>
                <h5>Suporte Prioritário</h5>
                <p>Atendimento rápido e dedicado sempre que precisar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PagamentoModal 
        show={showPagamento}
        onClose={() => setShowPagamento(false)}
        plano={planoSelecionado}
      />
    </div>
  );
};

export default Premium;
