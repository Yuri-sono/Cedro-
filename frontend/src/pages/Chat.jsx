import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import '../styles/chat.css';

const FALLBACK_ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

function Chat() {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [destinatario, setDestinatario] = useState(null);
  const [realtimeStatus, setRealtimeStatus] = useState('connecting');
  const [callState, setCallState] = useState('idle');
  const [callError, setCallError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [callMode, setCallMode] = useState('audio'); // 'audio' | 'video'
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const activeCallIdRef = useRef(null);
  const pendingOfferRef = useRef(null);
  const pendingIceRef = useRef([]);
  const callStateRef = useRef('idle');
  const callModeRef = useRef('audio');

  const destinatarioId = Number(userId);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    callModeRef.current = callMode;
  }, [callMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const upsertMensagem = useCallback((mensagem) => {
    setMensagens((prev) => {
      if (prev.some((item) => item.id === mensagem.id)) return prev;
      return [...prev, mensagem].sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
    });
  }, []);

  const marcarComoLidas = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/mensagens/marcar-lidas/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Erro ao marcar como lidas:', error);
    }
  }, [userId]);

  const carregarMensagens = useCallback(async () => {
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
  }, [marcarComoLidas, userId]);

  const carregarDestinatario = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDestinatario(response.data);
    } catch (error) {
      console.error('Erro ao carregar destinatário:', error);
    }
  }, [userId]);

  const sendRealtime = useCallback((payload) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(payload));
    return true;
  }, []);

  const cleanupCall = useCallback(() => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    pendingOfferRef.current = null;
    pendingIceRef.current = [];
    activeCallIdRef.current = null;
    setIsMuted(false);
    setIsVideoMuted(false);
    setCallMode('audio');
    setCallState('idle');
  }, []);

  const carregarIceServers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/chamadas/ice-servers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data?.iceServers?.length ? response.data.iceServers : FALLBACK_ICE_SERVERS;
    } catch (error) {
      console.error('Erro ao carregar servidores ICE:', error);
      return FALLBACK_ICE_SERVERS;
    }
  }, []);

  const createPeerConnection = useCallback(async () => {
    const iceServers = await carregarIceServers();
    const pc = new RTCPeerConnection({ iceServers });

    pc.onicecandidate = (event) => {
      if (event.candidate && activeCallIdRef.current) {
        sendRealtime({
          type: 'call:ice',
          destinatarioId,
          callId: activeCallIdRef.current,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (callModeRef.current === 'video' && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        remoteVideoRef.current.play().catch(() => {});
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch(() => {});
      }
    };

    pc.onconnectionstatechange = () => {
      if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) {
        if (callStateRef.current !== 'idle') cleanupCall();
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [carregarIceServers, cleanupCall, destinatarioId, sendRealtime]);

  const attachLocalMedia = async (pc, withVideo = false) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: withVideo });
    localStreamRef.current = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    if (withVideo && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play().catch(() => {});
    }
    return stream;
  };

  const flushPendingIce = async (pc) => {
    const candidates = pendingIceRef.current;
    pendingIceRef.current = [];
    for (const candidate of candidates) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
    }
  };

  const handleIncomingSignal = useCallback(async (message) => {
    console.log('Mensagem recebida via WebSocket:', message);
    try {
      if (message.type === 'chat:message' && message.mensagem) {
        const conversaAtual =
          Number(message.mensagem.remetenteId) === destinatarioId ||
          Number(message.mensagem.destinatarioId) === destinatarioId;
        console.log('Conversa atual?', conversaAtual, 'remetenteId:', message.mensagem.remetenteId, 'destinatarioId:', destinatarioId);
        if (!conversaAtual) return;
        upsertMensagem(message.mensagem);
        marcarComoLidas();
        return;
      }

      if (Number(message.remetenteId) !== destinatarioId) return;

      if (message.type === 'call:offer') {
        if (callStateRef.current !== 'idle') {
          sendRealtime({
            type: 'call:reject',
            destinatarioId,
            callId: message.callId,
            reason: 'busy'
          });
          return;
        }
        pendingOfferRef.current = message;
        activeCallIdRef.current = message.callId;
        setCallMode(message.callMode || 'audio');
        setCallError('');
        setCallState('ringing');
        return;
      }

      if (message.type === 'call:answer' && peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
        await flushPendingIce(peerConnectionRef.current);
        setCallState('connected');
        return;
      }

      if (message.type === 'call:ice') {
        const pc = peerConnectionRef.current;
        if (pc?.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(message.candidate)).catch(() => {});
        } else {
          pendingIceRef.current.push(message.candidate);
        }
        return;
      }

      if (message.type === 'call:reject') {
        setCallError('Chamada recusada ou usuário ocupado.');
        cleanupCall();
        return;
      }

      if (message.type === 'call:end') {
        cleanupCall();
      }
    } catch (error) {
      console.error('Erro no sinal de chamada:', error);
      setCallError('Não foi possível completar a chamada.');
      cleanupCall();
    }
  }, [cleanupCall, destinatarioId, marcarComoLidas, sendRealtime, upsertMensagem]);

  useEffect(() => {
    carregarMensagens();
    carregarDestinatario();
  }, [carregarDestinatario, carregarMensagens]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  useEffect(() => {
    let closedByComponent = false;

    const connect = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const wsUrl = `${API_BASE_URL.replace(/^http/, 'ws')}/ws-realtime?token=${encodeURIComponent(token)}`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      setRealtimeStatus('connecting');

      socket.onopen = () => setRealtimeStatus('online');
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleIncomingSignal(message);
      };
      socket.onerror = () => setRealtimeStatus('offline');
      socket.onclose = () => {
        setRealtimeStatus('offline');
        if (!closedByComponent) {
          reconnectTimerRef.current = setTimeout(connect, 2500);
        }
      };
    };

    connect();

    return () => {
      closedByComponent = true;
      clearTimeout(reconnectTimerRef.current);
      socketRef.current?.close();
      cleanupCall();
    };
  }, [cleanupCall, handleIncomingSignal]);

  const enviarMensagem = async (e) => {
    e.preventDefault();
    const texto = novaMensagem.trim();
    if (!texto || sending) return;

    setSending(true);
    const clientId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    console.log('Enviando mensagem para:', destinatarioId, 'Texto:', texto);
    console.log('Status WebSocket:', realtimeStatus);

    try {
      // Tenta enviar via WebSocket primeiro (salva no banco e notifica em tempo real)
      const sentBySocket = sendRealtime({
        type: 'chat:send',
        destinatarioId,
        mensagem: texto,
        clientId
      });

      if (sentBySocket) {
        console.log('Mensagem enviada via WebSocket');
        // Não precisa fazer mais nada, o WebSocket já salva e notifica
      } else {
        console.log('WebSocket offline, usando HTTP');
        // Fallback: Se WebSocket está offline, usa HTTP
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/api/mensagens`, {
          destinatarioId,
          mensagem: texto
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Mensagem salva via HTTP:', response.data);
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

  const iniciarChamada = async () => {
    if (callState !== 'idle') return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCallError('Seu navegador não suporta chamada de voz.');
      return;
    }

    try {
      setCallError('');
      setCallMode('audio');
      setCallState('calling');
      activeCallIdRef.current = `${user.id}-${destinatarioId}-${Date.now()}`;
      const pc = await createPeerConnection();
      await attachLocalMedia(pc, false);
      const offer = await pc.createOffer({ offerToReceiveAudio: true });
      await pc.setLocalDescription(offer);
      sendRealtime({
        type: 'call:offer',
        destinatarioId,
        callId: activeCallIdRef.current,
        callMode: 'audio',
        offer
      });
    } catch (error) {
      console.error('Erro ao iniciar chamada:', error);
      setCallError('Permita o microfone para iniciar a chamada.');
      cleanupCall();
    }
  };

  const iniciarVideoChamada = async () => {
    if (callState !== 'idle') return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCallError('Seu navegador não suporta videochamada.');
      return;
    }

    try {
      setCallError('');
      setCallMode('video');
      setCallState('calling');
      activeCallIdRef.current = `${user.id}-${destinatarioId}-${Date.now()}`;
      const pc = await createPeerConnection();
      await attachLocalMedia(pc, true);
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pc.setLocalDescription(offer);
      sendRealtime({
        type: 'call:offer',
        destinatarioId,
        callId: activeCallIdRef.current,
        callMode: 'video',
        offer
      });
    } catch (error) {
      console.error('Erro ao iniciar videochamada:', error);
      setCallError('Permita câmera e microfone para iniciar a videochamada.');
      cleanupCall();
    }
  };

  const aceitarChamada = async () => {
    const offer = pendingOfferRef.current;
    if (!offer) return;

    const isVideo = (offer.callMode || 'audio') === 'video';

    try {
      setCallError('');
      setCallMode(isVideo ? 'video' : 'audio');
      const pc = await createPeerConnection();
      await attachLocalMedia(pc, isVideo);
      await pc.setRemoteDescription(new RTCSessionDescription(offer.offer));
      await flushPendingIce(pc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendRealtime({
        type: 'call:answer',
        destinatarioId,
        callId: offer.callId,
        answer
      });
      setCallState('connected');
    } catch (error) {
      console.error('Erro ao aceitar chamada:', error);
      setCallError('Não foi possível aceitar a chamada.');
      cleanupCall();
    }
  };

  const encerrarChamada = () => {
    if (activeCallIdRef.current) {
      sendRealtime({
        type: 'call:end',
        destinatarioId,
        callId: activeCallIdRef.current
      });
    }
    cleanupCall();
  };

  const recusarChamada = () => {
    if (activeCallIdRef.current) {
      sendRealtime({
        type: 'call:reject',
        destinatarioId,
        callId: activeCallIdRef.current
      });
    }
    cleanupCall();
  };

  const toggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
  };

  const toggleVideoMute = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoMuted(!videoTrack.enabled);
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
  const isCallActive = callState !== 'idle';

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
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* ============ VIDEO CALL FULLSCREEN ============ */}
      {callMode === 'video' && callState !== 'idle' && callState !== 'ringing' && (
        <div className="chat-video-overlay">
          <video ref={remoteVideoRef} className="chat-video-remote" autoPlay playsInline />
          <div className="chat-video-local-wrapper">
            <video ref={localVideoRef} className="chat-video-local" autoPlay playsInline muted />
          </div>
          <div className="chat-video-status">
            <span>{callState === 'calling' ? `Chamando ${nomeDestinatario}...` : `Videochamada com ${nomeDestinatario}`}</span>
          </div>
          <div className="chat-video-controls">
            <button className={`chat-video-ctrl-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute} title="Microfone">
              <i className={`bi ${isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'}`}></i>
            </button>
            <button className={`chat-video-ctrl-btn ${isVideoMuted ? 'active' : ''}`} onClick={toggleVideoMute} title="Câmera">
              <i className={`bi ${isVideoMuted ? 'bi-camera-video-off-fill' : 'bi-camera-video-fill'}`}></i>
            </button>
            <button className="chat-video-ctrl-btn end" onClick={encerrarChamada} title="Encerrar">
              <i className="bi bi-telephone-x-fill"></i>
            </button>
          </div>
        </div>
      )}
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
              <button
                className={`chat-action-btn ${isCallActive ? 'in-call' : ''}`}
                title="Ligação de voz"
                onClick={iniciarChamada}
                disabled={isCallActive || realtimeStatus !== 'online'}
              >
                <i className="bi bi-telephone-fill"></i>
              </button>
              <button
                className={`chat-action-btn ${isCallActive ? 'in-call' : ''}`}
                title="Videochamada"
                onClick={iniciarVideoChamada}
                disabled={isCallActive || realtimeStatus !== 'online'}
              >
                <i className="bi bi-camera-video-fill"></i>
              </button>
              <button className="chat-action-btn" title="Informações">
                <i className="bi bi-info-circle"></i>
              </button>
            </div>
          </div>
        </div>

        {isCallActive && (
          <div className={`chat-call-panel ${callState} ${callMode === 'video' ? 'video' : ''}`}>
            <div className="chat-call-copy">
              <strong>
                {callState === 'calling' && `${callMode === 'video' ? '📹 Videochamada para' : 'Chamando'} ${nomeDestinatario}...`}
                {callState === 'ringing' && `${nomeDestinatario} está ${callMode === 'video' ? 'videochamando' : 'ligando'}`}
                {callState === 'connected' && `${callMode === 'video' ? '📹 Videochamada' : 'Ligação'} com ${nomeDestinatario}`}
              </strong>
              <span>{callState === 'connected' ? (callMode === 'video' ? 'Vídeo e áudio conectados' : 'Áudio conectado') : 'Aguardando resposta'}</span>
            </div>
            <div className="chat-call-actions">
              {callState === 'ringing' && (
                <button className="chat-call-btn accept" onClick={aceitarChamada} title="Atender">
                  <i className={`bi ${callMode === 'video' ? 'bi-camera-video-fill' : 'bi-telephone-inbound-fill'}`}></i>
                </button>
              )}
              {callState === 'connected' && callMode !== 'video' && (
                <button className={`chat-call-btn mute ${isMuted ? 'muted' : ''}`} onClick={toggleMute} title="Microfone">
                  <i className={`bi ${isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'}`}></i>
                </button>
              )}
              <button className="chat-call-btn end" onClick={callState === 'ringing' ? recusarChamada : encerrarChamada} title="Encerrar">
                <i className="bi bi-telephone-x-fill"></i>
              </button>
            </div>
          </div>
        )}

        {callError && (
          <div className="chat-call-error">
            {callError}
          </div>
        )}

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
