import React from 'react';
import { Link } from 'react-router-dom';

const TerapiaIndividual = () => {
  return (
    <>
      {/* Header */}
      <header className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="fw-bold mb-3">Terapia Individual</h1>
              <p className="lead mb-4">Sessões personalizadas para abordar questões específicas como ansiedade, depressão, estresse e traumas.</p>
              <Link to="/terapeutas" className="btn btn-primary btn-lg">Ver Terapeutas</Link>
            </div>
            <div className="col-lg-6">
              <div className="rounded-3 shadow overflow-hidden">
                <div className="bg-primary text-white p-5 text-center">
                  <i className="bi bi-person-hearts fs-1 mb-3"></i>
                  <h2 className="h4 fw-bold">Um espaço seguro para seu bem-estar emocional</h2>
                  <p className="mb-0">Atendimento personalizado com profissionais qualificados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sobre a Terapia */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2 className="fw-bold mb-4">Como funciona a Terapia Individual</h2>
              <p>A terapia individual é um processo colaborativo entre você e um psicólogo qualificado, focado em ajudá-lo a superar desafios emocionais, comportamentais ou mentais. Em um ambiente seguro e confidencial, você terá a oportunidade de explorar pensamentos, sentimentos e comportamentos que podem estar causando dificuldades em sua vida.</p>
              
              <div className="card border-0 shadow-sm my-4">
                <div className="card-body p-4">
                  <h3 className="h5 fw-bold mb-3">Benefícios da Terapia Individual</h3>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-3"></i>
                      <span>Atenção exclusiva e personalizada às suas necessidades</span>
                    </li>
                    <li className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-3"></i>
                      <span>Confidencialidade total e ambiente seguro para se expressar</span>
                    </li>
                    <li className="d-flex align-items-center mb-3">
                      <i className="bi bi-check-circle-fill text-primary me-3"></i>
                      <span>Desenvolvimento de estratégias específicas para seus desafios</span>
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-primary me-3"></i>
                      <span>Flexibilidade para abordar múltiplas questões ao longo do processo</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <h3 className="fw-bold mb-3">Abordagens Terapêuticas</h3>
              <p>No Cedro, nossos profissionais são capacitados em diversas abordagens terapêuticas, permitindo adaptar o tratamento às suas necessidades específicas:</p>
              
              <div className="row g-4 my-4">
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <h4 className="h5 fw-bold mb-3">Terapia Cognitivo-Comportamental (TCC)</h4>
                      <p className="mb-0">Foca na identificação e mudança de padrões de pensamento negativos que influenciam comportamentos e emoções.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <h4 className="h5 fw-bold mb-3">Psicanálise</h4>
                      <p className="mb-0">Explora o inconsciente para compreender como experiências passadas influenciam comportamentos atuais.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <h4 className="h5 fw-bold mb-3">Terapia Humanista</h4>
                      <p className="mb-0">Enfatiza o potencial humano para crescimento e desenvolvimento pessoal através do autoconhecimento.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <h4 className="h5 fw-bold mb-3">Mindfulness</h4>
                      <p className="mb-0">Integra técnicas de atenção plena para desenvolver maior consciência do momento presente.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Condições Tratadas */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Condições que Tratamos</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="icon-box mb-3">
                    <i className="bi bi-activity text-primary fs-1"></i>
                  </div>
                  <h3 className="h5 fw-bold">Ansiedade</h3>
                  <p>Transtorno de ansiedade generalizada, fobias, transtorno de pânico e estresse pós-traumático.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="icon-box mb-3">
                    <i className="bi bi-cloud-rain text-primary fs-1"></i>
                  </div>
                  <h3 className="h5 fw-bold">Depressão</h3>
                  <p>Transtorno depressivo maior, distimia e transtorno bipolar.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="icon-box mb-3">
                    <i className="bi bi-lightning text-primary fs-1"></i>
                  </div>
                  <h3 className="h5 fw-bold">Estresse</h3>
                  <p>Estresse crônico, burnout e dificuldades de adaptação.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="icon-box mb-3">
                    <i className="bi bi-bandaid text-primary fs-1"></i>
                  </div>
                  <h3 className="h5 fw-bold">Traumas</h3>
                  <p>Traumas de infância, abuso, luto e perdas significativas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agendar */}
      <section id="agendar" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="fw-bold mb-4">Agende sua Consulta</h2>
              <p className="mb-4">Dê o primeiro passo em direção ao seu bem-estar emocional. Nossa equipe está pronta para ajudar você nessa jornada.</p>
              <div className="card border-0 shadow">
                <div className="card-body p-4">
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Nome completo</label>
                        <input type="text" className="form-control" id="name" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Telefone</label>
                        <input type="tel" className="form-control" id="phone" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="preferredDate" className="form-label">Data preferencial</label>
                        <input type="date" className="form-control" id="preferredDate" required />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="preferredTime" className="form-label">Horário preferencial</label>
                        <select className="form-select" id="preferredTime" required>
                          <option value="" disabled>Selecione um horário</option>
                          <option value="morning">Manhã (8h às 12h)</option>
                          <option value="afternoon">Tarde (13h às 17h)</option>
                          <option value="evening">Noite (18h às 20h)</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="modality" className="form-label">Modalidade</label>
                        <select className="form-select" id="modality" required>
                          <option value="" disabled>Selecione uma opção</option>
                          <option value="presencial">Presencial</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="reason" className="form-label">Motivo da consulta</label>
                        <textarea className="form-control" id="reason" rows="3"></textarea>
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="privacy" required />
                          <label className="form-check-label" htmlFor="privacy">
                            Concordo com a <a href="#">Política de Privacidade</a>
                          </label>
                        </div>
                      </div>
                      <div className="col-12 mt-4">
                        <Link to="/terapeutas" className="btn btn-primary btn-lg">Ver Terapeutas Disponíveis</Link>
                      </div>
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

export default TerapiaIndividual;