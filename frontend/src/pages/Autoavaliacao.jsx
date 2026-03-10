import React, { useState } from 'react';

const Autoavaliacao = () => {
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [etapaAtual, setEtapaAtual] = useState(0);

  const perguntas = [
    {
      id: 1,
      pergunta: "Como você tem se sentido na maior parte do tempo nas últimas duas semanas?",
      opcoes: [
        { valor: 0, texto: "Muito bem, feliz e otimista" },
        { valor: 1, texto: "Bem na maior parte do tempo" },
        { valor: 2, texto: "Às vezes bem, às vezes mal" },
        { valor: 3, texto: "Mal na maior parte do tempo" },
        { valor: 4, texto: "Muito mal, triste ou desesperançoso" }
      ]
    },
    {
      id: 2,
      pergunta: "Como está seu sono?",
      opcoes: [
        { valor: 0, texto: "Durmo bem e acordo descansado" },
        { valor: 1, texto: "Durmo bem na maioria das noites" },
        { valor: 2, texto: "Tenho algumas dificuldades para dormir" },
        { valor: 3, texto: "Frequentemente tenho problemas para dormir" },
        { valor: 4, texto: "Raramente consigo dormir bem" }
      ]
    },
    {
      id: 3,
      pergunta: "Como está seu apetite?",
      opcoes: [
        { valor: 0, texto: "Normal, como de costume" },
        { valor: 1, texto: "Ligeiramente diminuído ou aumentado" },
        { valor: 2, texto: "Moderadamente alterado" },
        { valor: 3, texto: "Muito alterado" },
        { valor: 4, texto: "Sem apetite ou comendo demais" }
      ]
    },
    {
      id: 4,
      pergunta: "Como está sua energia e disposição?",
      opcoes: [
        { valor: 0, texto: "Tenho muita energia" },
        { valor: 1, texto: "Tenho energia suficiente" },
        { valor: 2, texto: "Às vezes me sinto cansado" },
        { valor: 3, texto: "Frequentemente me sinto sem energia" },
        { valor: 4, texto: "Sinto-me exausto na maior parte do tempo" }
      ]
    },
    {
      id: 5,
      pergunta: "Como você avalia sua capacidade de concentração?",
      opcoes: [
        { valor: 0, texto: "Consigo me concentrar normalmente" },
        { valor: 1, texto: "Ligeira dificuldade de concentração" },
        { valor: 2, texto: "Dificuldade moderada de concentração" },
        { valor: 3, texto: "Muita dificuldade para me concentrar" },
        { valor: 4, texto: "Não consigo me concentrar" }
      ]
    }
  ];

  const handleResposta = (perguntaId, valor) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: valor
    }));
  };

  const proximaEtapa = () => {
    if (etapaAtual < perguntas.length - 1) {
      setEtapaAtual(etapaAtual + 1);
    } else {
      calcularResultado();
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 0) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const calcularResultado = () => {
    const pontuacao = Object.values(respostas).reduce((total, valor) => total + valor, 0);
    
    let nivel, descricao, recomendacao;
    
    if (pontuacao <= 5) {
      nivel = "Bem-estar Excelente";
      descricao = "Você está em um ótimo estado emocional!";
      recomendacao = "Continue mantendo seus hábitos saudáveis.";
    } else if (pontuacao <= 10) {
      nivel = "Bem-estar Bom";
      descricao = "Você está bem, mas pode melhorar alguns aspectos.";
      recomendacao = "Considere atividades de relaxamento e autocuidado.";
    } else if (pontuacao <= 15) {
      nivel = "Atenção Necessária";
      descricao = "Alguns sinais indicam que você pode precisar de apoio.";
      recomendacao = "Recomendamos conversar com um profissional.";
    } else {
      nivel = "Busque Ajuda";
      descricao = "É importante buscar apoio profissional.";
      recomendacao = "Entre em contato com nossos terapeutas.";
    }

    setResultado({ pontuacao, nivel, descricao, recomendacao });
  };

  const reiniciar = () => {
    setRespostas({});
    setResultado(null);
    setEtapaAtual(0);
  };

  if (resultado) {
    return (
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body text-center p-5">
                <h2 className="mb-4">Resultado da Autoavaliação</h2>
                <div className="mb-4">
                  <h3 className="text-primary">{resultado.nivel}</h3>
                  <p className="lead">{resultado.descricao}</p>
                  <p>{resultado.recomendacao}</p>
                </div>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-primary" onClick={reiniciar}>
                    Nova Avaliação
                  </button>
                  <a href="/terapeutas" className="btn btn-success">
                    Encontrar Terapeuta
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const perguntaAtual = perguntas[etapaAtual];

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="mb-4">
                <div className="progress mb-3">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${((etapaAtual + 1) / perguntas.length) * 100}%` }}
                  ></div>
                </div>
                <small className="text-muted">
                  Pergunta {etapaAtual + 1} de {perguntas.length}
                </small>
              </div>

              <h3 className="mb-4">{perguntaAtual.pergunta}</h3>

              <div className="mb-4">
                {perguntaAtual.opcoes.map((opcao, index) => (
                  <div key={index} className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`pergunta-${perguntaAtual.id}`}
                      id={`opcao-${index}`}
                      checked={respostas[perguntaAtual.id] === opcao.valor}
                      onChange={() => handleResposta(perguntaAtual.id, opcao.valor)}
                    />
                    <label className="form-check-label" htmlFor={`opcao-${index}`}>
                      {opcao.texto}
                    </label>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={etapaAnterior}
                  disabled={etapaAtual === 0}
                >
                  Anterior
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={proximaEtapa}
                  disabled={respostas[perguntaAtual.id] === undefined}
                >
                  {etapaAtual === perguntas.length - 1 ? 'Ver Resultado' : 'Próxima'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Autoavaliacao;