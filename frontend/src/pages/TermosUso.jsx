import React from 'react';

function TermosUso() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="text-center mb-4">Termos de Uso</h1>
          
          <div className="card">
            <div className="card-body">
              <h3>1. Aceitação dos Termos</h3>
              <p>Ao acessar e usar a plataforma Cedro, você concorda com estes termos de uso.</p>
              
              <h3>2. Uso da Plataforma</h3>
              <p>A plataforma destina-se ao apoio psicológico e bem-estar mental. É proibido:</p>
              <ul>
                <li>Usar linguagem ofensiva ou inadequada</li>
                <li>Compartilhar conteúdo impróprio</li>
                <li>Violar direitos de outros usuários</li>
                <li>Usar a plataforma para fins ilegais</li>
              </ul>
              
              <h3>3. Suspensão e Multa</h3>
              <p><strong>IMPORTANTE:</strong> Usuários que forem suspensos da plataforma por violação destes termos estarão sujeitos a uma multa de <strong>R$ 200,00 (duzentos reais)</strong>.</p>
              <p>A suspensão pode ocorrer por:</p>
              <ul>
                <li>Comportamento inadequado</li>
                <li>Violação das regras da comunidade</li>
                <li>Uso indevido dos serviços</li>
                <li>Desrespeito a outros usuários ou profissionais</li>
              </ul>
              
              <h3>4. Responsabilidades</h3>
              <p>O usuário é responsável por:</p>
              <ul>
                <li>Manter suas informações atualizadas</li>
                <li>Proteger suas credenciais de acesso</li>
                <li>Usar a plataforma de forma ética</li>
                <li>Respeitar outros usuários</li>
              </ul>
              
              <h3>5. Limitação de Responsabilidade</h3>
              <p>A plataforma Cedro não substitui tratamento médico profissional. Em casos de emergência, procure ajuda médica imediata.</p>
              
              <h3>6. Modificações</h3>
              <p>Estes termos podem ser alterados a qualquer momento. Usuários serão notificados sobre mudanças significativas.</p>
              
              <h3>7. Contato</h3>
              <p>Para dúvidas sobre estes termos, entre em contato conosco através da página de contato.</p>
              
              <div className="text-muted mt-4">
                <small>Última atualização: {new Date().toLocaleDateString('pt-BR')}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermosUso;