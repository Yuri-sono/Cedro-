import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';

const MinhasConversas = () => {
  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    carregarConversas();
  }, []);

  const carregarConversas = async () => {
    try {
      const response = await api.get('/api/mensagens/conversas');
      setConversas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversas = conversas.filter(conv => 
    conv.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    if (data.toDateString() === hoje.toDateString()) {
      return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    if (data.toDateString() === ontem.toDateString()) {
      return 'Ontem';
    }
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 fw-bold">
              <i className="bi bi-chat-dots me-2 text-primary"></i>
              Minhas Conversas
            </h1>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar conversa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : filteredConversas.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-chat-heart display-1 text-muted mb-3 d-block"></i>
                <h5>Nenhuma conversa encontrada</h5>
                <p className="text-muted mb-4">
                  Comece uma conversa com um psicólogo para que ela apareça aqui.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/psicologos')}
                >
                  <i className="bi bi-search me-2"></i>
                  Buscar Psicólogos
                </button>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {filteredConversas.map((conv) => (
                    <button
                      key={conv.userId}
                      className="list-group-item list-group-item-action p-3 border-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/chat/${conv.userId}`)}
                    >
                      <div className="d-flex align-items-start">
                        <div 
                          className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: '50px', height: '50px', minWidth: '50px' }}
                        >
                          <i className="bi bi-person-fill text-primary fs-5"></i>
                        </div>
                        
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0 fw-bold">{conv.nome || `Psicólogo #${conv.userId}`}</h6>
                            <small className="text-muted text-nowrap ms-2">
                              {conv.dataUltimaMensagem && formatarData(conv.dataUltimaMensagem)}
                            </small>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <p 
                              className="mb-0 text-muted text-truncate" 
                              style={{ maxWidth: '80%' }}
                            >
                              {conv.ultimaMensagem || 'Sem mensagens'}
                            </p>
                            
                            {conv.naoLidas > 0 && (
                              <span 
                                className="badge bg-primary rounded-pill"
                                style={{ minWidth: '22px' }}
                              >
                                {conv.naoLidas}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinhasConversas;
