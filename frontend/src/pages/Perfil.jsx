import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import CustomModal from '../components/CustomModal.jsx';
import { useModal } from '../hooks/useModal.jsx';
import API_BASE_URL from '../config.js';

const Perfil = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { modal, showAlert, showConfirm, closeModal } = useModal();
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    endereco: '',
    bio: '',
    foto_url: ''
  });

  useEffect(() => {
    if (user) {
      const dataNasc = (user.dataNascimento || user.data_nascimento) ? (user.dataNascimento || user.data_nascimento).split('T')[0] : '';
      setUsuario({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        dataNascimento: dataNasc,
        genero: user.genero || '',
        endereco: user.endereco || '',
        bio: user.bio || 'Buscando bem-estar mental e equilíbrio na vida.',
        foto_url: user.fotoUrl || user.foto_url || ''
      });
    }
  }, [user]);

  const [editando, setEditando] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaValidacao, setSenhaValidacao] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvar = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/auth/perfil`, {
        nome: usuario.nome,
        telefone: usuario.telefone,
        dataNascimento: usuario.dataNascimento,
        genero: usuario.genero,
        endereco: usuario.endereco,
        bio: usuario.bio
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      updateUser({ ...user, ...usuario, dataNascimento: usuario.dataNascimento, data_nascimento: usuario.dataNascimento });
      setEditando(false);
      await showAlert('Perfil atualizado com sucesso!', 'Sucesso', 'success');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      if (error.response?.data?.expired) {
        await showAlert('Sessão expirada. Faça login novamente.', 'Erro', 'error');
        logout();
        navigate('/login');
      } else {
        await showAlert('Erro ao salvar perfil. Tente novamente.', 'Erro', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirConta = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/auth/conta`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await showAlert('Conta excluída com sucesso.', 'Sucesso', 'success');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      await showAlert('Erro ao excluir conta. Tente novamente.', 'Erro', 'error');
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert('A imagem deve ter no máximo 5MB', 'Erro', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        try {
          const token = localStorage.getItem('token');
          await axios.put(
            `${API_BASE_URL}/api/auth/foto-perfil`,
            { fotoUrl: base64 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUsuario(prev => ({ ...prev, foto_url: base64, fotoUrl: base64 }));
          updateUser({ ...user, fotoUrl: base64, foto_url: base64 });
          await showAlert('Foto atualizada com sucesso!', 'Sucesso', 'success');
        } catch (error) {
          console.error('Erro ao atualizar foto:', error);
          await showAlert('Erro ao atualizar foto', 'Erro', 'error');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlterarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      await showAlert('As senhas não coincidem!', 'Erro', 'error');
      return;
    }
    
    if (!senhaValidacao.minLength || !senhaValidacao.hasNumber || !senhaValidacao.hasSpecial) {
      await showAlert('A nova senha não atende aos requisitos mínimos de segurança.', 'Erro', 'error');
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
      
      await showAlert('Senha alterada com sucesso!', 'Sucesso', 'success');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      await showAlert('Erro ao alterar senha. Verifique a senha atual.', 'Erro', 'error');
    }
  };

  return (
    <div className="perfil-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="profile-card">
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <div className="profile-avatar" style={(usuario.fotoUrl || usuario.foto_url) ? {
                    backgroundImage: `url(${usuario.fotoUrl || usuario.foto_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}>
                    {!(usuario.fotoUrl || usuario.foto_url) && <i className="bi bi-person-fill"></i>}
                  </div>
                  <label htmlFor="foto-upload" className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle" 
                         style={{width: '40px', height: '40px', cursor: 'pointer'}}>
                    <i className="bi bi-camera-fill"></i>
                  </label>
                  <input 
                    type="file" 
                    id="foto-upload" 
                    accept="image/*" 
                    onChange={handleFotoChange}
                    style={{display: 'none'}}
                  />
                </div>
                <h2 className="fw-bold mb-1">{usuario.nome}</h2>
                <p className="text-muted mb-3">{usuario.email}</p>
                <div className="d-flex justify-content-center gap-2 mb-4">
                  <span className="badge bg-primary">
                    {(user?.tipoUsuario || user?.tipo_usuario) === 'terapeuta' ? 'Terapeuta' : 'Paciente'} Ativo
                  </span>
                  <span className="badge bg-success">Verificado</span>
                </div>
              </div>

                {/* Informações Pessoais */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={usuario.nome}
                      onChange={handleInputChange}
                      disabled={!editando}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={usuario.email}
                      onChange={handleInputChange}
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
                      value={usuario.telefone}
                      onChange={handleInputChange}
                      disabled={!editando}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data de Nascimento</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dataNascimento"
                      value={usuario.dataNascimento}
                      onChange={handleInputChange}
                      disabled={!editando}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gênero</label>
                    <select
                      className="form-select"
                      name="genero"
                      value={usuario.genero}
                      onChange={handleInputChange}
                      disabled={!editando}
                    >
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                      <option value="nao-informar">Prefiro não informar</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Localização</label>
                    <input
                      type="text"
                      className="form-control"
                      name="endereco"
                      value={usuario.endereco}
                      onChange={handleInputChange}
                      disabled={!editando}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Sobre mim</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="bio"
                    value={usuario.bio}
                    onChange={handleInputChange}
                    disabled={!editando}
                  ></textarea>
                </div>

                {/* Botões de Ação */}
                <div className="d-flex gap-2 mb-4">
                  {!editando ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditando(true)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Editar Perfil
                    </button>
                  ) : (
                    <>
                      <button className="btn btn-success" onClick={handleSalvar}>
                        <i className="bi bi-check-lg me-1"></i>
                        Salvar
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setEditando(false)}
                      >
                        <i className="bi bi-x-lg me-1"></i>
                        Cancelar
                      </button>
                    </>
                  )}
                </div>

                {/* Seção de Alterar Senha */}
                <hr />
                <h5 className="mb-3">
                  <i className="bi bi-shield-lock me-2"></i>
                  Alterar Senha
                </h5>
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
                          minLength: value.length >= 5,
                          hasNumber: /\d/.test(value),
                          hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
                        });
                      }}
                    />
                    {novaSenha && (
                      <div className="mt-1">
                        <small className={senhaValidacao.minLength ? 'text-success' : 'text-danger'}>
                          <i className={`bi bi-${senhaValidacao.minLength ? 'check-circle-fill' : 'x-circle-fill'}`}></i> 5+ caracteres
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
                  <i className="bi bi-key me-1"></i>
                  Alterar Senha
                </button>

                {/* Excluir Conta */}
                <hr className="mt-4" />
                <h5 className="mb-3 text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Zona de Perigo
                </h5>
                <p className="text-muted">Ao excluir sua conta, todos os seus dados serão permanentemente removidos.</p>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    const confirmed = await showConfirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita!', 'Excluir Conta');
                    if (confirmed) {
                      handleExcluirConta();
                    }
                  }}
                >
                  <i className="bi bi-trash me-1"></i>
                  Excluir Conta
                </button>

                {/* Estatísticas do Usuário */}
                <div className="stats-section mt-4">
                  <h5 className="mb-4 text-center">
                    <i className="bi bi-graph-up me-2"></i>
                    Minha Jornada
                  </h5>
                  <div className="row g-3">
                    <div className="col-6 col-md-3">
                      <div className="stat-card">
                        <div className="stat-icon bg-primary">
                          <i className="bi bi-calendar-check"></i>
                        </div>
                        <h4>12</h4>
                        <small>Sessões</small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="stat-card">
                        <div className="stat-icon bg-success">
                          <i className="bi bi-headphones"></i>
                        </div>
                        <h4>8</h4>
                        <small>Meditações</small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="stat-card">
                        <div className="stat-icon bg-info">
                          <i className="bi bi-book"></i>
                        </div>
                        <h4>5</h4>
                        <small>E-books</small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="stat-card">
                        <div className="stat-icon bg-warning">
                          <i className="bi bi-camera-video"></i>
                        </div>
                        <h4>3</h4>
                        <small>Webinars</small>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <CustomModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};

export default Perfil;