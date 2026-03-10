import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import API_BASE_URL from '../config.js';

const LoginPsicologo = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.tipoUsuario === 'psicologo') {
      navigate('/psicologo/dashboard');
    }
  }, [user, navigate]);

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
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      
      if (response.data.usuario.tipoUsuario === 'psicologo') {
        login(response.data.usuario, response.data.token);
        navigate('/psicologo/dashboard');
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
    <div className="login-section py-5" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-person-badge text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="fw-bold mt-3">Login Psicólogo</h2>
                  <p className="text-muted">Acesse sua área profissional</p>
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
                  <p className="mb-2">
                    <Link to="/esqueci-senha" className="text-decoration-none">
                      Esqueci minha senha
                    </Link>
                  </p>
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