import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import PagamentoModal from '../components/PagamentoModal.jsx';
import '../styles/premium.css';

const Premium = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPagamento, setShowPagamento] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [statusAssinatura, setStatusAssinatura] = useState({
    isPremium: false,
    chamadasRealizadas: 0,
    limiteMensal: 0
  });

  useEffect(() => {
    if (!user) return;
    api.get('/api/assinatura/status')
      .then((res) => {
        setStatusAssinatura({
          isPremium: Boolean(res.data?.isPremium),
          chamadasRealizadas: Number(res.data?.chamadasRealizadas) || 0,
          limiteMensal: Number(res.data?.limiteMensal) || 0
        });
      })
      .catch(() => {
        setStatusAssinatura({ isPremium: false, chamadasRealizadas: 0, limiteMensal: 4 });
      });
  }, [user]);

  const ehPremium = statusAssinatura.isPremium || user?.plano === 'premium';
  const temLimite = statusAssinatura.limiteMensal > 0 && statusAssinatura.limiteMensal !== Number.MAX_SAFE_INTEGER;
  const percentualUsado = ehPremium
    ? 100
    : temLimite
      ? Math.min(100, Math.round((statusAssinatura.chamadasRealizadas / statusAssinatura.limiteMensal) * 100))
      : 0;

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

        {/* Cota mensal de reuniões (igual ao mobile — PaywallScreen) */}
        {user && (
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4" style={{ color: 'var(--text-primary, #212529)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary, #212529)' }}>
                      <i className="bi bi-camera-video me-2 text-primary"></i>
                      Reuniões gratuitas este mês
                    </h5>
                    <span className="badge bg-primary">
                      {ehPremium ? 'Premium — ilimitado' : `${statusAssinatura.chamadasRealizadas}/${statusAssinatura.limiteMensal || 4}`}
                    </span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className={`progress-bar ${ehPremium ? 'bg-success' : percentualUsado >= 100 ? 'bg-danger' : 'bg-primary'}`}
                      role="progressbar"
                      style={{ width: `${percentualUsado}%` }}
                      aria-valuenow={percentualUsado}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <small className="text-muted d-block mt-2">
                    {ehPremium
                      ? 'Você é Premium: suas sessões online via Google Meet são ilimitadas.'
                      : `Você usou ${statusAssinatura.chamadasRealizadas} de ${statusAssinatura.limiteMensal || 4} reuniões gratuitas neste mês.`}
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <li><i className="bi bi-check-circle-fill"></i> <strong>Reuniões via Google Meet ilimitadas</strong></li>
                  <li><i className="bi bi-check-circle-fill"></i> <strong>Sem anúncios</strong></li>
                  <li><i className="bi bi-check-circle-fill"></i> <strong>Experiência premium</strong></li>
                  <li><i className="bi bi-check-circle-fill"></i> <strong>Suporte prioritário</strong></li>
                  <li><i className="bi bi-check-circle-fill"></i> Acesso antecipado a novos recursos</li>
                </ul>
              </div>
              <div className="plan-footer">
                <button className="btn btn-premium w-100" onClick={handleAssinar}>
                  <i className="bi bi-star-fill me-2"></i>
                  {ehPremium ? 'Plano Ativo' : 'Assinar Premium'}
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
