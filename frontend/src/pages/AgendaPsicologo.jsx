import React, { useState } from 'react';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';

const AgendaPsicologo = () => {
  const [viewMode, setViewMode] = useState('semana');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const consultas = [
    { id: 1, paciente: 'Maria Silva', horario: '09:00', duracao: 60, tipo: 'Individual', status: 'confirmada' },
    { id: 2, paciente: 'João Santos', horario: '10:30', duracao: 60, tipo: 'Casal', status: 'confirmada' },
    { id: 3, paciente: 'Ana Costa', horario: '14:00', duracao: 60, tipo: 'Individual', status: 'pendente' }
  ];

  const horarios = Array.from({ length: 14 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada': return 'success';
      case 'pendente': return 'warning';
      case 'cancelada': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="dashboard-terapeuta">
      <NavbarPsicologo />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold">Agenda</h1>
              <div className="d-flex gap-2">
                <button 
                  className={`btn ${viewMode === 'dia' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('dia')}
                >
                  Dia
                </button>
                <button 
                  className={`btn ${viewMode === 'semana' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setViewMode('semana')}
                >
                  Semana
                </button>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-outline-secondary">
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    <h4 className="mb-0">Janeiro 2024</h4>
                    <button className="btn btn-outline-secondary">
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                  <button className="btn btn-success">
                    <i className="bi bi-plus-circle me-2"></i>Novo Agendamento
                  </button>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent">
                <h5 className="fw-bold mb-0">Consultas de Hoje</h5>
              </div>
              <div className="card-body">
                {consultas.map(consulta => (
                  <div key={consulta.id} className="d-flex align-items-center p-3 border rounded mb-3">
                    <div className="flex-shrink-0">
                      <div className={`bg-${getStatusColor(consulta.status)} bg-opacity-25 rounded-circle p-2`}>
                        <i className={`bi bi-person text-${getStatusColor(consulta.status)} fs-5`}></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">{consulta.paciente}</h6>
                      <p className="text-muted mb-1">{consulta.horario} - {consulta.tipo}</p>
                      <span className={`badge bg-${getStatusColor(consulta.status)}`}>
                        {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaPsicologo;