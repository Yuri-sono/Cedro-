import React, { useState, useEffect } from 'react';
import psicologoService from '../services/psicologoService';

function ListaPsicologos() {
  const [psicologos, setPsicologos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPsicologos();
  }, []);

  const fetchPsicologos = async () => {
    try {
      const data = await psicologoService.listar();
      setPsicologos(data);
    } catch (error) {
      console.error('Erro ao buscar psicólogos:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const agendarSessao = (psicologoId) => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario.id) {
      alert('Faça login para agendar uma sessão');
      window.location.href = '/login';
      return;
    }
    window.location.href = `/agendar-sessao/${psicologoId}`;
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 py-4">
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3">Nossos Psicólogos</h1>
        <p className="lead text-muted">Encontre o profissional ideal para você</p>
      </div>
      
      <div className="row g-4">
        {psicologos.map(psicologo => (
          <div key={psicologo.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{
                         width: '80px', 
                         height: '80px',
                         ...((psicologo.fotoUrl || psicologo.foto_url) ? {
                           backgroundImage: `url(${psicologo.fotoUrl || psicologo.foto_url})`,
                           backgroundSize: 'cover',
                           backgroundPosition: 'center'
                         } : {})
                       }}>
                    {!(psicologo.fotoUrl || psicologo.foto_url) && <i className="bi bi-person-fill text-white fs-1"></i>}
                  </div>
                  <h5 className="card-title fw-bold mb-1">{psicologo.nome}</h5>
                  {psicologo.avaliacao && (
                    <div className="text-warning mb-2">
                      <i className="bi bi-star-fill"></i>
                      <span className="ms-1">{parseFloat(psicologo.avaliacao).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                {psicologo.especialidade && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-bookmark-fill text-primary me-2"></i>
                      <strong>Especialidade</strong>
                    </div>
                    <p className="mb-0 ms-4 text-muted">{psicologo.especialidade}</p>
                  </div>
                )}
                
                {psicologo.bio && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-info-circle-fill text-primary me-2"></i>
                      <strong>Sobre</strong>
                    </div>
                    <p className="mb-0 ms-4 text-muted small">{psicologo.bio}</p>
                  </div>
                )}
                
                {psicologo.telefone && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-telephone-fill text-primary me-2"></i>
                      <span className="text-muted">{psicologo.telefone}</span>
                    </div>
                  </div>
                )}
                
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <div>
                    <small className="text-muted d-block">Valor da sessão</small>
                    <span className="h5 text-success mb-0 fw-bold">
                      R$ {(psicologo.precoSessao || psicologo.preco_sessao) ? parseFloat(psicologo.precoSessao || psicologo.preco_sessao).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0 p-4 pt-0">
                <button 
                  className="btn btn-success w-100 py-2"
                  onClick={() => agendarSessao(psicologo.id)}
                >
                  <i className="bi bi-calendar-plus me-2"></i>
                  Agendar Sessão
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {psicologos.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-person-x fs-1 text-muted"></i>
          </div>
          <h3 className="fw-bold">Nenhum psicólogo disponível</h3>
          <p className="text-muted">Tente novamente mais tarde.</p>
        </div>
      )}
    </div>
  );
}

export default ListaPsicologos;