import React from 'react';

const Webinars = () => {
  const webinars = [
    { 
      titulo: "Ansiedade: Entendendo e Controlando", 
      data: "15 de Janeiro, 2024", 
      horario: "19:00 - 20:30",
      palestrante: "Dra. Maria Silva",
      status: "Próximo"
    },
    { 
      titulo: "Depressão: Sinais e Tratamentos", 
      data: "22 de Janeiro, 2024", 
      horario: "19:00 - 20:30",
      palestrante: "Dr. João Santos",
      status: "Próximo"
    },
    { 
      titulo: "Mindfulness para Iniciantes", 
      data: "29 de Janeiro, 2024", 
      horario: "19:00 - 20:00",
      palestrante: "Psic. Ana Costa",
      status: "Próximo"
    },
    { 
      titulo: "Relacionamentos Saudáveis", 
      data: "18 de Dezembro, 2023", 
      horario: "19:00 - 20:30",
      palestrante: "Dra. Carla Oliveira",
      status: "Gravado"
    },
    { 
      titulo: "Autoestima e Autoconfiança", 
      data: "11 de Dezembro, 2023", 
      horario: "19:00 - 20:00",
      palestrante: "Dr. Pedro Lima",
      status: "Gravado"
    },
    { 
      titulo: "Gestão do Estresse no Trabalho", 
      data: "4 de Dezembro, 2023", 
      horario: "19:00 - 20:30",
      palestrante: "Psic. Laura Mendes",
      status: "Gravado"
    }
  ];

  return (
    <div className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <h1 className="fw-bold mb-4 text-center">Webinars</h1>
            <p className="lead text-center mb-5">Palestras online sobre temas relevantes para o bem-estar psicológico.</p>
            
            <div className="row mb-5">
              <div className="col-md-6">
                <h2 className="h4 fw-bold mb-3">Próximos Webinars</h2>
                {webinars.filter(w => w.status === "Próximo").map((webinar, index) => (
                  <div key={index} className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="h5 fw-bold mb-0">{webinar.titulo}</h3>
                        <span className="badge bg-success">Próximo</span>
                      </div>
                      <p className="text-muted mb-2">
                        <i className="bi bi-calendar me-2"></i>{webinar.data} • {webinar.horario}
                      </p>
                      <p className="text-muted mb-3">
                        <i className="bi bi-person me-2"></i>Palestrante: {webinar.palestrante}
                      </p>
                      <button className="btn btn-primary">
                        <i className="bi bi-calendar-plus me-2"></i>Inscrever-se
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="col-md-6">
                <h2 className="h4 fw-bold mb-3">Webinars Gravados</h2>
                {webinars.filter(w => w.status === "Gravado").map((webinar, index) => (
                  <div key={index} className="card border-0 shadow-sm mb-3">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="h5 fw-bold mb-0">{webinar.titulo}</h3>
                        <span className="badge bg-secondary">Gravado</span>
                      </div>
                      <p className="text-muted mb-2">
                        <i className="bi bi-calendar me-2"></i>{webinar.data}
                      </p>
                      <p className="text-muted mb-3">
                        <i className="bi bi-person me-2"></i>Palestrante: {webinar.palestrante}
                      </p>
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-play me-2"></i>Assistir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="h4 fw-bold mb-3">Como Participar</h3>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <i className="bi bi-1-circle text-primary fs-2 mb-2"></i>
                      <h4 className="h6 fw-bold">Inscreva-se</h4>
                      <p className="small">Clique em "Inscrever-se" no webinar desejado</p>
                    </div>
                    <div className="col-md-4 mb-3">
                      <i className="bi bi-2-circle text-primary fs-2 mb-2"></i>
                      <h4 className="h6 fw-bold">Receba o Link</h4>
                      <p className="small">Você receberá o link por email antes do evento</p>
                    </div>
                    <div className="col-md-4 mb-3">
                      <i className="bi bi-3-circle text-primary fs-2 mb-2"></i>
                      <h4 className="h6 fw-bold">Participe</h4>
                      <p className="small">Entre na sala virtual no horário marcado</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="mb-3"><strong>Todos os webinars são gratuitos!</strong></p>
                    <p className="small text-muted">Os webinars são gravados e ficam disponíveis para assistir posteriormente. Você pode fazer perguntas durante a transmissão ao vivo através do chat.</p>
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

export default Webinars;