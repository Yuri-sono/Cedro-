import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import '../styles/chat.css';

function Chat() {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [destinatario, setDestinatario] = useState(null);
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    carregarMensagens();
    carregarDestinatario();
    const interval = setInterval(carregarMensagens, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const carregarDestinatario = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDestinatario(response.data);
    } catch (error) {
      console.error('Erro ao carregar destinatário:', error);
    }
  };

  const carregarMensagens = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/mensagens/conversa/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagens(response.data);
      marcarComoLidas();
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLidas = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/mensagens/marcar-lidas/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Erro ao marcar como lidas:', error);
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/mensagens`, {
        destinatarioId: parseInt(userId),
        mensagem: novaMensagem
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNovaMensagem('');
      carregarMensagens();
      inputRef.current?.focus();
    } catch (error) {
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem(e);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const shouldShowDateSeparator = (index) => {
    if (index === 0) return true;
    const currentDate = new Date(mensagens[index].dataCriacao).toDateString();
    const previousDate = new Date(mensagens[index - 1].dataCriacao).toDateString();
    return currentDate !== previousDate;
  };

  const nomeDestinatario = destinatario?.nome || `Usuário #${userId}`;
  const inicialDestinatario = nomeDestinatario.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="chat-page-wrapper">
        <div className="chat-loading-state">
          <div className="chat-loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p className="text-muted mt-3">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page-wrapper">
      <div className="chat-main-container">
        
        {/* Header */}
        <div className="chat-premium-header">
          <div className="d-flex align-items-center">
            <button 
              className="chat-back-btn me-3" 
              onClick={() => navigate(-1)}
              title="Voltar"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            
            <div className="chat-avatar-wrapper me-3">
              <div className="chat-avatar">
                {inicialDestinatario}
              </div>
              <div className="chat-online-dot"></div>
            </div>
            
            <div className="flex-grow-1">
              <h5 className="mb-0 fw-bold text-white">{nomeDestinatario}</h5>
              <small className="chat-status-text">
                <i className="bi bi-circle-fill me-1" style={{ fontSize: '7px' }}></i>
                Online
              </small>
            </div>
            
            <div className="d-flex gap-2">
              <button className="chat-action-btn" title="Informações">
                <i className="bi bi-info-circle"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages-area">
          {mensagens.length === 0 ? (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">
                <i className="bi bi-chat-heart"></i>
              </div>
              <h4 className="fw-bold mb-2">Nenhuma mensagem ainda</h4>
              <p className="text-muted mb-0">
                Envie uma mensagem para iniciar a conversa com <strong>{nomeDestinatario}</strong>
              </p>
            </div>
          ) : (
            mensagens.map((msg, index) => {
              const isSent = msg.remetenteId === user.id;
              return (
                <React.Fragment key={msg.id}>
                  {shouldShowDateSeparator(index) && (
                    <div className="chat-date-separator">
                      <span>{formatDate(msg.dataCriacao)}</span>
                    </div>
                  )}
                  <div className={`chat-msg ${isSent ? 'chat-msg-sent' : 'chat-msg-received'}`}>
                    {!isSent && (
                      <div className="chat-msg-avatar-sm">
                        {inicialDestinatario}
                      </div>
                    )}
                    <div className={`chat-msg-bubble ${isSent ? 'chat-bubble-sent' : 'chat-bubble-received'}`}>
                      <p className="mb-0">{msg.mensagem}</p>
                      <div className="chat-msg-meta">
                        <span>{formatTime(msg.dataCriacao)}</span>
                        {isSent && (
                          <i className={`bi ${msg.lida ? 'bi-check2-all text-info' : 'bi-check2'} ms-1`}></i>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input-area">
          <form onSubmit={enviarMensagem} className="chat-input-form">
            <div className="chat-input-wrapper">
              <textarea
                ref={inputRef}
                className="chat-text-input"
                placeholder="Digite sua mensagem..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button 
                type="submit" 
                className={`chat-send-btn ${novaMensagem.trim() ? 'active' : ''}`}
                disabled={!novaMensagem.trim() || sending}
              >
                {sending ? (
                  <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                ) : (
                  <i className="bi bi-send-fill"></i>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;