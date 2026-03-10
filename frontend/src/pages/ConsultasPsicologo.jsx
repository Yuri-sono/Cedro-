import React, { useState } from 'react';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';

const ConsultasPsicologo = () => {
  const [filtroStatus, setFiltroStatus] = useState('todas');
  
  const consultas = [
    { id: 1, paciente: 'Maria Silva', data: '2024-01-15', horario: '09:00', tipo: 'Individual', status: 'Concluída', valor: 150 },
    { id: 2, paciente: 'João Santos', data: '2024-01-15', horario: '10:30', tipo: 'Casal', status: 'Concluída', valor: 200 },
    { id: 3, paciente: 'Ana Costa', data: '2024-01-16', horario: '14:00', tipo: 'Individual', status: 'Agendada', valor: 150 },
    { id: 4, paciente: 'Carlos Oliveira', data: '2024-01-16', horario: '15:30', tipo: 'Individual', status: 'Confirmada', valor: 150 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluída': return 'success';
      case 'Confirmada': return 'primary';
      case 'Agendada': return 'warning';
      case 'Cancelada': return 'danger';
      default: return 'secondary';
    }
  };

  const filteredConsultas = filtroStatus === 'todas' 
    ? consultas 
    : consultas.filter(consulta => consulta.status.toLowerCase() === filtroStatus);

  return (
    <div className="dashboard-terapeuta">
      <NavbarPsicologo />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold">Consultas</h1>
              <button className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>Nova Consulta
              </button>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h4 fw-bold text-success">{consultas.filter(c => c.status === 'Concluída').length}</h3>
                    <p className="text-muted mb-0">Concluídas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h4 fw-bold text-primary">{consultas.filter(c => c.status === 'Confirmada').length}</h3>
                    <p className="text-muted mb-0">Confirmadas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h4 fw-bold text-warning">{consultas.filter(c => c.status === 'Agendada').length}</h3>
                    <p className="text-muted mb-0">Agendadas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <h3 className="h4 fw-bold text-success">R$ {consultas.reduce((total, c) => total + c.valor, 0)}</h3>
                    <p className="text-muted mb-0">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <select 
                      className="form-select" 
                      value={filtroStatus} 
                      onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                      <option value="todas">Todas as consultas</option>
                      <option value="concluída">Concluídas</option>
                      <option value="confirmada">Confirmadas</option>
                      <option value="agendada">Agendadas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Paciente</th>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Valor</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConsultas.map(consulta => (
                        <tr key={consulta.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <i className="bi bi-person text-primary"></i>
                              </div>
                              <strong>{consulta.paciente}</strong>
                            </div>
                          </td>
                          <td>{new Date(consulta.data).toLocaleDateString('pt-BR')}</td>
                          <td>{consulta.horario}</td>
                          <td>{consulta.tipo}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(consulta.status)}`}>
                              {consulta.status}
                            </span>
                          </td>
                          <td>R$ {consulta.valor}</td>
                          <td>
                            <div className="dropdown">
                              <button className="btn btn-outline-secondary btn-sm" data-bs-toggle="dropdown">
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Ver Detalhes</a></li>
                                <li><a className="dropdown-item" href="#">Editar</a></li>
                                <li><a className="dropdown-item" href="#">Cancelar</a></li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultasPsicologo;