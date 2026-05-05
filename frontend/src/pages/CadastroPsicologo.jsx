import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';

const CadastroPsicologo = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    crp: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    especialidade: '',
    preco_sessao: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [crpStatus, setCrpStatus] = useState('idle'); // 'idle', 'checking', 'valid', 'invalid', 'format_error'
  const [crpMessage, setCrpMessage] = useState('');
  const [senhaValidacao, setSenhaValidacao] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false
  });
  const navigate = useNavigate();

  // Validação do formato de CRP: XX/XXXXXX (2 dígitos / 6 dígitos)
  const validarFormatoCrp = (crp) => {
    const crpRegex = /^\d{2}\/\d{5,6}$/;
    return crpRegex.test(crp);
  };

  // Verificar CRP no banco de dados
  const verificarCrp = async (crp) => {
    if (!validarFormatoCrp(crp)) {
      setCrpStatus('format_error');
      setCrpMessage('Formato inválido. Use: XX/XXXXXX (ex: 06/123456)');
      return;
    }

    setCrpStatus('checking');
    setCrpMessage('Verificando CRP...');

    try {
      // Consultar o backend para verificar se o CRP existe no banco de dados
      const response = await api.get(`/api/psicologos/verificar-crp/${encodeURIComponent(crp)}`);
      
      if (response.data.valido) {
        setCrpStatus('valid');
        setCrpMessage('CRP verificado com sucesso!');
      } else {
        setCrpStatus('invalid');
        setCrpMessage(response.data.mensagem || 'CRP não encontrado no sistema. Verifique o número informado.');
      }
    } catch (error) {
      // Se o endpoint não existir ainda ou retornar erro, apenas validar formato localmente
      if (error.response?.status === 404) {
        // Endpoint não implementado - aceitar apenas com validação de formato
        setCrpStatus('valid');
        setCrpMessage('Formato de CRP válido (verificação online indisponível)');
      } else if (error.response?.status === 409) {
        setCrpStatus('invalid');
        setCrpMessage('Este CRP já está cadastrado na plataforma.');
      } else {
        // Aceitar com aviso
        setCrpStatus('valid');
        setCrpMessage('Formato de CRP válido');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'senha') {
      setSenhaValidacao({
        minLength: value.length >= 6,
        hasNumber: /\d/.test(value),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }

    if (name === 'crp') {
      // Reset CRP status quando o usuário estiver digitando
      setCrpStatus('idle');
      setCrpMessage('');
    }
  };

  const handleCrpBlur = () => {
    if (formData.crp.trim()) {
      verificarCrp(formData.crp.trim());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }
    
    if (!senhaValidacao.minLength || !senhaValidacao.hasNumber || !senhaValidacao.hasSpecial) {
      setError('A senha não atende aos requisitos mínimos de segurança.');
      setLoading(false);
      return;
    }

    // Validar formato do CRP antes de enviar
    if (!validarFormatoCrp(formData.crp)) {
      setError('O CRP informado não tem um formato válido. Use: XX/XXXXXX (ex: 06/123456)');
      setLoading(false);
      return;
    }

    if (crpStatus === 'invalid') {
      setError('O CRP informado não foi validado. Verifique o número e tente novamente.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        nome: formData.nome,
        email: formData.email,
        crp: formData.crp,
        senha: formData.senha,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
        genero: formData.genero,
        tipoUsuario: 'psicologo'
      };
      
      if (formData.especialidade) payload.especialidade = formData.especialidade;
      if (formData.preco_sessao) payload.precoSessao = parseFloat(formData.preco_sessao);
      
      await api.post('/api/auth/register', payload);
      alert('Cadastro realizado com sucesso!');
      navigate('/login-psicologo');
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  const getCrpStatusIcon = () => {
    switch (crpStatus) {
      case 'checking':
        return <span className="spinner-border spinner-border-sm text-primary"></span>;
      case 'valid':
        return <i className="bi bi-check-circle-fill text-success"></i>;
      case 'invalid':
        return <i className="bi bi-x-circle-fill text-danger"></i>;
      case 'format_error':
        return <i className="bi bi-exclamation-triangle-fill text-warning"></i>;
      default:
        return null;
    }
  };

  const getCrpStatusColor = () => {
    switch (crpStatus) {
      case 'valid': return 'is-valid';
      case 'invalid':
      case 'format_error': return 'is-invalid';
      default: return '';
    }
  };

  return (
    <div className="cadastro-section py-5 page-transition" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="bi bi-person-badge text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="fw-bold mt-3">Cadastro de Psicólogo</h2>
                  <p className="text-muted">Junte-se à nossa equipe de profissionais</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nome" className="form-label">Nome Completo *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="crp" className="form-label">
                        CRP *
                        <small className="text-muted ms-1">(Conselho Regional)</small>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${getCrpStatusColor()}`}
                          id="crp"
                          name="crp"
                          placeholder="Ex: 06/123456"
                          value={formData.crp}
                          onChange={handleChange}
                          onBlur={handleCrpBlur}
                          required
                        />
                        {crpStatus !== 'idle' && (
                          <span className="input-group-text bg-transparent">
                            {getCrpStatusIcon()}
                          </span>
                        )}
                      </div>
                      {crpMessage && (
                        <small className={`d-block mt-1 ${
                          crpStatus === 'valid' ? 'text-success' : 
                          crpStatus === 'checking' ? 'text-primary' : 
                          'text-danger'
                        }`}>
                          {getCrpStatusIcon()} {crpMessage}
                        </small>
                      )}
                      {crpStatus === 'idle' && !formData.crp && (
                        <small className="text-muted d-block mt-1">
                          <i className="bi bi-info-circle me-1"></i>
                          O CRP será verificado no banco de dados
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email *</label>
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
                    <div className="col-md-6 mb-3">
                      <label htmlFor="telefone" className="form-label">Telefone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="senha" className="form-label">Senha *</label>
                      <input
                        type="password"
                        className="form-control"
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                      />
                      {formData.senha && (
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
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmarSenha" className="form-label">Confirmar Senha *</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmarSenha"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="dataNascimento" className="form-label">Data de Nascimento *</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dataNascimento"
                        name="dataNascimento"
                        value={formData.dataNascimento}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="genero" className="form-label">Gênero *</label>
                      <select
                        className="form-control"
                        id="genero"
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="especialidade" className="form-label">Especialidade</label>
                      <input
                        type="text"
                        className="form-control"
                        id="especialidade"
                        name="especialidade"
                        placeholder="Ex: Ansiedade, Depressão"
                        value={formData.especialidade}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="preco_sessao" className="form-label">Valor da Sessão (R$)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="preco_sessao"
                        name="preco_sessao"
                        min="0"
                        step="0.01"
                        value={formData.preco_sessao}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="d-grid mb-3 mt-2">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading || crpStatus === 'checking'}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Cadastrando...
                        </>
                      ) : 'Cadastrar'}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="text-muted">
                    Já tem conta? 
                    <Link to="/login-psicologo" className="text-decoration-none ms-1">
                      Faça login aqui
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

export default CadastroPsicologo;