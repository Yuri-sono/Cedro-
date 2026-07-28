import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { Client } from '@stomp/stompjs';
import '../styles/chat.css';

// Helper para obter token (WebSocket STOMP precisa do token na URL)
const getTokenForWebSocket = () => localStorage.getItem('token');

function Chat() {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [destinatario, setDestinatario] = useState(null);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  const destinatarioId = Number(userId);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  const upsertMensagem = useCallback((mensagem) => {
    setMensagens((prev) => {
      if (prev.some((item) => item.id === mensagem.id)) return prev;
      return [...prev, mensagem].sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
    });
  }, []);

  const marcarComoLidas = useCallback(async () => {
    try {
      await api.put(`/api/mensagens/marcar-lidas/${userId}`, {});
    } catch (error) {
      console.error('Erro ao marcar como lidas:', error);
    }
  }, [userId]);

  const carregarMensagens = useCallback(async () => {
    try {
      const response = await api.get(`/api/mensagens/conversa/${userId}`);
      setMensagens(response.data);
      marcarComoLidas();
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, [marcarComoLidas, userId]);

  const carregarDestinatario = useCallback(async () => {
    try {
      const response = await api.get(`/api/usuarios/${userId}`);
      setDestinatario(response.data);
    } catch (error) {
      console.error('Erro ao carregar destinatário:', error);
    }
  }, [userId]);

  const sendRealtime = useCallback((payload) => {
    const client = socketRef.current;
    if (!client || !client.active) return false;
    client.publish({ destination: '/app/chat.send', body: JSON.stringify(payload) });
    return true;
  }, []);

  const handleIncomingSignal = useCallback((message) => {
    if (message.type === 'chat:message' && message.mensagem) {
      const conversaAtual =
        Number(message.mensagem.remetenteId) === destinatarioId ||
        Number(message.mensagem.destinatarioId) === destinatarioId;
      if (!conversaAtual) return;
      upsertMensagem(message.mensagem);
      marcarComoLidas();
    }
  }, [destinatarioId, marcarComoLidas, upsertMensagem]);

  useEffect(() => {
    carregarMensagens();
    carregarDestinatario();
  }, [carregarDestinatario, carregarMensagens]);

  useEffect(() => {
    if (mensagens.length > 0) {
      const lastMsg = mensagens[mensagens.length - 1];
      const isMyMessage = Number(lastMsg.remetenteId) === Number(user?.id);
      scrollToBottom(isMyMessage);
    }
  }, [mensagens, user]);

  useEffect(() => {
    let closedByComponent = false;

    const connect = () => {
      const token = getTokenForWebSocket();
      if (!token) return;

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const wsUrl = `${API_BASE_URL.replace(/^http/, 'ws')}/ws-chat?token=${encodeURIComponent(token)}`;

      const client = new Client({
        webSocketFactory: () => new WebSocket(wsUrl),
        reconnectDelay: 2500,
        onConnect: () => {
          setRealtimeStatus('online');
          // subscribe to user queue for messages
          client.subscribe('/user/queue/mensagens', (frame) => {
            if (frame.body) {
              const message = JSON.parse(frame.body);
              handleIncomingSignal(message);
            }
          });
        },
        onStompError: (frame) => {
          console.error('STOMP error', frame);
        },
        onDisconnect: () => {
          setRealtimeStatus('offline');
        }
      });

      socketRef.current = client;
      setRealtimeStatus('connecting');
      client.activate();
    };

    connect();

    return () => {
      closedByComponent = true;
      clearTimeout(reconnectTimerRef.current);
      socketRef.current?.close();
    };
  }, [handleIncomingSignal]);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    const texto = novaMensagem.trim();
    if (!texto || sending) return;

    setSending(true);
    const clientId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    try {
      const sentBySocket = sendRealtime({
        type: 'chat:send',
        destinatarioId,
        mensagem: texto,
        clientId
      });

      if (!sentBySocket) {
        const response = await api.post('/api/mensagens', {
          destinatarioId,
          mensagem: texto
        });

        upsertMensagem(response.data);
      }

      setNovaMensagem('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
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
              <div className={`chat-online-dot ${realtimeStatus === 'online' ? '' : 'offline'}`}></div>
            </div>

            <div className="flex-grow-1">
              <h5 className="mb-0 fw-bold text-white">{nomeDestinatario}</h5>
              <small className="chat-status-text">
                <i className="bi bi-circle-fill me-1" style={{ fontSize: '7px' }}></i>
                {realtimeStatus === 'online' ? 'Tempo real conectado' : 'Reconectando...'}
              </small>
            </div>

            <div className="d-flex gap-2">
              <button className="chat-action-btn" title="Informações">
                <i className="bi bi-info-circle"></i>
              </button>
            </div>
          </div>
        </div>

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
              const isSent = Number(msg.remetenteId) === Number(user.id);
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
