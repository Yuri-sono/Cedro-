import React, { useState } from 'react';

const Autoavaliacoes = () => {
  const [testeAtual, setTesteAtual] = useState(null);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [mostrandoResultado, setMostrandoResultado] = useState(false);

  const testes = {
    ansiedade: {
      titulo: "Teste de Ansiedade",
      perguntas: [
        {
          texto: "Com que frequência você se sente nervoso ou ansioso?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você tem dificuldade para relaxar?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você se preocupa excessivamente com coisas pequenas?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você sente sintomas físicos como coração acelerado ou suor?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você evita situações que podem causar ansiedade?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        }
      ]
    },
    depressao: {
      titulo: "Teste de Depressão",
      perguntas: [
        {
          texto: "Com que frequência você se sente triste ou desanimado?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você perdeu interesse em atividades que antes gostava?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você tem dificuldade para dormir ou dorme demais?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você se sente sem energia ou cansado?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você tem pensamentos negativos sobre si mesmo?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        }
      ]
    },
    estresse: {
      titulo: "Teste de Estresse",
      perguntas: [
        {
          texto: "Você se sente sobrecarregado com suas responsabilidades?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você tem dificuldade para se concentrar?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você se irrita facilmente com pequenas coisas?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você sente tensão muscular ou dores de cabeça?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        },
        {
          texto: "Você tem dificuldade para tomar decisões?",
          opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"]
        }
      ]
    }
  };

  const iniciarTeste = (tipo) => {
    setTesteAtual(testes[tipo]);
    setPerguntaAtual(0);
    setRespostas([]);
    setMostrandoResultado(false);
  };

  const responder = (valor) => {
    const novasRespostas = [...respostas];
    novasRespostas[perguntaAtual] = valor;
    setRespostas(novasRespostas);
    
    if (perguntaAtual < testeAtual.perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      mostrarResultado();
    }
  };

  const voltarPergunta = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1);
    }
  };

  const mostrarResultado = () => {
    setMostrandoResultado(true);
  };

  const reiniciarTeste = () => {
    setTesteAtual(null);
    setPerguntaAtual(0);
    setRespostas([]);
    setMostrandoResultado(false);
  };

  const calcularResultado = () => {
    const pontuacao = respostas.reduce((total, resposta) => total + resposta, 0);
    const maxPontuacao = testeAtual.perguntas.length * 4;
    const percentual = (pontuacao / maxPontuacao) * 100;
    
    let nivel, cor, recomendacao;
    
    if (percentual <= 25) {
      nivel = "Baixo";
      cor = "success";
      recomendacao = "Seus níveis estão dentro do normal. Continue cuidando do seu bem-estar!";
    } else if (percentual <= 50) {
      nivel = "Moderado";
      cor = "warning";
      recomendacao = "Alguns sinais podem indicar a necessidade de atenção. Considere conversar com um profissional.";
    } else if (percentual <= 75) {
      nivel = "Alto";
      cor = "danger";
      recomendacao = "Recomendamos buscar ajuda profissional para melhor avaliação e suporte.";
    } else {
      nivel = "Muito Alto";
      cor = "danger";
      recomendacao = "É importante buscar ajuda profissional o quanto antes. Não hesite em nos contatar.";
    }
    
    return { nivel, cor, recomendacao };
  };

  return (
    <>
      {/* Header */}
      <header className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="fw-bold mb-3">Autoavaliações</h1>
              <p className="lead mb-4">Ferramentas para ajudar a identificar sinais de ansiedade, depressão e outros aspectos da saúde mental.</p>
            </div>
            <div className="col-lg-6">
              <div className="rounded-3 shadow overflow-hidden">
                <div className="bg-primary text-white p-5 text-center">
                  <i className="bi bi-clipboard-check fs-1 mb-3"></i>
                  <h2 className="h4 fw-bold">Conheça melhor seu bem-estar emocional</h2>
                  <p className="mb-0">Questionários validados cientificamente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Avaliações Disponíveis */}
      {!testeAtual && (
        <section className="py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-5">Avaliações Disponíveis</h2>
            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="icon-box mb-3">
                      <i className="bi bi-heart-pulse text-primary fs-1"></i>
                    </div>
                    <h3 className="h5 fw-bold">Teste de Ansiedade</h3>
                    <p>Avalie seus níveis de ansiedade com base em sintomas físicos e emocionais.</p>
                    <button className="btn btn-primary" onClick={() => iniciarTeste('ansiedade')}>Iniciar Teste</button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="icon-box mb-3">
                      <i className="bi bi-cloud-rain text-primary fs-1"></i>
                    </div>
                    <h3 className="h5 fw-bold">Teste de Depressão</h3>
                    <p>Identifique sinais de depressão através de perguntas sobre humor e comportamento.</p>
                    <button className="btn btn-primary" onClick={() => iniciarTeste('depressao')}>Iniciar Teste</button>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="icon-box mb-3">
                      <i className="bi bi-lightning text-primary fs-1"></i>
                    </div>
                    <h3 className="h5 fw-bold">Teste de Estresse</h3>
                    <p>Meça seus níveis de estresse e como ele afeta sua vida diária.</p>
                    <button className="btn btn-primary" onClick={() => iniciarTeste('estresse')}>Iniciar Teste</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Área do Teste */}
      {testeAtual && !mostrandoResultado && (
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow">
                  <div className="card-body p-5">
                    <h3 className="fw-bold mb-4">{testeAtual.titulo}</h3>
                    <div>
                      <p className="lead mb-4">{testeAtual.perguntas[perguntaAtual].texto}</p>
                      <div className="d-grid gap-2">
                        {testeAtual.perguntas[perguntaAtual].opcoes.map((opcao, index) => (
                          <button 
                            key={index}
                            className="btn btn-outline-primary"
                            onClick={() => responder(index)}
                          >
                            {opcao}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <span className="text-muted">Pergunta {perguntaAtual + 1} de {testeAtual.perguntas.length}</span>
                      {perguntaAtual > 0 && (
                        <button className="btn btn-outline-secondary" onClick={voltarPergunta}>Voltar</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Resultado */}
      {mostrandoResultado && (
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow">
                  <div className="card-body p-5 text-center">
                    <i className="bi bi-check-circle text-success fs-1 mb-3"></i>
                    <h3 className="fw-bold mb-4">Resultado da Avaliação</h3>
                    <div>
                      {(() => {
                        const resultado = calcularResultado();
                        return (
                          <>
                            <div className={`alert alert-${resultado.cor} mb-4`}>
                              <h4 className="fw-bold">Nível: {resultado.nivel}</h4>
                              <p className="mb-0">{resultado.recomendacao}</p>
                            </div>
                            <p className="text-muted">
                              <strong>Importante:</strong> Este teste é apenas uma ferramenta de autoavaliação e não substitui 
                              uma avaliação profissional. Para um diagnóstico preciso, consulte um psicólogo ou psiquiatra.
                            </p>
                          </>
                        );
                      })()}
                    </div>
                    <div className="mt-4">
                      <button className="btn btn-primary me-3" onClick={reiniciarTeste}>Fazer Outro Teste</button>
                      <a href="/contato" className="btn btn-outline-primary">Agendar Consulta</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Autoavaliacoes;