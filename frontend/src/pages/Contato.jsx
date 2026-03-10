import React from 'react';

const Contato = () => {
  return (
    <section className="contato-section py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4 text-success mb-3">Entre em Contato</h1>
            <p className="lead">Estamos aqui para ajudar você. Entre em contato conosco!</p>
          </div>
        </div>

        <div className="row g-4">
          {/* Informações de Contato */}
          <div className="col-lg-6">
            <div className="card h-100 border-0 shadow">
              <div className="card-body p-4">
                <h3 className="h4 text-success mb-4">
                  <i className="bi bi-info-circle me-2"></i>
                  Informações de Contato
                </h3>
                
                <div className="contact-info">
                  <div className="mb-3">
                    <h5><i className="bi bi-telephone text-success me-2"></i>Telefone</h5>
                    <p className="mb-0">(11) 95119-3385</p>
                    <small className="text-muted">Segunda a Sexta, 8h às 18h</small>
                  </div>
                  
                  <div className="mb-3">
                    <h5><i className="bi bi-envelope text-success me-2"></i>Email</h5>
                    <p className="mb-0">contato@cedro.com.br</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5><i className="bi bi-geo-alt text-success me-2"></i>Endereço</h5>
                    <p className="mb-0">Rua das Flores, 123<br/>Centro - Barueri/SP<br/>CEP: 06401-000</p>
                  </div>
                  
                  <div className="mb-3">
                    <h5><i className="bi bi-clock text-success me-2"></i>Horário de Funcionamento</h5>
                    <p className="mb-0">
                      Segunda a Sexta: 8h às 18h<br/>
                      Sábado: 8h às 12h<br/>
                      Domingo: Fechado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="col-lg-6">
            <div className="card h-100 border-0 shadow">
              <div className="card-body p-4">
                <h3 className="h4 text-success mb-4">
                  <i className="bi bi-chat-dots me-2"></i>
                  Envie uma Mensagem
                </h3>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome Completo</label>
                    <input type="text" className="form-control" id="nome" required />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" required />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="telefone" className="form-label">Telefone</label>
                    <input type="tel" className="form-control" id="telefone" />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="assunto" className="form-label">Assunto</label>
                    <select className="form-select" id="assunto" required>
                      <option value="">Selecione um assunto</option>
                      <option value="agendamento">Agendamento de Consulta</option>
                      <option value="informacoes">Informações sobre Serviços</option>
                      <option value="emergencia">Situação de Emergência</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="mensagem" className="form-label">Mensagem</label>
                    <textarea className="form-control" id="mensagem" rows="4" required></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-success w-100">
                    <i className="bi bi-send me-2"></i>
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Contatos de Emergência */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="alert alert-warning text-center">
              <h4 className="alert-heading">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Em caso de emergência
              </h4>
              <p className="mb-3">Se você estiver passando por uma crise ou emergência psicológica:</p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <a href="tel:188" className="btn btn-danger">
                  <i className="bi bi-telephone-fill me-2"></i>
                  CVV - 188
                </a>
                <a href="tel:192" className="btn btn-warning">
                  <i className="bi bi-ambulance me-2"></i>
                  SAMU - 192
                </a>
                <a href="/chat-emergencia" className="btn btn-info">
                  <i className="bi bi-chat-heart me-2"></i>
                  Chat de Emergência
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contato;