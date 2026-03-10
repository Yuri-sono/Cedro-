import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import PagamentoModal from '../components/PagamentoModal.jsx';
import axios from 'axios';
import API_BASE_URL from '../config.js';

const PagamentoSessao = () => {
  const { sessaoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessao, setSessao] = useState(null);
  const [showPagamento, setShowPagamento] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSessao();
  }, [user, sessaoId]);

  const fetchSessao = async () => {
    try {
      // Simular dados da sessão
      setSessao({
        id: sessaoId,
        psicologo: {
          nome: 'Dr. João Silva',
          especialidade: 'Psicologia Clínica',
          foto: ''
        },
        data: '2024-01-15',
        horario: '14:00',
        preco: '120,00',
        duracao: '50 minutos'
      });
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePagar = () => {
    setShowPagamento(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!sessao) {
    return (
      <div className="container py-5 text-center">
        <h3>Sessão não encontrada</h3>
        <button className="btn btn-primary" onClick={() => navigate('/psicologos')}>
          Voltar aos Psicólogos
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-credit-card me-2"></i>
                Pagamento da Sessão
              </h4>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-8">
                  <h5 className="mb-3">Detalhes da Sessão</h5>
                  
                  <div className="d-flex align-items-center mb-4">
                    <div className="profile-avatar me-3" style={{ width: '60px', height: '60px' }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">{sessao.psicologo.nome}</h6>
                      <small className="text-muted">{sessao.psicologo.especialidade}</small>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar3 text-primary me-2"></i>
                        <div>
                          <small className="text-muted d-block">Data</small>
                          <span>{new Date(sessao.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-clock text-primary me-2"></i>
                        <div>
                          <small className="text-muted d-block">Horário</small>
                          <span>{sessao.horario}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-stopwatch text-primary me-2"></i>
                        <div>
                          <small className="text-muted d-block">Duração</small>
                          <span>{sessao.duracao}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-currency-dollar text-success me-2"></i>
                        <div>
                          <small className="text-muted d-block">Valor</small>
                          <span className="fw-bold">R$ {sessao.preco}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Política de Cancelamento:</strong> Você pode cancelar até 24h antes da sessão sem cobrança.
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6>Resumo do Pagamento</h6>
                      <hr />
                      <div className="d-flex justify-content-between mb-2">
                        <span>Sessão de Terapia</span>
                        <span>R$ {sessao.preco}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Taxa da plataforma</span>
                        <span>R$ 0,00</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between fw-bold mb-3">
                        <span>Total</span>
                        <span>R$ {sessao.preco}</span>
                      </div>
                      
                      <button 
                        className="btn btn-success w-100 mb-3" 
                        onClick={handlePagar}
                      >
                        <i className="bi bi-credit-card me-2"></i>
                        Pagar Agora
                      </button>
                      
                      <div className="text-center">
                        <small className="text-muted">
                          <i className="bi bi-shield-check me-1"></i>
                          Pagamento 100% seguro
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PagamentoModal 
        show={showPagamento}
        onClose={() => setShowPagamento(false)}
        plano={{
          nome: 'Sessão de Terapia',
          preco: sessao.preco
        }}
      />
    </div>
  );
};

export default PagamentoSessao;