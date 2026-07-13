import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api.js';

const POLLING_INTERVAL_MS = 15000;

function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const base = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return days > 0 ? `${days}d ${base}` : base;
}

export default function ReuniaoModal({ show, sessaoId, onClose, title }) {
  const [loading, setLoading] = useState(true);
  const [liberado, setLiberado] = useState(false);
  const [link, setLink] = useState(null);
  const [erro, setErro] = useState('');
  const [disponivelEm, setDisponivelEm] = useState(null);
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!show || !sessaoId) return undefined;

    let ativo = true;

    const pararPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const carregarStatus = async () => {
      try {
        const response = await api.get(`/api/sessoes/${sessaoId}/link-reuniao`);
        if (!ativo) return;

        const data = response.data || {};
        setLiberado(Boolean(data.liberado));
        setLink(data.link ?? null);
        setDisponivelEm(data.disponivelEm ?? null);

        if (data.liberado) {
          if (data.link) {
            setErro('');
          } else {
            setErro('Não foi possível gerar o link, contate o suporte');
          }
          pararPolling();
        } else {
          setErro('');
        }
      } catch (error) {
        if (!ativo) return;
        const backendMessage = error?.response?.data?.error;
        const message = typeof error?.message === 'string' ? error.message : '';
        setErro(backendMessage || message || 'Não foi possível consultar a reunião neste momento.');
      } finally {
        if (ativo) setLoading(false);
      }
    };

    setLoading(true);
    setErro('');
    setLiberado(false);
    setLink(null);
    setDisponivelEm(null);

    carregarStatus();
    intervalRef.current = setInterval(carregarStatus, POLLING_INTERVAL_MS);

    return () => {
      ativo = false;
      pararPolling();
    };
  }, [show, sessaoId]);

  useEffect(() => {
    if (!show) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [show]);

  const segundosRestantes = useMemo(() => {
    if (!disponivelEm || liberado) return 0;
    const destino = new Date(disponivelEm).getTime();
    return Math.max(0, Math.ceil((destino - now) / 1000));
  }, [now, disponivelEm, liberado]);

  const abrirLink = () => {
    if (!link) return;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} aria-hidden="true" />
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0">
              <div>
                <h5 className="modal-title fw-bold mb-1">{title || 'Reunião da sessão'}</h5>
                <small className="text-muted">Sessão #{sessaoId}</small>
              </div>
              <button type="button" className="btn-close" aria-label="Fechar" onClick={onClose} />
            </div>
            <div className="modal-body text-center py-4">
              {loading && (
                <div className="d-flex flex-column align-items-center gap-3 py-4">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="mb-0 text-muted">Verificando disponibilidade...</p>
                </div>
              )}

              {!loading && !liberado && !erro && (
                <div className="d-flex flex-column align-items-center gap-3 py-3">
                  <div className="display-6 fw-bold text-primary">{formatCountdown(segundosRestantes)}</div>
                  <p className="mb-0 text-muted">O link é verificado automaticamente a cada 15 segundos.</p>
                </div>
              )}

              {!loading && liberado && link && (
                <div className="d-flex flex-column align-items-center gap-3 py-3">
                  <p className="mb-0 text-success fw-semibold">A reunião está pronta</p>
                  <p className="mb-0 text-muted">Abra para entrar no app do Meet ou no navegador.</p>
                  <button className="btn btn-primary px-4" onClick={abrirLink}>
                    Entrar na reunião
                  </button>
                </div>
              )}

              {!loading && liberado && !link && (
                <div className="alert alert-warning mb-0">
                  Não foi possível gerar o link, contate o suporte
                </div>
              )}

              {!!erro && (
                <div className="alert alert-danger mb-0">
                  {erro}
                </div>
              )}
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
