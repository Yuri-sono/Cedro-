import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';

const AtendimentoOnline = () => {
  const [activeTab, setActiveTab] = useState('agendar');
  const [psicologos, setPsicologos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const buscarPsicologos = async () => {
    setLoading(true);
    setErro('');
    try {
      const response = await api.get('/api/psicologos');
      setPsicologos(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar psicólogos:', error);
      setErro('Não foi possível carregar a lista de psicólogos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPsicologos();
  }, []);

  const agendarComPsicologo = (psicologoId) => {
    if (isAuthenticated) {
      navigate(`/agendar-sessao/${psicologoId}`);
      return;
    }
    // Visitante não logado: guarda a escolha e vai para o login, retornando
    // ao fluxo de agendamento após autenticar (via location.state.returnTo).
    sessionStorage.setItem('psicologoIdPendente', String(psicologoId));
    navigate('/login', { state: { returnTo: `/agendar-sessao/${psicologoId}` } });
  };

  const formatarPreco = (valor) => {
    const numero = parseFloat(valor);
    return Number.isFinite(numero) ? numero.toFixed(2) : '0.00';
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <h1 className="fw-bold mb-4 text-center">Atendimento Online</h1>
            <p className="lead text-center mb-5">Consultas virtuais com a mesma qualidade do atendimento presencial.</p>
            
            <div className="card border-0 shadow">
              <div className="card-header bg-transparent">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'agendar' ? 'active' : ''}`}
                      onClick={() => setActiveTab('agendar')}
                    >
                      <i className="bi bi-calendar-plus me-2"></i>Agendar
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                      onClick={() => setActiveTab('info')}
                    >
                      <i className="bi bi-info-circle me-2"></i>Informações
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-4">
                {activeTab === 'agendar' && (
                  <div>
                    <div className="text-center mb-4">
                      <h3 className="fw-bold">Escolha um psicólogo</h3>
                      <p className="text-muted">
                        Selecione o profissional e finalize o agendamento em poucos cliques.
                      </p>
                    </div>

                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Carregando...</span>
                        </div>
                        <p className="text-muted mt-3">Carregando psicólogos...</p>
                      </div>
                    ) : erro ? (
                      <div className="text-center py-4">
                        <div className="alert alert-danger d-inline-block">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          {erro}
                        </div>
                        <div className="mt-3">
                          <button className="btn btn-primary" onClick={buscarPsicologos}>
                            <i className="bi bi-arrow-clockwise me-2"></i>Tentar novamente
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="row g-4">
                          {psicologos.map((psicologo) => (
                            <div key={psicologo.id} className="col-md-6">
                              <div className="card h-100 shadow-sm border-0">
                                <div className="card-body p-4">
                                  <div className="d-flex align-items-start mb-3">
                                    <div
                                      className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center flex-shrink-0 me-3"
                                      style={{
                                        width: '56px',
                                        height: '56px',
                                        ...((psicologo.fotoUrl || psicologo.foto_url) ? {
                                          backgroundImage: `url(${psicologo.fotoUrl || psicologo.foto_url})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center'
                                        } : {})
                                      }}
                                    >
                                      {!(psicologo.fotoUrl || psicologo.foto_url) && (
                                        <i className="bi bi-person-fill text-white"></i>
                                      )}
                                    </div>
                                    <div>
                                      <h5 className="card-title fw-bold mb-1">{psicologo.nome}</h5>
                                      {psicologo.especialidade && (
                                        <p className="text-muted mb-1 small">
                                          <i className="bi bi-bookmark-fill text-primary me-2"></i>
                                          {psicologo.especialidade}
                                        </p>
                                      )}
                                      {psicologo.avaliacao && (
                                        <small className="text-warning">
                                          <i className="bi bi-star-fill me-1"></i>
                                          {parseFloat(psicologo.avaliacao).toFixed(1)}
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                    <div>
                                      <small className="text-muted d-block">Valor da sessão</small>
                                      <span className="h5 text-success mb-0 fw-bold">
                                        R$ {formatarPreco(psicologo.precoSessao || psicologo.preco_sessao)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                                  <div className="d-grid">
                                    <button
                                      className="btn btn-success w-100 py-2"
                                      onClick={() => agendarComPsicologo(psicologo.id)}
                                    >
                                      <i className="bi bi-calendar-plus me-2"></i>
                                      Agendar com este psicólogo
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {psicologos.length === 0 && (
                          <div className="text-center py-5">
                            <i className="bi bi-person-x fs-1 text-muted"></i>
                            <h4 className="fw-bold mt-3">Nenhum psicólogo disponível</h4>
                            <p className="text-muted">Tente novamente mais tarde.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <h4 className="fw-bold mb-3">Vantagens</h4>
                        <ul className="list-unstyled">
                          <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Comodidade de casa</li>
                          <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Economia de tempo</li>
                          <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Maior flexibilidade</li>
                          <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Mesma eficácia</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h4 className="fw-bold mb-3">Requisitos</h4>
                        <ul className="list-unstyled">
                          <li className="mb-2"><i className="bi bi-wifi text-primary me-2"></i>Internet estável</li>
                          <li className="mb-2"><i className="bi bi-laptop text-primary me-2"></i>Dispositivo com câmera</li>
                          <li className="mb-2"><i className="bi bi-mic text-primary me-2"></i>Microfone funcionando</li>
                          <li className="mb-2"><i className="bi bi-house text-primary me-2"></i>Ambiente privado</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="alert alert-info mt-4">
                      <h5 className="alert-heading">Segurança e Privacidade</h5>
                      <p className="mb-0">Todas as consultas são realizadas em plataformas criptografadas, garantindo total confidencialidade e segurança dos seus dados.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtendimentoOnline;