import React, { useState, useEffect, useRef } from 'react';
import '../styles/chat-emergencia.css';

const ChatEmergencia = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Sou o assistente virtual do Cedro. Estou aqui para te ajudar. Escolha uma das opções abaixo:",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentStep, setCurrentStep] = useState('menu');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const questionOptions = [
    {
      id: 'ansiedade',
      text: '😰 Estou sentindo ansiedade',
      response: "Entendo que você está sentindo ansiedade. Algumas técnicas que podem ajudar:\n\n• Respiração profunda: inspire por 4 segundos, segure por 4, expire por 6\n• Técnica 5-4-3-2-1: identifique 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia\n• Lembre-se: este sentimento é temporário\n\nSe a ansiedade persistir, procure ajuda profissional."
    },
    {
      id: 'tristeza',
      text: '😢 Estou me sentindo triste',
      response: "Percebo que você está passando por um momento difícil. É importante lembrar:\n\n• Você não está sozinho nessa\n• Buscar ajuda é um sinal de força, não fraqueza\n• Pequenos passos já fazem diferença\n• Este momento vai passar\n\nSe a tristeza persistir, considere conversar com um profissional."
    },
    {
      id: 'panico',
      text: '😱 Estou tendo um ataque de pânico',
      response: "Vamos fazer um exercício para te ajudar agora:\n\n1. RESPIRE: Inspire pelo nariz (4 seg), segure (4 seg), expire pela boca (6 seg)\n2. OBSERVE: Olhe ao redor e nomeie 5 objetos que você vê\n3. LEMBRE-SE: Isso vai passar, você está seguro\n4. REPITA: Continue respirando devagar\n\nSe os ataques são frequentes, procure um médico."
    },
    {
      id: 'insonia',
      text: '😴 Não consigo dormir',
      response: "Problemas de sono são comuns. Algumas dicas que podem ajudar:\n\n• Evite telas 1h antes de dormir\n• Mantenha o quarto escuro e fresco\n• Vá para cama sempre no mesmo horário\n• Evite cafeína após 14h\n• Pratique relaxamento antes de dormir\n\nSe a insônia persistir, consulte um médico."
    },
    {
      id: 'trabalho',
      text: '💼 Problemas no trabalho',
      response: "O estresse no trabalho é muito comum. Estratégias que podem ajudar:\n\n• Defina limites entre trabalho e vida pessoal\n• Faça pausas regulares durante o dia\n• Priorize tarefas importantes\n• Pratique técnicas de relaxamento\n• Converse com colegas ou supervisor quando possível\n\nSe o estresse for excessivo, considere apoio profissional."
    },
    {
      id: 'relacionamento',
      text: '💔 Problemas de relacionamento',
      response: "Relacionamentos podem ser desafiadores. Algumas dicas:\n\n• Comunique seus sentimentos com clareza\n• Ouça ativamente o outro lado\n• Estabeleça limites saudáveis\n• Lembre-se que relacionamentos envolvem reciprocidade\n• Respeite seus próprios valores\n\nSe os conflitos persistirem, terapia de casal pode ajudar."
    },
    {
      id: 'autoestima',
      text: '🪞 Problemas de autoestima',
      response: "A autoestima é algo que podemos trabalhar. Lembre-se:\n\n• Você é único e tem valor\n• Ninguém é perfeito, e está tudo bem\n• Liste 3 coisas boas sobre você todo dia\n• Trate-se com a mesma gentileza que trataria um amigo\n• Celebre pequenas conquistas\n\nSe a baixa autoestima afetar muito sua vida, procure ajuda profissional."
    },
    {
      id: 'emergencia',
      text: '🚨 Pensamentos de autolesão',
      response: "🚨 ATENÇÃO: Sua vida tem valor e existem pessoas que podem te ajudar AGORA:\n\n📞 CVV - 188 (24h, gratuito)\n📞 CAPS - Centro de Atenção Psicossocial\n📞 UBS - Unidade Básica de Saúde\n📞 SAMU - 192\n\nVocê não precisa passar por isso sozinho. Por favor, ligue para um desses números AGORA ou vá ao hospital mais próximo."
    }
  ];

  const handleOptionClick = (option) => {
    const userMessage = {
      id: Date.now(),
      text: option.text,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const botMessage = {
        id: Date.now() + 1,
        text: option.response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      setTimeout(() => {
        const menuMessage = {
          id: Date.now() + 2,
          text: "Posso te ajudar com mais alguma coisa?",
          isUser: false,
          showMenu: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, menuMessage]);
      }, 1000);
    }, 2000);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: "Olá! Sou o assistente virtual do Cedro. Estou aqui para te ajudar. Escolha uma das opções abaixo:",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setCurrentStep('menu');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="chat-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success rounded-circle mb-3" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-heart-pulse text-white" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h1 className="h2 fw-bold text-success mb-2">Chat de Apoio Emocional</h1>
              <p className="text-muted">Estamos aqui para te ajudar 24 horas por dia</p>
            </div>
            
            <div className="card border-0 shadow-lg chat-card">
              <div className="card-header text-white py-4 chat-header">
                <div className="d-flex align-items-center">
                  <div className="position-relative me-3">
                    <div className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-robot fs-4 text-white"></i>
                    </div>
                    <div className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '16px', height: '16px' }}></div>
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="h5 mb-1 fw-bold">Assistente Cedro</h3>
                    <small className="opacity-90">
                      <i className="bi bi-circle-fill me-1" style={{ fontSize: '8px' }}></i>
                      Online • Resposta imediata
                    </small>
                  </div>
                  <div className="text-end">
                    <button className="btn btn-light btn-sm rounded-pill" onClick={resetChat}>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Reiniciar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-body p-0 chat-body">
                <div className="chat-container p-4">
                  {messages.map(message => (
                    <div key={message.id} className={`d-flex mb-4 ${message.isUser ? 'justify-content-end' : 'justify-content-start'}`}>
                      {!message.isUser && (
                        <div className="me-3">
                          <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <i className="bi bi-robot"></i>
                          </div>
                        </div>
                      )}
                      <div className={`message-bubble ${message.isUser ? 'user-message' : 'bot-message'}`}>
                        <div className={`p-3 rounded-3 message-content-bubble ${message.isUser ? 'user-bubble' : 'bot-bubble'}`}>
                          <p className="mb-0" style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>{message.text}</p>
                          
                          {message.showMenu && (
                            <div className="mt-3">
                              <button 
                                className="btn btn-success btn-sm rounded-pill"
                                onClick={resetChat}
                              >
                                <i className="bi bi-arrow-clockwise me-1"></i>
                                Voltar ao menu
                              </button>
                            </div>
                          )}
                        </div>
                        <small className={`d-block mt-1 text-muted ${message.isUser ? 'text-end' : 'text-start'}`}>
                          {formatTime(message.timestamp)}
                        </small>
                      </div>
                      {message.isUser && (
                        <div className="ms-3">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <i className="bi bi-person-fill"></i>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="d-flex justify-content-start mb-4">
                      <div className="me-3">
                        <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-robot"></i>
                        </div>
                      </div>
                      <div className="bg-white border rounded-3 p-3" style={{ borderRadius: '20px 20px 20px 5px' }}>
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="options-menu p-4 border-top">
                  <h6 className="text-muted mb-3 fw-semibold">Como posso te ajudar hoje?</h6>
                  <div className="row g-3">
                    {questionOptions.map(option => (
                      <div key={option.id} className="col-md-6">
                        <button 
                          className="btn btn-outline-success w-100 text-start p-3 border-2 rounded-3"
                          onClick={() => handleOptionClick(option)}
                          style={{ transition: 'all 0.3s ease', borderRadius: '15px' }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(46, 125, 50, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span className="me-2" style={{ fontSize: '1.2rem' }}>{option.text.split(' ')[0]}</span>
                            <span className="flex-grow-1">{option.text.substring(option.text.indexOf(' ') + 1)}</span>
                            <i className="bi bi-arrow-right-short text-muted"></i>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="emergency-contact mt-4 text-center">
              <div className="alert alert-warning">
                <h5 className="alert-heading">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Em caso de emergência grave
                </h5>
                <p className="mb-3">Se você estiver em risco imediato, procure ajuda profissional:</p>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <a href="tel:188" className="btn btn-danger">
                    <i className="bi bi-telephone-fill me-2"></i>CVV - 188
                  </a>
                  <a href="tel:192" className="btn btn-warning">
                    <i className="bi bi-ambulance me-2"></i>SAMU - 192
                  </a>
                  <a href="tel:190" className="btn btn-primary">
                    <i className="bi bi-shield me-2"></i>Polícia - 190
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatEmergencia;