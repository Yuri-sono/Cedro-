import React, { useState } from 'react';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';

const FinanceiroPsicologo = () => {
  const [periodo, setPeriodo] = useState('mes');
  
  const dadosFinanceiros = {
    faturamentoMes: 8500,
    consultasRealizadas: 45,
    ticketMedio: 188.89,
    crescimento: 12.5
  };

  const transacoes = [
    { id: 1, paciente: 'Maria Silva', data: '2024-01-15', valor: 150, status: 'Pago', metodo: 'PIX' },
    { id: 2, paciente: 'João Santos', data: '2024-01-15', valor: 200, status: 'Pago', metodo: 'Cartão' },
    { id: 3, paciente: 'Ana Costa', data: '2024-01-16', valor: 150, status: 'Pendente', metodo: 'Boleto' },
    { id: 4, paciente: 'Carlos Oliveira', data: '2024-01-16', valor: 150, status: 'Pago', metodo: 'PIX' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pago': return 'success';
      case 'Pendente': return 'warning';
      case 'Atrasado': return 'danger';
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
              <h1 className="h3 fw-bold">Financeiro</h1>
              <select 
                className="form-select" 
                style={{width: 'auto'}}
                value={periodo} 
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <option value="mes">Este mês</option>
                <option value="trimestre">Trimestre</option>
                <option value="ano">Ano</option>
              </select>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-success bg-opacity-10 rounded-3 p-3">
                          <i className="bi bi-currency-dollar text-success fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h3 className="h4 fw-bold mb-0">R$ {dadosFinanceiros.faturamentoMes.toLocaleString()}</h3>
                        <p className="text-muted mb-0">Faturamento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                          <i className="bi bi-clipboard-check text-primary fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h3 className="h4 fw-bold mb-0">{dadosFinanceiros.consultasRealizadas}</h3>
                        <p className="text-muted mb-0">Consultas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-info bg-opacity-10 rounded-3 p-3">
                          <i className="bi bi-graph-up text-info fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h3 className="h4 fw-bold mb-0">R$ {dadosFinanceiros.ticketMedio.toFixed(2)}</h3>
                        <p className="text-muted mb-0">Ticket Médio</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                          <i className="bi bi-trending-up text-warning fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h3 className="h4 fw-bold mb-0">+{dadosFinanceiros.crescimento}%</h3>
                        <p className="text-muted mb-0">Crescimento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="fw-bold mb-0">Transações Recentes</h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>Paciente</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Método</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transacoes.map(transacao => (
                            <tr key={transacao.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i className="bi bi-person text-primary"></i>
                                  </div>
                                  <strong>{transacao.paciente}</strong>
                                </div>
                              </td>
                              <td>{new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
                              <td>R$ {transacao.valor}</td>
                              <td>{transacao.metodo}</td>
                              <td>
                                <span className={`badge bg-${getStatusColor(transacao.status)}`}>
                                  {transacao.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="fw-bold mb-0">Resumo Financeiro</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Receita Bruta:</span>
                      <span className="fw-bold text-success">R$ 8.500,00</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Impostos (15%):</span>
                      <span className="fw-bold text-danger">- R$ 1.275,00</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Taxas:</span>
                      <span className="fw-bold text-danger">- R$ 85,00</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Receita Líquida:</span>
                      <span className="fw-bold text-success fs-5">R$ 7.140,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceiroPsicologo;