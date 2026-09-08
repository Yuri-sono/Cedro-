import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';

const LoginPsicologo = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const recemCadastrado = searchParams.get('cadastro') === '1';

  useEffect(() => {
    if (user && user.tipoUsuario === 'psicologo') {
      navigate('/psicologo/dashboard');
    }
  }, [user, navigate]);

  // Pré-preenche email/senha vindos do cadastro (location.state)
  useEffect(() => {
    if (location.state?.email || location.state?.senha) {
      setFormData((prev) => ({
        ...prev,
        email: location.state.email || prev.email,
        senha: location.state.senha || prev.senha
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', formData);
      
      if (response.data.usuario.tipoUsuario === 'psicologo') {
        login(response.data.usuario, response.data.token);
        navigate(recemCadastrado ? '/psicologo/configuracoes' : '/psicologo/dashboard');
      } else {
        setError('Esta conta não é de psicólogo. Use o login de paciente.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-person-badge text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="fw-bold mt-3">Login Psicólogo</h2>
                  <p className="text-muted">Acesse sua área profissional</p>
                  {recemCadastrado && (
                    <div className="alert alert-success py-2 mt-2">
                      <i className="bi bi-check-circle me-1"></i>
                      Cadastro realizado! Faça login para configurar seus horários.
                    </div>
                  )}
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="senha" className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="senha"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-grid mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="mb-2 text-muted">Esqueceu a senha? Entre em contato com o suporte.</p>
                  <p className="text-muted">
                    Não tem conta? 
                    <Link to="/cadastro-psicologo" className="text-decoration-none ms-1">
                      Cadastre-se aqui
                    </Link>
                  </p>
                  <p className="text-muted">
                    <Link to="/login" className="text-decoration-none">
                      Sou paciente
                    </Link>
                  </p>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPsicologo;