import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config.js';

const LoginAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, senha: formData.senha })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        setLoading(false);
        return;
      }

      // Verificar se é admin
      const userType = data.usuario.tipoUsuario || data.usuario.tipo_usuario;
      if (userType !== 'admin') {
        setError('Acesso negado. Apenas administradores.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminLogado', JSON.stringify(data.usuario));
      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch (error) {
      setError('Erro ao conectar com servidor');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="admin-icon-wrapper mb-3">
                    <i className="bi bi-shield-check text-white" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                  <h2 className="fw-bold mt-3">Painel Administrativo</h2>
                  <p className="text-muted">Acesso exclusivo para administradores</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Administrativo</label>
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
                      className="btn btn-success btn-lg"
                      disabled={loading}
                    >
                      {loading ? 'Verificando...' : 'Acessar Painel'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;