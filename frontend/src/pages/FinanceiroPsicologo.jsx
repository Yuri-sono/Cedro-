import React, { useState, useEffect } from 'react';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import api from '../services/api.js';

const FinanceiroPsicologo = () => {
  const [periodo, setPeriodo] = useState('mes');
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setLoading(true);
    setErro('');
    api.get(`/api/psicologos/financeiro?periodo=${periodo}`)
      .then(res => setDados(res.data))
      .catch(() => setErro('Não foi possível carregar os dados financeiros.'))
      .finally(() => setLoading(false));
  }, [periodo]);

  const getStatusColor = (status) => {
    if (status === 'Pago') return 'success';
    if (status === 'Pendente') return 'warning';
    return 'secondary';
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
                style={{ width: 'auto' }}
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <option value="mes">Este mês</option>
                <option value="trimestre">Trimestre</option>
                <option value="ano">Ano</option>
              </select>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : dados && (
              <>
                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                            <i className="bi bi-currency-dollar text-success fs-4"></i>
                          </div>
                          <div>
                            <h3 className="h4 fw-bold mb-0">
                              R$ {Number(dados.faturamentoMes).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                            <p className="text-muted mb-0">Faturamento</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                            <i className="bi bi-clipboard-check text-primary fs-4"></i>
                          </div>
                          <div>
                            <h3 className="h4 fw-bold mb-0">{dados.consultasRealizadas}</h3>
                            <p className="text-muted mb-0">Consultas realizadas</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3">
                            <i className="bi bi-graph-up text-info fs-4"></i>
                          </div>
                          <div>
                            <h3 className="h4 fw-bold mb-0">
                              R$ {Number(dados.ticketMedio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </h3>
                            <p className="text-muted mb-0">Ticket Médio</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent">
                    <h5 className="fw-bold mb-0">Transações Recentes</h5>
                  </div>
                  <div className="card-body p-0">
                    {dados.transacoes?.length === 0 ? (
                      <p className="text-muted p-4 mb-0">Nenhuma transação no período.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th>Paciente</th>
                              <th>Data</th>
                              <th>Valor</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dados.transacoes?.map(t => (
                              <tr key={t.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                      <i className="bi bi-person text-primary"></i>
                                    </div>
                                    <strong>{t.paciente || '—'}</strong>
                                  </div>
                                </td>
                                <td>{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                                <td>R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td>
                                  <span className={`badge bg-${getStatusColor(t.status)}`}>{t.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceiroPsicologo;
