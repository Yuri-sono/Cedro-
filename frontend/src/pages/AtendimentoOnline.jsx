import React, { useState } from 'react';

const AtendimentoOnline = () => {
  const [activeTab, setActiveTab] = useState('agendar');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data: '',
    horario: '',
    terapeuta: '',
    modalidade: 'individual',
    plataforma: 'zoom',
    observacoes: ''
  });
  const [testResult, setTestResult] = useState(null);

  const terapeutas = [
    { id: 1, nome: 'Dra. Ana Silva', especialidade: 'Ansiedade e Depressão', valor: 150 },
    { id: 2, nome: 'Dr. Carlos Santos', especialidade: 'Terapia de Casal', valor: 180 },
    { id: 3, nome: 'Dra. Maria Costa', especialidade: 'Terapia Familiar', valor: 160 },
    { id: 4, nome: 'Dr. João Oliveira', especialidade: 'Trauma e PTSD', valor: 170 }
  ];

  const horarios = [
    '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: {
        message: `💻 Consulta online agendada para ${formData.data} às ${formData.horario}!`,
        type: 'success'
      }
    }));
    setFormData({
      nome: '', email: '', telefone: '', data: '', horario: '', terapeuta: '',
      modalidade: 'individual', plataforma: 'zoom', observacoes: ''
    });
  };

  const testarConexao = () => {
    setTestResult('testando');
    setTimeout(() => {
      setTestResult('sucesso');
    }, 2000);
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <h1 className="fw-bold mb-4 text-center">Atendimento Online</h1>
            <p className="lead text-center mb-5">Consultas virtuais com a mesma qualidade do atendimento presencial.</p>
            
            <div className="card border-0 shadow">
              <div className="card-header bg-transparent">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'agendar' ? 'active' : ''}`}
                      onClick={() => setActiveTab('agendar')}
                    >
                      <i className="bi bi-calendar-plus me-2"></i>Agendar
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'teste' ? 'active' : ''}`}
                      onClick={() => setActiveTab('teste')}
                    >
                      <i className="bi bi-wifi me-2"></i>Teste de Conexão
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                      onClick={() => setActiveTab('info')}
                    >
                      <i className="bi bi-info-circle me-2"></i>Informações
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-4">
                {activeTab === 'agendar' && (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Nome Completo *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Telefone *</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Data *</label>
                        <input
                          type="date"
                          className="form-control"
                          name="data"
                          value={formData.data}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Horário *</label>
                        <select
                          className="form-select"
                          name="horario"
                          value={formData.horario}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione</option>
                          {horarios.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Terapeuta *</label>
                        <select
                          className="form-select"
                          name="terapeuta"
                          value={formData.terapeuta}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione</option>
                          {terapeutas.map(t => (
                            <option key={t.id} value={t.nome}>
                              {t.nome} - {t.especialidade} (R$ {t.valor})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Modalidade</label>
                        <select
                          className="form-select"
                          name="modalidade"
                          value={formData.modalidade}
                          onChange={handleInputChange}
                        >
                          <option value="individual">Individual</option>
                          <option value="casal">Casal</option>
                          <option value="familia">Família</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Plataforma Preferida</label>
                        <select
                          className="form-select"
                          name="plataforma"
                          value={formData.plataforma}
                          onChange={handleInputChange}
                        >
                          <option value="zoom">Zoom</option>
                          <option value="meet">Google Meet</option>
                          <option value="teams">Microsoft Teams</option>
                          <option value="cedro">Plataforma Cedro</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Observações</label>
                        <textarea
                          className="form-control"
                          name="observacoes"
                          value={formData.observacoes}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Conte um pouco sobre o que gostaria de trabalhar na terapia"
                        />
                      </div>
                      <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary btn-lg">
                          <i className="bi bi-calendar-check me-2"></i>Agendar Consulta
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {activeTab === 'teste' && (
                  <div className="text-center">
                    <h3 className="mb-4">Teste sua Conexão</h3>
                    <p className="mb-4">Verifique se seu equipamento está funcionando corretamente para a consulta online.</p>
                    
                    <div className="row g-4 mb-4">
                      <div className="col-md-4">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <i className="bi bi-wifi text-primary fs-1 mb-3"></i>
                            <h5>Internet</h5>
                            <p className="small text-muted">Velocidade mínima: 1 Mbps</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <i className="bi bi-camera-video text-success fs-1 mb-3"></i>
                            <h5>Câmera</h5>
                            <p className="small text-muted">Resolução mínima: 480p</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <i className="bi bi-mic text-info fs-1 mb-3"></i>
                            <h5>Microfone</h5>
                            <p className="small text-muted">Audio claro e sem ruídos</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={testarConexao}
                      disabled={testResult === 'testando'}
                    >
                      {testResult === 'testando' ? (
                        <><i className="bi bi-arrow-clockwise me-2"></i>Testando...</>
                      ) : (
                        <><i className="bi bi-play-circle me-2"></i>Iniciar Teste</>
                      )}
                    </button>

                    {testResult === 'sucesso' && (
                      <div className="alert alert-success mt-4">
                        <i className="bi bi-check-circle me-2"></i>
                        Tudo funcionando perfeitamente! Você está pronto para sua consulta online.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'info' && (
                  <div>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <h4 className="fw-bold mb-3">Vantagens</h4>
                        <ul className="list-unstyled">
                          <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Comodidade de casa</li>
                          <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Economia de tempo</li>
                          <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Maior flexibilidade</li>
                          <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Mesma eficácia</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h4 className="fw-bold mb-3">Requisitos</h4>
                        <ul className="list-unstyled">
                          <li className="mb-2"><i className="bi bi-wifi text-primary me-2"></i>Internet estável</li>
                          <li className="mb-2"><i className="bi bi-laptop text-primary me-2"></i>Dispositivo com câmera</li>
                          <li className="mb-2"><i className="bi bi-mic text-primary me-2"></i>Microfone funcionando</li>
                          <li className="mb-2"><i className="bi bi-house text-primary me-2"></i>Ambiente privado</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="alert alert-info mt-4">
                      <h5 className="alert-heading">Segurança e Privacidade</h5>
                      <p className="mb-0">Todas as consultas são realizadas em plataformas criptografadas, garantindo total confidencialidade e segurança dos seus dados.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtendimentoOnline;