import React, { useState } from 'react';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';

const PacientesPsicologo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const pacientes = [
    { id: 1, nome: 'Maria Silva', email: 'maria@email.com', telefone: '(11) 99999-9999', ultimaConsulta: '15/01/2024', status: 'Ativo' },
    { id: 2, nome: 'João Santos', email: 'joao@email.com', telefone: '(11) 88888-8888', ultimaConsulta: '12/01/2024', status: 'Ativo' },
    { id: 3, nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 77777-7777', ultimaConsulta: '10/01/2024', status: 'Inativo' }
  ];

  const filteredPacientes = pacientes.filter(paciente => 
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-terapeuta">
      <NavbarPsicologo />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          <div className="col-md-9 col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 fw-bold">Pacientes</h1>
              <button className="btn btn-primary">
                <i className="bi bi-person-plus me-2"></i>Novo Paciente
              </button>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar paciente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <select className="form-select">
                      <option>Todos os status</option>
                      <option>Ativo</option>
                      <option>Inativo</option>
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
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Última Consulta</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPacientes.map(paciente => (
                        <tr key={paciente.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                <i className="bi bi-person text-primary"></i>
                              </div>
                              <strong>{paciente.nome}</strong>
                            </div>
                          </td>
                          <td>{paciente.email}</td>
                          <td>{paciente.telefone}</td>
                          <td>{paciente.ultimaConsulta}</td>
                          <td>
                            <span className={`badge bg-${paciente.status === 'Ativo' ? 'success' : 'secondary'}`}>
                              {paciente.status}
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button className="btn btn-outline-secondary btn-sm" data-bs-toggle="dropdown">
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Ver Perfil</a></li>
                                <li><a className="dropdown-item" href="#">Agendar Consulta</a></li>
                                <li><a className="dropdown-item" href="#">Histórico</a></li>
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

export default PacientesPsicologo;