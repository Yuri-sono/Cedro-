import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import API_BASE_URL from '../config.js';

const PagamentoModal = ({ show, onClose, plano, onPaymentSuccess }) => {
  const { user, updateUser } = useAuth();
  const [metodoPagamento, setMetodoPagamento] = useState('cartao');
  const [loading, setLoading] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [etapa, setEtapa] = useState('escolha'); // 'escolha', 'formulario', 'processando', 'sucesso'
  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  });

  // Resetar estado quando o modal abre/fecha ou muda de método
  useEffect(() => {
    if (!show) {
      // Reset completo ao fechar
      setTimeout(() => {
        setMetodoPagamento('cartao');
        setPixCode('');
        setEtapa('escolha');
        setLoading(false);
        setDadosCartao({ numero: '', nome: '', validade: '', cvv: '' });
      }, 300);
    }
  }, [show]);

  // Limpar PIX quando trocar para cartão e vice-versa
  const handleMetodoChange = (metodo) => {
    setMetodoPagamento(metodo);
    setPixCode('');
    setEtapa('escolha');
    setLoading(false);
  };

  const handleCartaoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'numero') {
      // Formatar número do cartão: XXXX XXXX XXXX XXXX
      const cleaned = value.replace(/\D/g, '').slice(0, 16);
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
      setDadosCartao(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'validade') {
      // Formatar validade: MM/AA
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      const formatted = cleaned.length > 2 ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}` : cleaned;
      setDadosCartao(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      setDadosCartao(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setDadosCartao(prev => ({ ...prev, [name]: value }));
    }
  };

  const gerarPixCode = () => {
    const codigo = `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2, 15)}5204000053039865802BR5925CEDRO APOIO PSICOLOGICO6009SAO PAULO62070503***6304`;
    return codigo;
  };

  const processarPagamento = async () => {
    setLoading(true);
    setEtapa('processando');
    try {
      const token = localStorage.getItem('token');
      
      if (metodoPagamento === 'pix') {
        // Simular processamento PIX
        setTimeout(async () => {
          try {
            await axios.post(`${API_BASE_URL}/api/pagamentos/confirmar`, {
              userId: user.id,
              plano: plano.nome,
              valor: plano.preco,
              metodoPagamento: 'pix'
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (plano.nome === 'Sessão de Terapia' && onPaymentSuccess) {
                await onPaymentSuccess(); // Chama a função de callback para agendar a sessão e fechar o modal
                // onPaymentSuccess já deve lidar com o fechamento do modal e redirecionamento.
            } else {
                // Lógica para pagamento de planos premium
                updateUser({ ...user, plano: 'premium' });
                setEtapa('sucesso');
                setTimeout(() => {
                    onClose(); // Fecha o modal após a mensagem de sucesso
                    // Se for necessário redirecionar após a compra de um plano premium,
                    // o componente pai (PagamentoSessao ou outro) precisa gerenciar isso via `onClose`
                    // ou passando uma função de navegação como prop.
                }, 2000); // Exibe a mensagem por 2 segundos antes de fechar
            }
          } catch (error) {
            console.error('Erro ao confirmar pagamento (PIX):', error);
            setEtapa('erro'); // Define o estado para erro
          } finally {
            setLoading(false); // Garante que o estado de carregamento seja desativado
          }
        }, 3000);
        
      } else {
        // Processar cartão
        try {
          await axios.post(`${API_BASE_URL}/api/pagamentos/processar`, {
            userId: user.id,
            plano: plano.nome,
            valor: plano.preco,
            metodoPagamento: 'cartao',
            dadosCartao
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (plano.nome === 'Sessão de Terapia' && onPaymentSuccess) {
              await onPaymentSuccess(); // Chama a função de callback para agendar a sessão e fechar o modal
              // onPaymentSuccess já deve lidar com o fechamento do modal e redirecionamento.
          } else {
              // Lógica para pagamento de planos premium
              updateUser({ ...user, plano: 'premium' });
              setEtapa('sucesso');
              setTimeout(() => {
                  onClose(); // Fecha o modal após a mensagem de sucesso
              }, 2000); // Exibe a mensagem por 2 segundos antes de fechar
          }
        } catch (error) {
          console.error('Erro no pagamento (Cartão):', error);
          setEtapa('erro'); // Define o estado para erro
        } finally {
          setLoading(false); // Garante que o estado de carregamento seja desativado
        }
      }
    } catch (error) {
      console.error('Erro inesperado ao processar pagamento:', error);
      setEtapa('erro'); // Define o estado para erro
      setLoading(false);
    }
  };

  const handleGerarPix = () => {
    const code = gerarPixCode();
    setPixCode(code);
    setEtapa('formulario');
  };

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(pixCode).then(() => {
      // Feedback visual temporário
      const btn = document.getElementById('btn-copiar-pix');
      if (btn) {
        btn.textContent = '✓ Copiado!';
        setTimeout(() => { btn.textContent = 'Copiar código'; }, 2000);
      }
    });
  };

  const isCartaoValido = () => {
    return dadosCartao.numero.replace(/\s/g, '').length >= 13 
      && dadosCartao.nome.trim().length > 2 
      && dadosCartao.validade.length === 5 
      && dadosCartao.cvv.length >= 3;
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          
          {/* Header */}
          <div className="modal-header border-0 pb-0" style={{ 
            background: metodoPagamento === 'pix' 
              ? 'linear-gradient(135deg, #198754, #20c997)' 
              : 'linear-gradient(135deg, #0d6efd, #6610f2)',
            transition: 'background 0.4s ease'
          }}>
            <h5 className="modal-title text-white fw-bold">
              <i className={`bi ${metodoPagamento === 'pix' ? 'bi-qr-code' : 'bi-credit-card'} me-2`}></i>
              Finalizar Pagamento
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          {/* Subheader com info do plano */}
          <div className="px-4 py-3 text-white" style={{ 
            background: metodoPagamento === 'pix'
              ? 'linear-gradient(135deg, #198754, #20c997)' 
              : 'linear-gradient(135deg, #0d6efd, #6610f2)',
            transition: 'background 0.4s ease'
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="opacity-75">{plano?.nome}</span>
              <span className="fs-4 fw-bold">R$ {plano?.preco}</span>
            </div>
          </div>

          <div className="modal-body p-4">
            
            {/* Etapa: Sucesso */}
            {etapa === 'sucesso' ? (
              <div className="text-center py-5 animate-on-scroll show">
                <div className="mb-4" style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #198754, #20c997)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', animation: 'checkBounce 0.5s ease'
                }}>
                  <i className="bi bi-check-lg text-white" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h4 className="fw-bold mb-2">Pagamento Confirmado!</h4>
                <p className="text-muted mb-4">Bem-vindo ao Premium! Aproveite todos os benefícios.</p>
                <button className="btn btn-success rounded-pill px-5" onClick={onClose}>
                  <i className="bi bi-check-circle me-2"></i>Fechar
                </button>
              </div>
            ) : etapa === 'erro' ? (
              <div className="text-center py-5 animate-on-scroll show">
                <div className="mb-4" style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #dc3545, #fd7e14)', // Vermelho/Laranja
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto', animation: 'checkBounce 0.5s ease'
                }}>
                  <i className="bi bi-x-lg text-white" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h4 className="fw-bold mb-2">Erro no Pagamento!</h4>
                <p className="text-muted mb-4">Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.</p>
                <button className="btn btn-danger rounded-pill px-5" onClick={onClose}>
                  <i className="bi bi-x-circle me-2"></i>Fechar
                </button>
              </div>
            ) : (
              <>
                {/* Seletor de método de pagamento */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small text-uppercase">
                    Método de Pagamento
                  </label>
                  <div className="row g-3">
                    <div className="col-6">
                      <div 
                        className={`p-3 rounded-4 text-center cursor-pointer border-2 ${
                          metodoPagamento === 'cartao' 
                            ? 'border-primary bg-primary bg-opacity-10' 
                            : 'border'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onClick={() => handleMetodoChange('cartao')}
                      >
                        <i className={`bi bi-credit-card-2-front fs-2 ${
                          metodoPagamento === 'cartao' ? 'text-primary' : 'text-muted'
                        }`}></i>
                        <p className={`mb-0 mt-1 fw-semibold small ${
                          metodoPagamento === 'cartao' ? 'text-primary' : ''
                        }`}>Cartão de Crédito</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div 
                        className={`p-3 rounded-4 text-center cursor-pointer border-2 ${
                          metodoPagamento === 'pix' 
                            ? 'border-success bg-success bg-opacity-10' 
                            : 'border'
                        }`}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onClick={() => handleMetodoChange('pix')}
                      >
                        <i className={`bi bi-qr-code fs-2 ${
                          metodoPagamento === 'pix' ? 'text-success' : 'text-muted'
                        }`}></i>
                        <p className={`mb-0 mt-1 fw-semibold small ${
                          metodoPagamento === 'pix' ? 'text-success' : ''
                        }`}>PIX</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulário do Cartão */}
                {metodoPagamento === 'cartao' && (
                  <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Número do Cartão</label>
                      <div className="input-group">
                        <span className="input-group-text bg-transparent">
                          <i className="bi bi-credit-card text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="numero"
                          placeholder="0000 0000 0000 0000"
                          value={dadosCartao.numero}
                          onChange={handleCartaoChange}
                          style={{ borderRadius: '0 10px 10px 0' }}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Nome no Cartão</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nome"
                        placeholder="Como está no cartão"
                        value={dadosCartao.nome}
                        onChange={handleCartaoChange}
                        style={{ borderRadius: '10px' }}
                      />
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold small">Validade</label>
                        <input
                          type="text"
                          className="form-control"
                          name="validade"
                          placeholder="MM/AA"
                          value={dadosCartao.validade}
                          onChange={handleCartaoChange}
                          style={{ borderRadius: '10px' }}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold small">CVV</label>
                        <div className="input-group">
                          <input
                            type="password"
                            className="form-control"
                            name="cvv"
                            placeholder="•••"
                            value={dadosCartao.cvv}
                            onChange={handleCartaoChange}
                            style={{ borderRadius: '10px 0 0 10px' }}
                          />
                          <span className="input-group-text bg-transparent">
                            <i className="bi bi-lock-fill text-muted"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PIX - Gerar código */}
                {metodoPagamento === 'pix' && !pixCode && (
                  <div className="text-center py-4" style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div className="mb-4 p-4 rounded-4" style={{ 
                      background: 'linear-gradient(135deg, rgba(25,135,84,0.08), rgba(32,201,151,0.08))',
                      border: '2px dashed rgba(25,135,84,0.3)'
                    }}>
                      <i className="bi bi-qr-code text-success" style={{ fontSize: '4rem' }}></i>
                      <h5 className="mt-3 fw-bold">Pagar com PIX</h5>
                      <p className="text-muted small mb-0">
                        Gere o código PIX e pague instantaneamente pelo seu banco
                      </p>
                    </div>
                  </div>
                )}

                {/* PIX - Código gerado */}
                {metodoPagamento === 'pix' && pixCode && etapa !== 'processando' && (
                  <div className="text-center py-3" style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div className="alert alert-success border-0 rounded-4 p-4" style={{
                      background: 'linear-gradient(135deg, rgba(25,135,84,0.1), rgba(32,201,151,0.1))'
                    }}>
                      <i className="bi bi-qr-code-scan text-success mb-2 d-block" style={{ fontSize: '2rem' }}></i>
                      <h6 className="fw-bold mb-3">Código PIX gerado!</h6>
                      <div className="bg-white rounded-3 p-3 mb-3" style={{ 
                        wordBreak: 'break-all', fontSize: '0.75rem', fontFamily: 'monospace',
                        border: '1px solid rgba(25,135,84,0.2)'
                      }}>
                        {pixCode}
                      </div>
                      <button 
                        id="btn-copiar-pix"
                        className="btn btn-outline-success btn-sm rounded-pill px-4"
                        onClick={handleCopiarPix}
                      >
                        <i className="bi bi-clipboard me-1"></i>Copiar código
                      </button>
                    </div>
                  </div>
                )}

                {/* Processando */}
                {etapa === 'processando' && (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}></div>
                    <h5 className="fw-bold">Processando pagamento...</h5>
                    <p className="text-muted">Aguarde, isso leva apenas alguns segundos</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {etapa !== 'sucesso' && etapa !== 'processando' && (
            <div className="modal-footer border-0 pt-0 px-4 pb-4">
              <div className="w-100">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <i className="bi bi-shield-lock-fill text-success me-2"></i>
                  <small className="text-muted">Pagamento 100% seguro e criptografado</small>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary flex-grow-1 rounded-pill" 
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  
                  {metodoPagamento === 'pix' && !pixCode ? (
                    <button 
                      type="button" 
                      className="btn btn-success flex-grow-1 rounded-pill fw-bold" 
                      onClick={handleGerarPix}
                    >
                      <i className="bi bi-qr-code me-2"></i>Gerar PIX
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className={`btn ${metodoPagamento === 'pix' ? 'btn-success' : 'btn-primary'} flex-grow-1 rounded-pill fw-bold`}
                      onClick={processarPagamento}
                      disabled={loading || (metodoPagamento === 'cartao' && !isCartaoValido())}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Confirmar R$ {plano?.preco}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PagamentoModal;
