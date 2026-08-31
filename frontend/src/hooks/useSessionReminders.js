import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const INTERVALOS = [60, 30, 15, 10, 5];

export function useSessionReminders() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (Notification.permission === 'default') Notification.requestPermission();

    const notificadas = new Set();

    const verificar = async () => {
      try {
        const endpoint = user.tipoUsuario === 'psicologo'
          ? `/api/sessoes/psicologo/${user.id}`
          : '/api/sessoes/minhas';
        const { data: sessoes } = await api.get(endpoint);
        const agora = new Date();

        for (const sessao of sessoes) {
          if (sessao.statusSessao !== 'agendada') continue;
          const diffMin = (new Date(sessao.dataSessao) - agora) / 60000;
          for (const intervalo of INTERVALOS) {
            const chave = `${sessao.id}-${intervalo}`;
            if (!notificadas.has(chave) && diffMin >= intervalo - 1 && diffMin <= intervalo + 1) {
              notificadas.add(chave);
              if (Notification.permission === 'granted') {
                new Notification(`Sessão em ${intervalo} minutos`, {
                  body: 'Sua sessão começa em breve. Prepare-se!',
                  icon: '/favicon.ico',
                });
              }
            }
          }
        }
      } catch { /* silencioso */ }
    };

    verificar();
    const id = setInterval(verificar, 60000);
    return () => clearInterval(id);
  }, [user]);
}