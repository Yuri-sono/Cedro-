import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import api from '../services/api.js';

const AgendaPsicologo = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sessoes, setSessoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [linkState, setLinkState] = useState({ loading: false, message: '' });

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }
    carregarSessoes();
  }, [user, authLoading, navigate]);

  const carregarSessoes = async () => {
    try {
      setLoading(true);
      setErro('');
      const response = await api.get(`/api/sessoes/psicologo/${user.id}`);
      setSessoes(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
      setErro(error?.response?.data?.error || 'Não foi possível carregar a agenda.');
      setSessoes([]);
    } finally {
      setLoading(false);
    }
  };

  const eventos = useMemo(() => {
    const cores = {
      agendada: { backgroundColor: '#0d6efd', borderColor: '#0d6efd' },
      realizada: { backgroundColor: '#198754', borderColor: '#198754' },
      cancelada: { backgroundColor: '#6c757d', borderColor: '#6c757d' }
    };

    return sessoes.map((sessao) => {
      const inicio = new Date(sessao.dataSessao);
      const fim = new Date(inicio.getTime() + Number(sessao.duracao || 60) * 60000);
      const cor = cores[sessao.statusSessao] || cores.agendada;

      return {
        id: String(sessao.id),
        title: sessao.pacienteNome || `Paciente #${sessao.pacienteId}`,
        start: inicio,
        end: fim,
        backgroundColor: cor.backgroundColor,
        borderColor: cor.borderColor,
        textColor: '#ffffff',
        extendedProps: {
          session: sessao
        }
      };
    });
  }, [sessoes]);

  const formatarDataHora = (dataStr) => {
    if (!dataStr) return '-';
    return new Date(dataStr).toLocaleString('pt-BR');
  };

  const abrirLinkReuniao = async () => {
    if (!selectedSession) return;

    try {
      setLinkState({ loading: true, message: '' });
      const response = await api.get(`/api/sessoes/${selectedSession.id}/link-reuniao`);

      if (!response.data.liberado) {
        setLinkState({
          loading: false,
          message: `Link liberado em ${formatarDataHora(response.data.disponivelEm)}`
        });
        return;
      }

      if (response.data.link) {
        window.open(response.data.link, '_blank', 'noopener,noreferrer');
        setLinkState({ loading: false, message: '' });
        return;
      }

      setLinkState({
        loading: false,
        message: response.data.erro || 'Link ainda não gerado, contate o suporte'
      });
    } catch (error) {
      console.error('Erro ao buscar link da reunião:', error);
      setLinkState({
        loading: false,
        message: error?.response?.data?.error || 'Não foi possível buscar o link da reunião.'
      });
    }
  };

  return (
    <div className="dashboard-terapeuta">
      <NavbarPsicologo psicologo={user} />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold">Agenda</h1>
            </div>

            {erro && (
              <div className="alert alert-danger" role="alert">
                {erro}
              </div>
            )}

            <div className="border rounded-3 bg-white shadow-sm p-3">
              {authLoading || loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 420 }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : (
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  locales={[ptBrLocale]}
                  locale="pt-br"
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  allDaySlot={false}
                  slotMinTime="07:00:00"
                  slotMaxTime="22:00:00"
                  height="auto"
                  nowIndicator
                  eventDisplay="block"
                  eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                  events={eventos}
                  eventClick={(info) => {
                    setSelectedSession(info.event.extendedProps.session);
                    setLinkState({ loading: false, message: '' });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedSession && (
        <>
        <div
          className="modal-backdrop fade show"
          onClick={() => setSelectedSession(null)}
          aria-hidden="true"
        />
        <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedSession.pacienteNome || `Sessão #${selectedSession.id}`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Fechar"
                  onClick={() => setSelectedSession(null)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-2"><strong>Paciente:</strong> {selectedSession.pacienteNome || `Paciente #${selectedSession.pacienteId}`}</div>
                <div className="mb-2"><strong>Psicólogo:</strong> {selectedSession.psicologoNome || `Psicólogo #${selectedSession.psicologoId}`}</div>
                <div className="mb-2"><strong>Data:</strong> {formatarDataHora(selectedSession.dataSessao)}</div>
                <div className="mb-2"><strong>Duração:</strong> {selectedSession.duracao} minutos</div>
                <div className="mb-2"><strong>Status:</strong> {selectedSession.statusSessao}</div>
                <div className="mb-2"><strong>Link:</strong> {selectedSession.linkReuniao || 'Não gerado'}</div>
                {linkState.message && (
                  <div className="alert alert-warning mt-3 mb-0">{linkState.message}</div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedSession(null)}>
                  Fechar
                </button>
                <button type="button" className="btn btn-primary" onClick={abrirLinkReuniao} disabled={linkState.loading}>
                  {linkState.loading ? 'Carregando...' : 'Ver link da reunião'}
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      <style jsx>{`
        .fc {
          --fc-border-color: #dee2e6;
          --fc-page-bg-color: #ffffff;
          font-size: 0.875rem;
        }
        .fc .fc-toolbar {
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .fc .fc-toolbar-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
        }
        .fc .fc-button {
          background: #ffffff;
          border: 1px solid #ced4da;
          color: #212529;
          box-shadow: none;
        }
        .fc .fc-button:hover {
          background: #f8f9fa;
          color: #212529;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          background: #0d6efd;
          border-color: #0d6efd;
          color: #ffffff;
        }
        .fc .fc-scrollgrid {
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .fc .fc-col-header-cell,
        .fc .fc-timegrid-slot,
        .fc .fc-daygrid-day {
          background: #ffffff;
        }
        .fc .fc-event {
          border-radius: 0.375rem;
          border-width: 0;
          padding: 0.125rem 0.25rem;
        }
        .modal-content {
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default AgendaPsicologo;
