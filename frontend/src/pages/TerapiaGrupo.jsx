import React, { useState } from 'react';

const TerapiaGrupo = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    grupo: '',
    experiencia: ''
  });

  const grupos = [
    {
      id: 1,
      nome: 'Ansiedade e Pânico',
      descricao: 'Grupo focado em técnicas para lidar com ansiedade e ataques de pânico',
      horario: 'Terças 19h',
      vagas: 3,
      preco: 80
    },
    {
      id: 2,
      nome: 'Depressão e Autoestima',
      descricao: 'Apoio mútuo para superar a depressão e fortalecer a autoestima',
      horario: 'Quintas 18h',
      vagas: 2,
      preco: 80
    },
    {
      id: 3,
      nome: 'Luto e Perdas',
      descricao: 'Espaço seguro para elaborar perdas e processos de luto',
      horario: 'Sábados 10h',
      vagas: 4,
      preco: 80
    },
    {
      id: 4,
      nome: 'Habilidades Sociais',
      descricao: 'Desenvolvimento de competências para relacionamentos saudáveis',
      horario: 'Segundas 17h',
      vagas: 1,
      preco: 80
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: {
        message: `✨ Inscrição realizada com sucesso no grupo "${selectedGroup.nome}"!`,
        type: 'success'
      }
    }));
    setShowForm(false);
    setFormData({ nome: '', email: '', telefone: '', grupo: '', experiencia: '' });
  };

  const inscreverGrupo = (grupo) => {
    setSelectedGroup(grupo);
    setFormData(prev => ({ ...prev, grupo: grupo.nome }));
    setShowForm(true);
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <h1 className="fw-bold mb-4 text-center">Terapia em Grupo</h1>
            <p className="lead text-center mb-5">Encontros terapêuticos que proporcionam apoio mútuo e compartilhamento de experiências.</p>
            
            {!showForm ? (
              <>
                <div className="row g-4 mb-5">
                  {grupos.map(grupo => (
                    <div key={grupo.id} className="col-md-6">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h3 className="h5 fw-bold">{grupo.nome}</h3>
                            <span className={`badge ${grupo.vagas > 0 ? 'bg-success' : 'bg-danger'}`}>
                              {grupo.vagas > 0 ? `${grupo.vagas} vagas` : 'Lotado'}
                            </span>
                          </div>
                          <p className="text-muted mb-3">{grupo.descricao}</p>
                          <div className="mb-3">
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>{grupo.horario}
                            </small>
                            <br />
                            <small className="text-success fw-bold">
                              <i className="bi bi-currency-dollar me-1"></i>R$ {grupo.preco}/sessão
                            </small>
                          </div>
                          <button 
                            className="btn btn-primary w-100"
                            onClick={() => inscreverGrupo(grupo)}
                            disabled={grupo.vagas === 0}
                          >
                            {grupo.vagas > 0 ? 'Inscrever-se' : 'Lista de Espera'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="h4 fw-bold mb-3">Como funciona</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <h4 className="h6 fw-bold mb-2">Benefícios:</h4>
                        <ul className="list-unstyled">
                          <li><i className="bi bi-check-circle text-success me-2"></i>Apoio mútuo entre participantes</li>
                          <li><i className="bi bi-check-circle text-success me-2"></i>Redução do isolamento</li>
                          <li><i className="bi bi-check-circle text-success me-2"></i>Aprendizado compartilhado</li>
                          <li><i className="bi bi-check-circle text-success me-2"></i>Desenvolvimento social</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h4 className="h6 fw-bold mb-2">Formato:</h4>
                        <ul className="list-unstyled">
                          <li><i className="bi bi-people text-primary me-2"></i>6-8 participantes por grupo</li>
                          <li><i className="bi bi-clock text-primary me-2"></i>Sessões de 90 minutos</li>
                          <li><i className="bi bi-calendar text-primary me-2"></i>Encontros semanais</li>
                          <li><i className="bi bi-shield-check text-primary me-2"></i>Ambiente confidencial</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card border-0 shadow">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold">Inscrição - {selectedGroup.nome}</h3>
                    <p className="text-muted">{selectedGroup.horario} | R$ {selectedGroup.preco}/sessão</p>
                  </div>
                  
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
                        <label className="form-label">Grupo Selecionado</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.grupo}
                          disabled
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Experiência anterior com terapia</label>
                        <textarea
                          className="form-control"
                          name="experiencia"
                          value={formData.experiencia}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Conte um pouco sobre sua experiência (opcional)"
                        />
                      </div>
                      <div className="col-12 text-center">
                        <button type="submit" className="btn btn-success me-3">
                          Enviar Inscrição
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => setShowForm(false)}
                        >
                          Voltar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerapiaGrupo;