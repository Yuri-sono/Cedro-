import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import psicologoService from '../services/psicologoService';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function ListaPsicologos() {
  const [psicologos, setPsicologos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Carregando psicólogos...');
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [especialidade, setEspecialidade] = useState('todas');
  const [ordem, setOrdem] = useState('relevancia');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPsicologos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoadingMsg('O servidor está iniciando, por favor aguarde...');
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  const fetchPsicologos = async () => {
    try {
      setError('');
      const data = await psicologoService.listar();
      setPsicologos(data);
    } catch (error) {
      console.error('Erro ao buscar psicólogos:', error);
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Lista de especialidades únicas para o filtro
  const especialidades = useMemo(() => {
    const set = new Set();
    psicologos.forEach(p => {
      const spec = p.tipoPsicologo || p.especialidade;
      if (spec && spec.trim()) set.add(spec.trim());
    });
    return ['todas', ...Array.from(set).sort()];
  }, [psicologos]);

  // Lista filtrada + ordenada
  const resultado = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    let lista = psicologos.filter(p => {
      const matchSpec = especialidade === 'todas' ||
        (p.tipoPsicologo || p.especialidade || '').toLowerCase() === especialidade.toLowerCase();
      const matchBusca = !termo ||
        `${p.nome || ''} ${p.especialidade || ''} ${p.tipoPsicologo || ''} ${p.bio || ''}`.toLowerCase().includes(termo);
      return matchSpec && matchBusca;
    });

    switch (ordem) {
      case 'avaliacao':
        lista = [...lista].sort((a, b) => (parseFloat(b.avaliacao) || 0) - (parseFloat(a.avaliacao) || 0));
        break;
      case 'preco-asc':
        lista = [...lista].sort((a, b) => (parseFloat(a.precoSessao) || 0) - (parseFloat(b.precoSessao) || 0));
        break;
      case 'preco-desc':
        lista = [...lista].sort((a, b) => (parseFloat(b.precoSessao) || 0) - (parseFloat(a.precoSessao) || 0));
        break;
      default:
        lista = [...lista].sort((a, b) => (parseFloat(b.avaliacao) || 0) - (parseFloat(a.avaliacao) || 0));
    }
    return lista;
  }, [psicologos, busca, especialidade, ordem]);

  const agendarSessao = (psicologoId) => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario.id) {
      alert('Faça login para agendar uma sessão');
      navigate('/login');
      return;
    }
    navigate(`/agendar-sessao/${psicologoId}`);
  };

  const normalizarDias = (dias) => {
    if (Array.isArray(dias)) return dias;
    if (typeof dias === 'string' && dias) return dias.split(',').map(d => parseInt(d, 10)).filter(n => !isNaN(n));
    return [];
  };

  const formatarPreco = (valor) => {
    const n = parseFloat(valor);
    return n ? n.toFixed(2) : '0.00';
  };

  const renderEstrelas = (avaliacao) => {
    const nota = parseFloat(avaliacao) || 0;
    const cheias = Math.round(nota);
    return (
      <div className="rating-stars text-warning">
        {[1, 2, 3, 4, 5].map(i => (
          <i key={i} className={i <= cheias ? 'bi bi-star-fill' : 'bi bi-star'}></i>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5 py-4">
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-3">Nossos Psicólogos</h1>
          <p className="lead text-muted">{loadingMsg}</p>
        </div>
        <div className="row g-4">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="skeleton-card">
                <div className="skeleton avatar"></div>
                <div className="skeleton line-title"></div>
                <div className="skeleton line med"></div>
                <div className="skeleton line short"></div>
                <div className="skeleton line"></div>
                <div className="skeleton line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="psicologos-hero text-center">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <h1 className="mb-2">Nossos Psicólogos</h1>
          <p className="mb-0">Encontre o profissional ideal para você e comece sua jornada de bem-estar</p>
        </div>
</section>
<div className="container pb-5">
        {/* Toolbar de busca/filtro */}
        <div className="psicologos-toolbar">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label fw-semibold small">Buscar profissional</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome, especialidade ou palavra-chave..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold small">Especialidade</label>
              <select
                className="form-select"
                value={especialidade}
                onChange={e => setEspecialidade(e.target.value)}
              >
                <option value="todas">Todas as especialidades</option>
                {especialidades.filter(s => s !== 'todas').map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold small">Ordenar por</label>
              <select className="form-select" value={ordem} onChange={e => setOrdem(e.target.value)}>
                <option value="relevancia">Relevância (avaliação)</option>
                <option value="avaliacao">Melhor avaliado</option>
                <option value="preco-asc">Menor preço</option>
                <option value="preco-desc">Maior preço</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contador de resultados + erro */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-3 flex-wrap">
          {error ? (
            <>
              <div className="alert alert-danger d-inline-block mb-2 me-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
              <button className="btn btn-primary mb-2" onClick={() => { setLoading(true); setError(''); fetchPsicologos(); }}>
                <i className="bi bi-arrow-clockwise me-2"></i>Tentar novamente
              </button>
            </>
          ) : (
            <p className="mb-0 text-muted">
              <span className="psicologos-count">{resultado.length}</span> profissional(ais) encontrado(s)
            </p>
          )}
        </div>

        {/* Grid de cards */}
        {!error && (
          <div className="row g-4">
            {resultado.map(psicologo => {
              const dias = normalizarDias(psicologo.diasAtendimento);
              const hoje = new Date().getDay();
              const atendeHoje = dias.includes(hoje);
              const temAgenda = (psicologo.horariosAtendimento && psicologo.horariosAtendimento.length) > 0;
              const foto = psicologo.fotoUrl || psicologo.foto_url;

              return (
                <div key={psicologo.id} className="col-md-6 col-lg-4">
                  <div className="card psicologo-card">
                    <div className="card-body p-4">
                      <div className="text-center mb-3">
                        <div className="psicologo-avatar" style={foto ? {
                          backgroundImage: `url(${foto})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        } : {}}>
                          {!foto && <i className="bi bi-person-fill"></i>}
                        </div>
                        <h5 className="card-title mt-3 mb-1">{psicologo.nome}</h5>
                        {psicologo.avaliacao !== undefined && psicologo.avaliacao !== null && (
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            {renderEstrelas(psicologo.avaliacao)}
                            <span className="fw-semibold text-muted small">
                              {parseFloat(psicologo.avaliacao).toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {(psicologo.tipoPsicologo || psicologo.especialidade) && (
                        <div className="d-flex justify-content-center flex-wrap gap-2 mb-3">
                          <span className="spec-chip">
                            <i className="bi bi-patch-check-fill"></i>
                            {psicologo.tipoPsicologo || psicologo.especialidade}
                          </span>
                        </div>
                      )}

                      {psicologo.bio && (
                        <p className="text-muted small mb-3 text-center">
                          {psicologo.bio.length > 120 ? psicologo.bio.slice(0, 120) + '...' : psicologo.bio}
                        </p>
                      )}

                      {/* Disponibilidade / horários */}
                      <div className="d-flex flex-column gap-2 mb-3">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          {atendeHoje
                            ? <span className="avail-badge ok"><i className="bi bi-check-circle"></i> Atende hoje</span>
                            : (temAgenda ? null : <span className="avail-badge wait"><i className="bi bi-clock"></i> Conferir agenda</span>)}
                          {temAgenda && <span className="avail-badge ok"><i className="bi bi-calendar-check"></i> Disponível</span>}
                        </div>

                        {dias.length > 0 && (
                          <div className="meta-line">
                            <i className="bi bi-calendar-week"></i>
                            <span>
                              {dias.map(d => (
                                <span key={d} className={`day-pill ${d === hoje ? 'today' : ''}`}>
                                  {DIAS_SEMANA[d] ?? d}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}

                        {psicologo.horariosAtendimento && psicologo.horariosAtendimento.length > 0 && (
                          <div className="meta-line">
                            <i className="bi bi-clock"></i>
                            <span>{psicologo.horariosAtendimento.slice(0, 3).join(' · ')}
                              {psicologo.horariosAtendimento.length > 3 && ' …'}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted d-block">Valor da sessão</small>
                          <span className="psicologo-price h5 mb-0">
                            R$ {formatarPreco(psicologo.precoSessao)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="card-footer bg-transparent border-0 p-4 pt-0">
                      <div className="d-grid gap-2">
                        <button className="btn btn-agendar w-100 py-2" onClick={() => agendarSessao(psicologo.id)}>
                          <i className="bi bi-calendar-plus me-2"></i>
                          Agendar Sessão
                        </button>
                        <button className="btn btn-conversar w-100 py-2" onClick={() => navigate(`/chat/${psicologo.id}`)}>
                          <i className="bi bi-chat-dots me-2"></i>
                          Conversar com psicólogo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
{/* Estado vazio */}
        {!error && resultado.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-person-x fs-1 text-muted"></i>
            </div>
            <h3 className="fw-bold">Nenhum psicólogo encontrado</h3>
            <p className="text-muted">
              {busca || especialidade !== 'todas'
                ? 'Ajuste a busca ou os filtros para ver mais resultados.'
                : 'Tente novamente mais tarde.'}
            </p>
            {(busca || especialidade !== 'todas') && (
              <button className="btn btn-outline-secondary" onClick={() => { setBusca(''); setEspecialidade('todas'); }}>
                <i className="bi bi-x-circle me-2"></i>Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default ListaPsicologos;