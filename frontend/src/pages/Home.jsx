import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {

  useEffect(() => {
    // Scroll animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkIfInView = () => {
      animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          element.classList.add('show');
        }
      });
    };
    
    checkIfInView();
    window.addEventListener('scroll', checkIfInView);
    
    return () => window.removeEventListener('scroll', checkIfInView);
  }, []);

  return (
    <>
      {/* Premium Hero Section */}
      <header className="home-hero">
        <div className="home-hero-overlay"></div>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8 col-xl-7 animate-on-scroll show">
              <span className="badge bg-success bg-opacity-25 text-white border border-success rounded-pill px-3 py-2 mb-3 fs-6">
                <i className="bi bi-star-fill text-warning me-2"></i>Sua saúde mental em primeiro lugar
              </span>
              <h1>Cuidar da mente é a raiz de uma vida forte</h1>
              <p className="lead mb-5 opacity-75">
                O Cedro oferece o suporte emocional e profissional que você precisa. Como a árvore, ajudamos você a criar raízes profundas para enfrentar qualquer tempestade.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/psicologos" className="btn btn-success btn-lg rounded-pill px-5 fw-bold shadow-lg">
                  Encontrar Psicólogo
                </Link>
                <Link to="/saude-mental" className="btn btn-outline-light btn-lg rounded-pill px-5 fw-bold">
                  Guia de Saúde Mental
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sobre Nós - Premium */}
      <section id="sobre" className="py-5" style={{ background: 'var(--bg-primary)' }}>
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 animate-on-scroll">
              <div className="position-relative">
                <img src="/images/about-cedro.png" alt="Ambiente terapêutico Cedro" className="img-fluid rounded-4 shadow-lg" />
                <div className="position-absolute bottom-0 end-0 bg-white p-4 rounded-4 shadow-lg mb-n4 me-n4 d-none d-md-block" style={{ maxWidth: '250px' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle fs-3">
                      <i className="bi bi-tree-fill"></i>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-0 text-dark">Força</h4>
                      <p className="text-muted mb-0 small">e resiliência</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 animate-on-scroll">
              <h6 className="text-success fw-bold text-uppercase tracking-wide mb-2">Sobre o Cedro</h6>
              <h2 className="display-5 fw-bold mb-4">Um espaço seguro para o seu crescimento</h2>
              <p className="lead text-muted mb-4">
                Somos uma plataforma dedicada a conectar você a profissionais de saúde mental de excelência, proporcionando acolhimento, respeito e acessibilidade.
              </p>
              <p className="mb-4">
                O Cedro nasceu da necessidade de quebrar o estigma sobre a saúde mental. Assim como a árvore cedro é conhecida por sua madeira resistente e raízes inabaláveis, acreditamos que todo ser humano tem a capacidade de se fortalecer e crescer através do autoconhecimento e da terapia.
              </p>
              
              <div className="row g-4 mt-2">
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <i className="bi bi-shield-check text-success fs-3"></i>
                    <div>
                      <h5 className="fw-bold mb-1">Confidencialidade</h5>
                      <p className="text-muted small mb-0">Seu espaço é 100% seguro e privado.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start gap-3">
                    <i className="bi bi-heart-pulse text-success fs-3"></i>
                    <div>
                      <h5 className="fw-bold mb-1">Empatia real</h5>
                      <p className="text-muted small mb-0">Profissionais humanos e acolhedores.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços - Imagens Cards */}
      <section id="servicos" className="py-5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container py-5">
          <div className="text-center max-w-700 mx-auto mb-5 animate-on-scroll">
            <h6 className="text-success fw-bold text-uppercase mb-2">Nossos Serviços</h6>
            <h2 className="display-5 fw-bold mb-3">Como podemos te ajudar hoje?</h2>
            <p className="lead text-muted">Oferecemos diferentes modalidades para nos adaptarmos à sua rotina e necessidade.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-6 animate-on-scroll">
              <div className="service-img-card">
                <img src="/images/online-therapy.png" alt="Atendimento Online" />
                <div className="service-img-overlay">
                  <span className="badge bg-success mb-3 align-self-start py-2 px-3">Recomendado</span>
                  <h3 className="fw-bold display-6 mb-2">Atendimento Online</h3>
                  <p className="fs-5 opacity-75 mb-4">Terapia no conforto e segurança da sua casa, com a mesma eficácia do presencial.</p>
                  <Link to="/atendimento-online" className="btn btn-light rounded-pill align-self-start fw-bold px-4 py-2">
                    Saiba mais <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 animate-on-scroll">
              <div className="service-img-card">
                <img src="/images/psychologist-team.png" alt="Equipe de Psicólogos" />
                <div className="service-img-overlay">
                  <span className="badge bg-info text-dark mb-3 align-self-start py-2 px-3">Especialistas</span>
                  <h3 className="fw-bold display-6 mb-2">Psicólogos Especializados</h3>
                  <p className="fs-5 opacity-75 mb-4">Encontre o profissional ideal para a sua necessidade específica em nossa rede.</p>
                  <Link to="/psicologos" className="btn btn-light rounded-pill align-self-start fw-bold px-4 py-2">
                    Ver profissionais <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Novo Destacado: Recursos e Saúde Mental */}
      <section id="recursos" className="py-5" style={{ background: 'var(--bg-primary)' }}>
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 animate-on-scroll">
              <h6 className="text-success fw-bold text-uppercase mb-2">Recursos Gratuitos</h6>
              <h2 className="display-5 fw-bold mb-4">Informação e acolhimento à sua disposição</h2>
              <p className="lead text-muted mb-4">
                Acreditamos que o conhecimento é o primeiro passo para o tratamento. Criamos áreas dedicadas para você entender melhor o que está sentindo.
              </p>
              
              <Link to="/saude-mental" className="feature-card d-flex align-items-center p-4 mb-3 text-decoration-none border">
                <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-circle me-4 fs-3 flex-shrink-0">
                  <i className="bi bi-heart-pulse-fill"></i>
                </div>
                <div>
                  <h4 className="fw-bold text-body mb-1">Guia de Saúde Mental</h4>
                  <p className="text-muted mb-0 small">Entenda ansiedade, depressão, TDAH e mais.</p>
                </div>
                <i className="bi bi-chevron-right ms-auto text-muted"></i>
              </Link>

              <Link to="/autoavaliacoes" className="feature-card d-flex align-items-center p-4 text-decoration-none border">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-4 fs-3 flex-shrink-0">
                  <i className="bi bi-clipboard2-pulse-fill"></i>
                </div>
                <div>
                  <h4 className="fw-bold text-body mb-1">Testes e Autoavaliações</h4>
                  <p className="text-muted mb-0 small">Identifique possíveis sinais de alerta.</p>
                </div>
                <i className="bi bi-chevron-right ms-auto text-muted"></i>
              </Link>
            </div>
            
            <div className="col-lg-6 animate-on-scroll">
              <div className="highlight-banner text-center">
                <i className="bi bi-controller fs-1 mb-3 d-block"></i>
                <h2 className="fw-bold mb-3">Precisa relaxar a mente agora?</h2>
                <p className="fs-5 opacity-75 mb-4">
                  Criamos uma área de passatempos interativos. Se você está ansioso, estourar plástico bolha virtual ou interagir com partículas pode te ajudar a focar no presente.
                </p>
                <Link to="/relaxar" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-success">
                  Acessar Passatempos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ajuda Emergencial (Redesenhada) */}
      <section id="ajuda" className="py-5" style={{ background: 'linear-gradient(135deg, #212529 0%, #1a1d20 100%)' }}>
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-7 text-white mb-4 mb-lg-0 animate-on-scroll">
              <span className="badge bg-danger mb-3 px-3 py-2 fs-6 rounded-pill">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>SOS Emergência
              </span>
              <h2 className="display-6 fw-bold mb-3">Precisa de ajuda imediata?</h2>
              <p className="lead opacity-75 mb-4">
                Se você está passando por uma crise extrema ou tendo pensamentos de autoagressão, não hesite. Existe ajuda imediata, gratuita e sigilosa disponível 24 horas por dia.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a href="tel:188" className="btn btn-danger btn-lg rounded-pill px-4 fw-bold">
                  <i className="bi bi-telephone-fill me-2"></i> Ligar 188 (CVV)
                </a>
                <Link to="/chat-emergencia" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  <i className="bi bi-chat-dots me-2"></i> Iniciar Chat
                </Link>
              </div>
            </div>
            <div className="col-lg-4 offset-lg-1 animate-on-scroll">
              <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-secondary text-white">
                <h5 className="fw-bold mb-4">Sinais de alerta para buscar o CVV:</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 d-flex"><i className="bi bi-check-circle-fill text-danger me-2 mt-1"></i> Desespero ou dor emocional insuportável</li>
                  <li className="mb-3 d-flex"><i className="bi bi-check-circle-fill text-danger me-2 mt-1"></i> Sensação de que não há saída</li>
                  <li className="mb-3 d-flex"><i className="bi bi-check-circle-fill text-danger me-2 mt-1"></i> Pensamentos frequentes sobre morte</li>
                  <li className="d-flex"><i className="bi bi-check-circle-fill text-danger me-2 mt-1"></i> Isolamento extremo repentino</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Simples */}
      <section id="contato" className="py-5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container text-center py-5 animate-on-scroll">
          <h2 className="fw-bold mb-4">Estamos aqui para você</h2>
          <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: '600px' }}>
            Ficou com alguma dúvida sobre como a plataforma funciona? Nossa equipe de suporte está pronta para conversar com você.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/contato" className="btn btn-success btn-lg rounded-pill px-4">
              <i className="bi bi-envelope me-2"></i>
              Enviar Mensagem
            </Link>
            <a href="https://wa.me/5511951193385" target="_blank" rel="noreferrer" className="btn btn-outline-success btn-lg rounded-pill px-4">
              <i className="bi bi-whatsapp me-2"></i>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;