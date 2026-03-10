import React from 'react';

const Ebooks = () => {
  const ebooks = [
    {
      titulo: "Guia Completo sobre Ansiedade",
      descricao: "Entenda os sintomas, causas e estratégias para lidar com a ansiedade no dia a dia.",
      paginas: "45 páginas",
      categoria: "Ansiedade"
    },
    {
      titulo: "Superando a Depressão",
      descricao: "Um manual prático com técnicas e exercícios para enfrentar momentos difíceis.",
      paginas: "62 páginas",
      categoria: "Depressão"
    },
    {
      titulo: "Mindfulness para Iniciantes",
      descricao: "Aprenda os fundamentos da atenção plena e como aplicar no seu cotidiano.",
      paginas: "38 páginas",
      categoria: "Mindfulness"
    },
    {
      titulo: "Gestão do Estresse",
      descricao: "Técnicas eficazes para identificar, prevenir e gerenciar o estresse.",
      paginas: "52 páginas",
      categoria: "Estresse"
    },
    {
      titulo: "Relacionamentos Saudáveis",
      descricao: "Como construir e manter relacionamentos equilibrados e satisfatórios.",
      paginas: "48 páginas",
      categoria: "Relacionamentos"
    },
    {
      titulo: "Autoestima e Autoconfiança",
      descricao: "Exercícios práticos para desenvolver uma imagem positiva de si mesmo.",
      paginas: "41 páginas",
      categoria: "Autoestima"
    }
  ];

  return (
    <>
      <header className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="fw-bold mb-3">E-books Gratuitos</h1>
              <p className="lead mb-4">Materiais educativos sobre saúde mental e autocuidado emocional.</p>
            </div>
            <div className="col-lg-6">
              <div className="rounded-3 shadow overflow-hidden">
                <div className="bg-primary text-white p-5 text-center">
                  <i className="bi bi-book fs-1 mb-3"></i>
                  <h2 className="h4 fw-bold">Conhecimento que transforma</h2>
                  <p className="mb-0">Guias práticos para seu bem-estar mental</p>
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
              <h2 className="fw-bold mb-4">Por que ler nossos E-books?</h2>
              <p>Nossos e-books foram desenvolvidos por profissionais de saúde mental com base em evidências científicas e experiência clínica. Cada material oferece:</p>
              
              <div className="row g-4 mt-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-lightbulb text-primary me-3 fs-4 mt-1"></i>
                    <div>
                      <h4 className="h6 fw-bold">Informações confiáveis</h4>
                      <p className="mb-0">Conteúdo baseado em pesquisas e práticas comprovadas</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-tools text-primary me-3 fs-4 mt-1"></i>
                    <div>
                      <h4 className="h6 fw-bold">Ferramentas práticas</h4>
                      <p className="mb-0">Exercícios e técnicas que você pode aplicar imediatamente</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-person-check text-primary me-3 fs-4 mt-1"></i>
                    <div>
                      <h4 className="h6 fw-bold">Autoconhecimento</h4>
                      <p className="mb-0">Reflexões para entender melhor seus padrões e comportamentos</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-download text-primary me-3 fs-4 mt-1"></i>
                    <div>
                      <h4 className="h6 fw-bold">Acesso gratuito</h4>
                      <p className="mb-0">Todos os materiais são completamente gratuitos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-center fw-bold mb-5">Nossa Biblioteca</h2>
          <div className="row g-4">
            {ebooks.map((ebook, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge bg-light text-dark">{ebook.categoria}</span>
                      <small className="text-muted">{ebook.paginas}</small>
                    </div>
                    <h3 className="h5 fw-bold mb-3">{ebook.titulo}</h3>
                    <p className="text-muted mb-4">{ebook.descricao}</p>
                    <div className="mt-auto">
                      <button className="btn btn-primary w-100">
                        <i className="bi bi-download me-2"></i>
                        Baixar PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row mt-5">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <h3 className="h4 fw-bold mb-3">Quer mais conteúdo?</h3>
                  <p className="mb-4">Inscreva-se em nossa newsletter para receber novos e-books e dicas de saúde mental diretamente em seu email.</p>
                  <form className="row g-3 justify-content-center">
                    <div className="col-md-6">
                      <input type="email" className="form-control" placeholder="Seu melhor email" required />
                    </div>
                    <div className="col-auto">
                      <button type="submit" className="btn btn-primary">Inscrever-se</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Ebooks;