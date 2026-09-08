import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import Navbar from '../components/Navbar.jsx';

const Notificacoes = () => {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca sessões próximas como notificações
    const carregar = async () => {
      try {
        const res = await api.get('/api/sessoes/minhas');
        const agora = new Date();
        const proximas = (res.data || [])
          .filter((s) => s.statusSessao !== 'cancelada' && new Date(s.dataSessao) > agora)
          .sort((a, b) => new Date(a.dataSessao) - new Date(b.dataSessao))
          .slice(0, 10)
          .map((s) => ({
            id: s.id,
            titulo: 'Sessão agendada',
            mensagem: `Sessão com ${s.psicologoNome || s.pacienteNome || `Psicólogo #${s.psicologoId}`} em ${new Date(s.dataSessao).toLocaleString('pt-BR')}`,
            data: s.dataSessao,
            tipo: 'sessao'
          }));
        setNotificacoes(proximas);
      } catch {
        setNotificacoes([]);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container py-4" style={{ maxWidth: 700 }}>
        <h2 className="fw-bold mb-4" style={{ color: 'var(--text-primary, #212529)' }}>
          <i className="bi bi-bell me-2"></i>Notificações
        </h2>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : notificacoes.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-bell-slash fs-1 d-block mb-3"></i>
            Nenhuma notificação no momento.
          </div>
        ) : (
          <div className="list-group">
            {notificacoes.map((n) => (
              <div
                key={n.id}
                className="list-group-item list-group-item-action border-0 shadow-sm mb-2 rounded-3"
                style={{ backgroundColor: 'var(--bg-primary, #fff)', color: 'var(--text-primary, #212529)' }}
              >
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-calendar-check text-primary"></i>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-primary, #212529)' }}>{n.titulo}</strong>
                    <p className="mb-0 text-muted small">{n.mensagem}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificacoes;