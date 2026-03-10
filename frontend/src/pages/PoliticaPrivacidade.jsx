import React from 'react';

function PoliticaPrivacidade() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h1 className="text-center mb-4">Política de Privacidade</h1>
          
          <div className="card">
            <div className="card-body">
              <h3>1. Informações Coletadas</h3>
              <p>Coletamos as seguintes informações:</p>
              <ul>
                <li>Nome completo</li>
                <li>E-mail</li>
                <li>Data de nascimento</li>
                <li>Gênero</li>
                <li>Telefone</li>
                <li>Dados de uso da plataforma</li>
              </ul>
              
              <h3>2. Uso das Informações</h3>
              <p>Suas informações são utilizadas para:</p>
              <ul>
                <li>Fornecer nossos serviços</li>
                <li>Melhorar a experiência do usuário</li>
                <li>Comunicação sobre serviços</li>
                <li>Suporte técnico</li>
                <li>Cumprimento de obrigações legais</li>
              </ul>
              
              <h3>3. Compartilhamento de Dados</h3>
              <p>Não compartilhamos suas informações pessoais com terceiros, exceto:</p>
              <ul>
                <li>Com seu consentimento explícito</li>
                <li>Para cumprir obrigações legais</li>
                <li>Em casos de emergência médica</li>
                <li>Com profissionais de saúde autorizados</li>
              </ul>
              
              <h3>4. Segurança dos Dados</h3>
              <p>Implementamos medidas de segurança para proteger suas informações:</p>
              <ul>
                <li>Criptografia de senhas</li>
                <li>Conexões seguras (HTTPS)</li>
                <li>Acesso restrito aos dados</li>
                <li>Monitoramento de segurança</li>
              </ul>
              
              <h3>5. Seus Direitos</h3>
              <p>Você tem direito a:</p>
              <ul>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar exclusão de dados</li>
                <li>Portabilidade dos dados</li>
                <li>Revogar consentimento</li>
              </ul>
              
              <h3>6. Cookies</h3>
              <p>Utilizamos cookies para melhorar sua experiência. Você pode desabilitar cookies nas configurações do seu navegador.</p>
              
              <h3>7. Retenção de Dados</h3>
              <p>Mantemos seus dados pelo tempo necessário para fornecer nossos serviços ou conforme exigido por lei.</p>
              
              <h3>8. Contato</h3>
              <p>Para questões sobre privacidade, entre em contato através da nossa página de contato.</p>
              
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

export default PoliticaPrivacidade;