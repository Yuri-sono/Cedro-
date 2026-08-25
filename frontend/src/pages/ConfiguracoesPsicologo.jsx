import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import api from '../services/api.js';
import {
  WEEKDAY_OPTIONS,
  formatAgendaSummary,
  gerarHorariosPorFaixa,
  normalizeTimeSlots,
  normalizeWeekdays,
} from '../utils/psicologoAgenda.js';

const ConfiguracoesPsicologo = () => {
  const [psicologo, setPsicologo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [config, setConfig] = useState({
    nome: '',
    email: '',
    telefone: '',
    especialidade: '',
    tipoPsicologo: '',
    crp: '',
    preco_sessao: '',
    bio: ''
  });
  const [diasAtendimento, setDiasAtendimento] = useState([]);
  const [horariosAtendimento, setHorariosAtendimento] = useState([]);
  const [faixaInicio, setFaixaInicio] = useState('');
  const [faixaFim, setFaixaFim] = useState('');
  const [faixaErro, setFaixaErro] = useState('');
  const [ocupados, setOcupados] = useState(new Set());
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
      tipoPsicologo: user.tipoPsicologo || '',
      crp: user.crp || '',
      preco_sessao: user.precoSessao || '',
      bio: user.bio || ''
    });
    setDiasAtendimento(normalizeWeekdays(user.diasAtendimento));
    const loadedSlots = normalizeTimeSlots(user.horariosAtendimento);
    setHorariosAtendimento(loadedSlots);
    if (loadedSlots.length) {
      setFaixaInicio(loadedSlots[0]);
      setFaixaFim(loadedSlots[loadedSlots.length - 1]);
    }
  }, [user, navigate]);

  // Busca as sessões do psicólogo e calcula quais horários já estão ocupados
  useEffect(() => {
    if (!user || user.tipoUsuario !== 'psicologo') return;
    const carregarOcupados = async () => {
      try {
        const res = await api.get(`/api/sessoes/psicologo/${user.id}`);
        const set = new Set();
        (res.data || []).forEach((sessao) => {
          if (sessao.statusSessao !== 'agendada' && sessao.statusSessao !== 'confirmada') return;
          const dt = new Date(sessao.dataSessao);
          if (isNaN(dt.getTime())) return;
          const dia = dt.getDay();
          const hora = String(dt.getHours()).padStart(2, '0');
          const minuto = String(dt.getMinutes()).padStart(2, '0');
          set.add(`${dia}|${hora}:${minuto}`);
        });
        setOcupados(set);
      } catch (error) {
        console.error('Erro ao carregar horários ocupados:', error);
      }
    };
    carregarOcupados();
  }, [user]);

  const isSlotOcupado = (dia, slot) => ocupados.has(`${dia}|${slot}`);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const toggleDay = (day) => {
    setDiasAtendimento((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : normalizeWeekdays([...current, day])
    );
  };

  const toggleTimeSlot = (slot) => {
    setHorariosAtendimento((current) =>
      current.includes(slot)
        ? current.filter((value) => value !== slot)
        : normalizeTimeSlots([...current, slot])
    );
  };

  const handleGerarFaixa = () => {
    const gerados = gerarHorariosPorFaixa(faixaInicio, faixaFim);
    if (!gerados.length) {
      setFaixaErro('O horário final deve ser maior que o horário inicial.');
      return;
    }
    setFaixaErro('');
    setHorariosAtendimento(gerados);
  };

  const resumoAgenda = useMemo(
    () => formatAgendaSummary(diasAtendimento, horariosAtendimento),
    [diasAtendimento, horariosAtendimento]
  );

  const handleSalvar = async () => {
    try {
      await api.put('/api/auth/perfil', {
        nome: config.nome,
        telefone: config.telefone,
        bio: config.bio,
        especialidade: config.especialidade,
        tipoPsicologo: config.tipoPsicologo,
        crp: config.crp,
        precoSessao: config.preco_sessao ? parseFloat(config.preco_sessao) : null,
        diasAtendimento,
        horariosAtendimento
      });
      
      const updatedData = {
        ...psicologo,
        ...config,
        precoSessao: config.preco_sessao ? parseFloat(config.preco_sessao) : null,
        diasAtendimento,
        horariosAtendimento
      };
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
      await api.put('/api/auth/alterar-senha', {
        senhaAtual,
        novaSenha
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

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tipo de Psicólogo</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tipoPsicologo"
                      value={config.tipoPsicologo}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ex: TCC, infantil, casal"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CRP</label>
                    <input
                      type="text"
                      className="form-control"
                      name="crp"
                      value={config.crp}
                      onChange={handleChange}
                      disabled={!editando}
                      placeholder="Ex: 06/123456"
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

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-calendar-range me-2"></i>Dias e Horários de Atendimento
                </h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">{resumoAgenda}</p>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Dias da semana</label>
                  <div className="d-flex flex-wrap gap-2">
                    {WEEKDAY_OPTIONS.map((option) => {
                      const selected = diasAtendimento.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`btn btn-sm rounded-pill px-3 ${selected ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => toggleDay(option.value)}
                          disabled={!editando}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Gerar horários por faixa (opcional)</label>
                  <div className="d-flex flex-wrap gap-2 align-items-end">
                    <div>
                      <label className="form-label small mb-1 text-muted">Atender a partir de</label>
                      <input
                        type="time"
                        className="form-control"
                        value={faixaInicio}
                        onChange={(e) => {
                          setFaixaInicio(e.target.value);
                          setFaixaErro('');
                        }}
                        disabled={!editando}
                      />
                    </div>
                    <div>
                      <label className="form-label small mb-1 text-muted">Atender até</label>
                      <input
                        type="time"
                        className="form-control"
                        value={faixaFim}
                        onChange={(e) => {
                          setFaixaFim(e.target.value);
                          setFaixaErro('');
                        }}
                        disabled={!editando}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleGerarFaixa}
                      disabled={!editando}
                    >
                      <i className="bi bi-magic me-1"></i>Gerar horários
                    </button>
                  </div>
                  {faixaErro && <div className="text-danger small mt-1">{faixaErro}</div>}
                  <small className="text-muted d-block mt-2">
                    Os horários serão gerados de hora em hora dentro da faixa escolhida. Você pode remover horários específicos clicando neles depois de gerar (ex: para um horário de almoço).
                  </small>
                </div>

                <div>
                  <label className="form-label fw-semibold">Horários disponíveis</label>

                  {horariosAtendimento.length === 0 && (
                    <p className="text-muted small mb-2">
                      Nenhum horário selecionado. Use a faixa acima ou selecione manualmente.
                    </p>
                  )}

                  {diasAtendimento.length === 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {horariosAtendimento.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className="btn btn-sm rounded-pill px-3 btn-primary"
                          onClick={() => toggleTimeSlot(slot)}
                          disabled={!editando}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="row g-3">
                      {diasAtendimento.map((dia) => {
                        const label = WEEKDAY_OPTIONS.find(o => o.value === dia)?.label || `Dia ${dia}`;
                        return (
                          <div className="col-md-6 col-lg-4" key={dia}>
                            <div className="agenda-dia-card h-100">
                              <h6 className="fw-bold mb-2">
                                <i className="bi bi-calendar-day me-1 text-success"></i>{label}
                              </h6>
                              <div className="d-flex flex-wrap gap-2">
                                {horariosAtendimento.map((slot) => {
                                  const ocupado = isSlotOcupado(dia, slot);
                                  return (
                                    <button
                                      key={`${dia}-${slot}`}
                                      type="button"
                                      className={`btn btn-sm rounded-pill px-3 ${ocupado ? 'btn-horario-ocupado' : 'btn-primary'}`}
                                      onClick={() => toggleTimeSlot(slot)}
                                      disabled={!editando}
                                      title={ocupado
                                        ? 'Já existe sessão agendada neste horário'
                                        : 'Clique para remover este horário'}
                                    >
                                      {ocupado && <i className="bi bi-lock-fill me-1"></i>}
                                      {slot}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <small className="text-muted d-block mt-3">
                    <i className="bi bi-lock-fill me-1"></i>
                    Horários escuros com cadeado já possuem sessão agendada (não podem ser liberados até o cancelamento).
                  </small>
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

