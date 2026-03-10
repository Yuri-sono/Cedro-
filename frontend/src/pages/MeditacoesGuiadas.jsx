import React from 'react';

const MeditacoesGuiadas = () => {
  const meditacoes = [
    {
      titulo: "Respiração Consciente",
      duracao: "10 min",
      descricao: "Uma meditação simples focada na respiração para reduzir ansiedade e estresse.",
      nivel: "Iniciante"
    },
    {
      titulo: "Body Scan Relaxante",
      duracao: "15 min",
      descricao: "Técnica de varredura corporal para liberar tensões e promover relaxamento profundo.",
      nivel: "Intermediário"
    },
    {
      titulo: "Mindfulness para Ansiedade",
      duracao: "12 min",
      descricao: "Prática de atenção plena específica para momentos de ansiedade e preocupação.",
      nivel: "Iniciante"
    },
    {
      titulo: "Meditação para o Sono",
      duracao: "20 min",
      descricao: "Guia relaxante para preparar mente e corpo para uma noite de sono reparador.",
      nivel: "Todos os níveis"
    }
  ];

  return (
    <>
      <header className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="fw-bold mb-3">Meditações Guiadas</h1>
              <p className="lead mb-4">Áudios gratuitos para ajudar na prática de mindfulness e relaxamento.</p>
            </div>
            <div className="col-lg-6">
              <div className="rounded-3 shadow overflow-hidden">
                <div className="bg-primary text-white p-5 text-center">
                  <i className="bi bi-headphones fs-1 mb-3"></i>
                  <h2 className="h4 fw-bold">Encontre paz interior através da meditação</h2>
                  <p className="mb-0">Práticas guiadas para todos os níveis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto mb-5">
              <h2 className="fw-bold mb-4">Benefícios da Meditação</h2>
              <p>A meditação é uma prática milenar que oferece inúmeros benefícios para a saúde mental e física. Nossos áudios guiados foram desenvolvidos por profissionais especializados para ajudar você a:</p>
              
              <div className="row g-4 mt-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                    <span>Reduzir ansiedade e estresse</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                    <span>Melhorar a qualidade do sono</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                    <span>Aumentar o foco e concentração</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                    <span>Desenvolver autoconhecimento</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                    <span>Promover bem-estar emocional</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-primary me-3 fs-5"></i>
                    <span>Fortalecer a resiliência mental</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-center fw-bold mb-5">Nossas Meditações</h2>
          <div className="row g-4">
            {meditacoes.map((meditacao, index) => (
              <div key={index} className="col-md-6 col-lg-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h3 className="h5 fw-bold mb-0">{meditacao.titulo}</h3>
                      <span className="badge bg-primary">{meditacao.duracao}</span>
                    </div>
                    <p className="text-muted mb-3">{meditacao.descricao}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Nível: {meditacao.nivel}</small>
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-play-fill me-1"></i> Reproduzir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row mt-5">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm bg-light">
                <div className="card-body p-4 text-center">
                  <h3 className="h4 fw-bold mb-3">Dicas para Meditar</h3>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <i className="bi bi-clock text-primary fs-3 mb-2 d-block"></i>
                      <h4 className="h6 fw-bold">Escolha um horário</h4>
                      <p className="small mb-0">Pratique sempre no mesmo horário para criar um hábito</p>
                    </div>
                    <div className="col-md-4">
                      <i className="bi bi-house text-primary fs-3 mb-2 d-block"></i>
                      <h4 className="h6 fw-bold">Local tranquilo</h4>
                      <p className="small mb-0">Encontre um espaço silencioso e confortável</p>
                    </div>
                    <div className="col-md-4">
                      <i className="bi bi-heart text-primary fs-3 mb-2 d-block"></i>
                      <h4 className="h6 fw-bold">Seja paciente</h4>
                      <p className="small mb-0">Os benefícios aparecem com a prática regular</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MeditacoesGuiadas;