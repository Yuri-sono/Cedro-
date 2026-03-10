import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import axios from 'axios';
import API_BASE_URL from '../config.js';

const ConfiguracoesPsicologo = () => {
  const [psicologo, setPsicologo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [config, setConfig] = useState({
    nome: '',
    email: '',
    telefone: '',
    especialidade: '',
    preco_sessao: '',
    bio: ''
  });
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaValidacao, setSenhaValidacao] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false
  });
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    if (!user || user.tipoUsuario !== 'psicologo') {
      navigate('/login-psicologo');
      return;
    }
    setPsicologo(user);
    setConfig({
      nome: user.nome || '',
      email: user.email || '',
      telefone: user.telefone || '',
      especialidade: user.especialidade || '',
      preco_sessao: user.precoSessao || '',
      bio: user.bio || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/auth/perfil`, {
        nome: config.nome,
        telefone: config.telefone,
        bio: config.bio,
        especialidade: config.especialidade,
        preco_sessao: config.preco_sessao ? parseFloat(config.preco_sessao) : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedData = { ...psicologo, ...config, precoSessao: config.preco_sessao };
      updateUser(updatedData);
      setPsicologo(updatedData);
      setEditando(false);
      alert('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert(error.response?.data?.error || 'Erro ao salvar configurações.');
    }
  };

  const handleAlterarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    
    if (!senhaValidacao.minLength || !senhaValidacao.hasNumber || !senhaValidacao.hasSpecial) {
      alert('A nova senha não atende aos requisitos mínimos de segurança.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/auth/alterar-senha`, {
        senhaAtual,
        novaSenha
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Senha alterada com sucesso!');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setSenhaValidacao({ minLength: false, hasNumber: false, hasSpecial: false });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert(error.response?.data?.error || 'Erro ao alterar senha. Verifique a senha atual.');
    }
  };

  if (!psicologo) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-psicologo">
      <NavbarPsicologo psicologo={psicologo} />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          <div className="col-md-9 col-lg-10">
            <h2 className="fw-bold mb-4">Configurações</h2>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent">
                <h5 className="fw-bold mb-0">Informações Profissionais</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={config.nome}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={config.email}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telefone"
                      value={config.telefone}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Especialidade</label>
                    <input
                      type="text"
                      className="form-control"
                      name="especialidade"
                      value={config.especialidade}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preço da Sessão (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="preco_sessao"
                      value={config.preco_sessao}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Biografia</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="bio"
                    value={config.bio}
                    onChange={handleChange}
                    disabled={!editando}
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  {!editando ? (
                    <button className="btn btn-primary" onClick={() => setEditando(true)}>
                      <i className="bi bi-pencil me-1"></i>Editar
                    </button>
                  ) : (
                    <>
                      <button className="btn btn-success" onClick={handleSalvar}>
                        <i className="bi bi-check-lg me-1"></i>Salvar
                      </button>
                      <button className="btn btn-secondary" onClick={() => setEditando(false)}>
                        <i className="bi bi-x-lg me-1"></i>Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="fw-bold mb-0">Alterar Senha</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Senha Atual</label>
                    <input
                      type="password"
                      className="form-control"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Nova Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      value={novaSenha}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNovaSenha(value);
                        setSenhaValidacao({
                          minLength: value.length >= 6,
                          hasNumber: /\d/.test(value),
                          hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
                        });
                      }}
                    />
                    {novaSenha && (
                      <div className="mt-1">
                        <small className={senhaValidacao.minLength ? 'text-success' : 'text-danger'}>
                          <i className={`bi bi-${senhaValidacao.minLength ? 'check-circle-fill' : 'x-circle-fill'}`}></i> 6+ caracteres
                        </small>{' '}
                        <small className={senhaValidacao.hasNumber ? 'text-success' : 'text-danger'}>
                          <i className={`bi bi-${senhaValidacao.hasNumber ? 'check-circle-fill' : 'x-circle-fill'}`}></i> 1 número
                        </small>{' '}
                        <small className={senhaValidacao.hasSpecial ? 'text-success' : 'text-danger'}>
                          <i className={`bi bi-${senhaValidacao.hasSpecial ? 'check-circle-fill' : 'x-circle-fill'}`}></i> 1 especial
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-warning"
                  onClick={handleAlterarSenha}
                  disabled={!senhaAtual || !novaSenha || !confirmarSenha}
                >
                  <i className="bi bi-key me-1"></i>Alterar Senha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPsicologo;
