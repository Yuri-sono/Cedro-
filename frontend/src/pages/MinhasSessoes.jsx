import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../config';

function MinhasSessoes() {
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    carregarSessoes();
  }, []);

  const carregarSessoes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/sessoes/minhas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarSessao = async (id) => {
    if (!window.confirm('Deseja realmente cancelar esta sessão?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/sessoes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Sessão cancelada com sucesso!');
      carregarSessoes();
    } catch (error) {
      alert('Erro ao cancelar sessão');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      agendada: 'bg-primary',
      realizada: 'bg-success',
      cancelada: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">
            <i className="bi bi-calendar-check me-2"></i>
            Minhas Sessões
          </h2>
          <p className="text-muted">Gerencie suas sessões agendadas</p>
        </div>
      </div>

      {sessoes.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-calendar-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <h4 className="mt-3 text-muted">Nenhuma sessão agendada</h4>
          <p className="text-muted">Agende sua primeira sessão com um psicólogo</p>
        </div>
      ) : (
        <div className="row g-4">
          {sessoes.map((sessao) => (
            <div key={sessao.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-person-circle me-2"></i>
                      Psicólogo #{sessao.psicologoId}
                    </h5>
                    <span className={`badge ${getStatusBadge(sessao.statusSessao)}`}>
                      {sessao.statusSessao}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <i className="bi bi-calendar3 me-2 text-primary"></i>
                    <small>{new Date(sessao.dataSessao).toLocaleDateString('pt-BR')}</small>
                  </div>
                  
                  <div className="mb-2">
                    <i className="bi bi-clock me-2 text-primary"></i>
                    <small>{new Date(sessao.dataSessao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>
                  </div>
                  
                  <div className="mb-3">
                    <i className="bi bi-hourglass-split me-2 text-primary"></i>
                    <small>{sessao.duracao} minutos</small>
                  </div>
                  
                  <div className="mb-3">
                    <strong className="text-success">R$ {sessao.valor}</strong>
                  </div>
                  
                  {sessao.observacoes && (
                    <div className="alert alert-light mb-3">
                      <small>{sessao.observacoes}</small>
                    </div>
                  )}
                  
                  {sessao.statusSessao === 'agendada' && (
                    <button 
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => cancelarSessao(sessao.id)}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancelar Sessão
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MinhasSessoes;