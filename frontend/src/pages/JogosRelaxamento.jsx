import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PlasticoBolha from '../components/games/PlasticoBolha.jsx';
import TesteReflexo from '../components/games/TesteReflexo.jsx';
import ParticulasFugitivas from '../components/games/ParticulasFugitivas.jsx';

const JogosRelaxamento = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'bolhas');

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  return (
    <div className="container py-5 mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="text-center mb-5 fade-in">
            <h1 className="display-5 fw-bold text-primary mb-3">Passatempos para Relaxar</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Tire um momento só para você. Escolha uma atividade interativa abaixo para se distrair, aliviar a ansiedade ou apenas passar o tempo.
            </p>
          </div>

          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5">
            <div className="card-header bg-transparent border-bottom pt-4 pb-0 px-4">
              <ul className="nav nav-tabs card-header-tabs nav-fill border-0" role="tablist">
                <li className="nav-item mx-1" role="presentation">
                  <button 
                    className={`nav-link fw-bold border-0 bg-transparent pb-3 ${activeTab === 'bolhas' ? 'active text-primary border-bottom border-3 border-primary' : 'text-muted'}`} 
                    onClick={() => setActiveTab('bolhas')}
                    style={{ transition: 'all 0.2s', borderRadius: 0 }}
                  >
                    <i className="bi bi-circle-fill me-2 opacity-75"></i>Plástico Bolha
                  </button>
                </li>
                <li className="nav-item mx-1" role="presentation">
                  <button 
                    className={`nav-link fw-bold border-0 bg-transparent pb-3 ${activeTab === 'reflexo' ? 'active text-primary border-bottom border-3 border-primary' : 'text-muted'}`} 
                    onClick={() => setActiveTab('reflexo')}
                    style={{ transition: 'all 0.2s', borderRadius: 0 }}
                  >
                    <i className="bi bi-lightning-charge-fill me-2 opacity-75"></i>Teste de Reflexo
                  </button>
                </li>
                <li className="nav-item mx-1" role="presentation">
                  <button 
                    className={`nav-link fw-bold border-0 bg-transparent pb-3 ${activeTab === 'particulas' ? 'active text-primary border-bottom border-3 border-primary' : 'text-muted'}`} 
                    onClick={() => setActiveTab('particulas')}
                    style={{ transition: 'all 0.2s', borderRadius: 0 }}
                  >
                    <i className="bi bi-stars me-2 opacity-75"></i>Fugitivas
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body p-4 p-md-5 d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '550px' }}>
              {activeTab === 'bolhas' && <div className="w-100 fade-in"><PlasticoBolha /></div>}
              {activeTab === 'reflexo' && <div className="w-100 fade-in"><TesteReflexo /></div>}
              {activeTab === 'particulas' && <div className="w-100 fade-in"><ParticulasFugitivas /></div>}
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-secondary rounded-pill px-4">
              <i className="bi bi-arrow-left me-2"></i>Voltar para o Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JogosRelaxamento;
