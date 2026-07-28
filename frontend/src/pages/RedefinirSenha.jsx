import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api.js';

function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!token) {
      setErro('Token inválido ou ausente. Solicite um novo link de recuperação.');
      return;
    }
    if (novaSenha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/redefinir-senha', { token, novaSenha });
      navigate('/login', { state: { successMsg: 'Senha redefinida com sucesso! Faça login.' } });
    } catch (error) {
      setErro(error.response?.data?.error || 'Token inválido ou expirado. Solicite um novo link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card border-0 shadow-sm p-4" style={{ maxWidth: 420, width: '100%' }}>
        <h4 className="fw-bold mb-1">Redefinir senha</h4>
        <p className="text-muted mb-4">Digite sua nova senha abaixo.</p>

        {erro && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{erro}
          </div>
        )}

        {!token && (
          <div className="alert alert-warning">
            Link inválido. <a href="/login">Voltar ao login</a>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nova senha</label>
            <input
              type="password"
              className="form-control"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              disabled={!token}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Confirmar nova senha</label>
            <input
              type="password"
              className="form-control"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              disabled={!token}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading || !token}>
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <a href="/login" className="text-muted small">Voltar ao login</a>
        </div>
      </div>
    </div>
  );
}

export default RedefinirSenha;
