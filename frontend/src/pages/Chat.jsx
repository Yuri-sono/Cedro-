import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import '../styles/chat.css';

function Chat() {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { userId } = useParams();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    carregarMensagens();
    const interval = setInterval(carregarMensagens, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    if (!novaMensagem.trim()) return;

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
    } catch (error) {
      alert('Erro ao enviar mensagem');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="d-flex align-items-center">
          <i className="bi bi-person-circle me-3" style={{ fontSize: '2rem' }}></i>
          <div>
            <h5 className="mb-0">Usuário #{userId}</h5>
            <small className="text-muted">Online</small>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {mensagens.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-chat-dots" style={{ fontSize: '3rem', color: '#ccc' }}></i>
            <p className="text-muted mt-3">Nenhuma mensagem ainda</p>
          </div>
        ) : (
          mensagens.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.remetenteId === user.id ? 'message-sent' : 'message-received'}`}
            >
              <div className="message-bubble">
                <p className="mb-1">{msg.mensagem}</p>
                <small className="message-time">
                  {new Date(msg.dataCriacao).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </small>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <form onSubmit={enviarMensagem} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;