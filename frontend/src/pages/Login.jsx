import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import API_BASE_URL from '../config.js';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [senhaValidacao, setSenhaValidacao] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [showRecuperarSenha, setShowRecuperarSenha] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'senha' && !isLogin) {
      setSenhaValidacao({
        minLength: value.length >= 6,
        hasNumber: /\d/.test(value),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
  };

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) return;
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        initializeGoogle();
      };
    };

    const initializeGoogle = () => {
      if (window.google) {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === 'seu_google_client_id_aqui') {
          console.warn('VITE_GOOGLE_CLIENT_ID não configurado. Login com Google desabilitado.');
          return;
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLogin
        });
        renderGoogleButton();
      }
    };

    loadGoogleScript();
    
    // Initialize if script was already loaded
    if (window.google) {
      initializeGoogle();
    }
  }, []);

  const renderGoogleButton = () => {
    if (window.google && isLogin) {
      const btnContainer = document.getElementById('googleSignInButton');
      if (btnContainer) {
        window.google.accounts.id.renderButton(
          btnContainer,
          { theme: 'outline', size: 'large', text: 'continue_with' }
        );
      }
    }
  };

  useEffect(() => {
    renderGoogleButton();
  }, [isLogin]);

  const handleGoogleLogin = async (response) => {
    setErrorMsg('');
    try {
      // SEGURANÇA: Enviar o token inteiro para validação server-side
      // O backend decodifica e valida o token do Google
      const res = await api.post('/api/auth/google', {
        credential: response.credential
      });
      
      login(res.data.usuario, res.data.token);
      navigate('/');
    } catch (error) {
      console.error('Erro no login Google:', error);
      setErrorMsg(error.response?.data?.error || 'Erro ao fazer login com Google. Tente novamente.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!isLogin) {
      if (!senhaValidacao.minLength || !senhaValidacao.hasNumber || !senhaValidacao.hasSpecial) {
        setErrorMsg('A senha não atende aos requisitos mínimos de segurança.');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const dataToSend = isLogin ? formData : { 
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
        genero: formData.genero,
        tipoUsuario: 'paciente'
      };
      const response = await api.post(endpoint, dataToSend);
      
      if (isLogin) {
        login(response.data.usuario, response.data.token);
        navigate('/');
      } else {
        setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Erro:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao processar sua solicitação. Tente novamente.';
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Lado Esquerdo - Imagem e Branding */}
      <div className="login-side-image d-none d-lg-flex">
        <div className="login-overlay"></div>
        <div className="login-brand-content text-white text-center">
          <i className="bi bi-heart-pulse-fill" style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}></i>
          <h1 className="fw-bold mt-4 mb-3" style={{ fontSize: '3.5rem', letterSpacing: '-1px', textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>Cedro</h1>
          <p className="lead fw-light" style={{ fontSize: '1.25rem', opacity: 0.9, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Seu espaço seguro e acolhedor<br/>para o cuidado emocional.</p>
        </div>
      </div>
      
      {/* Lado Direito - Formulário */}
      <div className="login-side-form d-flex align-items-center justify-content-center w-100">
        <div className="login-form-container w-100" style={{ maxWidth: '480px', padding: '2rem' }}>
          <div className="text-center mb-5">
            <i className="bi bi-heart-pulse text-primary d-lg-none mb-3" style={{ fontSize: '3rem' }}></i>
            <h2 className="fw-bold mb-2" style={{ letterSpacing: '-0.5px' }}>{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
            <p className="text-muted">{isLogin ? 'Entre para continuar sua jornada de bem-estar.' : 'Dê o primeiro passo para o seu cuidado mental.'}</p>
          </div>
                
                {errorMsg && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMsg}
                    <button type="button" className="btn-close" onClick={() => setErrorMsg('')}></button>
                  </div>
                )}
                
                {successMsg && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMsg}
                    <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nome"
                          value={formData.nome || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Data de Nascimento</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dataNascimento"
                          value={formData.dataNascimento || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Gênero</label>
                        <select
                          className="form-control"
                          name="genero"
                          value={formData.genero || ''}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione</option>
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Telefone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="telefone"
                          value={formData.telefone || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                    />
                    {!isLogin && formData.senha && (
                      <div className="mt-2">
                        <small className={senhaValidacao.minLength ? 'text-success' : 'text-danger'}>
                          <i className={`bi bi-${senhaValidacao.minLength ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                          Mínimo 6 caracteres
                        </small><br/>
                        <small className={senhaValidacao.hasNumber ? 'text-success' : 'text-danger'}>
                          <i className={`bi bi-${senhaValidacao.hasNumber ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                          Pelo menos 1 número
                        </small><br/>
                        <small className={senhaValidacao.hasSpecial ? 'text-success' : 'text-danger'}>
                          <i className={`bi bi-${senhaValidacao.hasSpecial ? 'check-circle-fill' : 'x-circle-fill'} me-1`}></i>
                          Pelo menos 1 caractere especial (!@#$%^&*)
                        </small>
                      </div>
                    )}
                  </div>


                  
                  <div className="d-grid mb-3">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                      {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>
                  </div>
                </form>
                
                {isLogin && (
                  <>
                    <div className="position-relative my-4">
                      <hr className="my-0" />
                      <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">ou continue com</span>
                    </div>
                    <div className="google-btn-wrapper mb-3">
                      <div id="googleSignInButton" className="d-flex justify-content-center"></div>
                    </div>
                  </>
                )}
                
                <style>{`
                  .google-btn-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                  }
                `}</style>
                
                <div className="text-center">
                  {isLogin && (
                    <button 
                      className="btn btn-outline-secondary mb-2" 
                      type="button"
                      onClick={() => setShowRecuperarSenha(true)}
                    >
                      Esqueci minha senha
                    </button>
                  )}
                  <div>
                    <button
                      className="btn btn-link text-decoration-none"
                      onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setSuccessMsg(''); }}
                    >
                      {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
                    </button>
                  </div>
                </div>
                
                {showRecuperarSenha && (
                  <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Recuperar Senha</h5>
                          <button type="button" className="btn-close" onClick={() => setShowRecuperarSenha(false)}></button>
                        </div>
                        <div className="modal-body">
                          <p className="text-muted">Informe seu email para receber instruções de recuperação.</p>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Seu email"
                            value={emailRecuperacao}
                            onChange={(e) => setEmailRecuperacao(e.target.value)}
                          />
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={() => setShowRecuperarSenha(false)}>Cancelar</button>
                          <button 
                            type="button" 
                            className="btn btn-primary"
                            onClick={async () => {
                              try {
                                await api.post('/api/auth/recuperar-senha', { email: emailRecuperacao });
                                alert('Instruções de recuperação enviadas! Verifique seu email ou entre em contato com o suporte.');
                                setShowRecuperarSenha(false);
                                setEmailRecuperacao('');
                              } catch (error) {
                                setErrorMsg(error.response?.data?.error || 'Email não encontrado');
                                setShowRecuperarSenha(false);
                              }
                            }}
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
        </div>
      </div>
    </div>
  );
}

export default Login;