import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/saude-mental.css';

const conditions = [
  {
    id: 'ansiedade',
    title: 'Transtorno de Ansiedade',
    shortDesc: 'A ansiedade é uma resposta natural do corpo, mas quando se torna excessiva e persistente, pode afetar profundamente a qualidade de vida.',
    image: '/images/ansiedade.png',
    badgeColor: 'rgba(255, 193, 7, 0.85)',
    badgeText: 'Muito Comum',
    prevalence: 18.6,
    affectedBR: '~26 milhões',
    description: 'Os transtornos de ansiedade são um grupo de condições caracterizadas por sentimentos excessivos de apreensão, preocupação e medo. O Brasil é o país com a maior taxa de transtornos de ansiedade do mundo, segundo a OMS. Existem diversos tipos, incluindo Transtorno de Ansiedade Generalizada (TAG), Transtorno de Ansiedade Social e Fobias Específicas.',
    symptoms: [
      'Preocupação excessiva e constante, difícil de controlar',
      'Inquietação, sensação de estar "no limite"',
      'Tensão muscular, dores de cabeça e fadiga',
      'Dificuldade de concentração e mente em branco',
      'Irritabilidade e alterações no sono',
      'Sintomas físicos: taquicardia, sudorese, tremores, falta de ar',
      'Evitação de situações que geram ansiedade'
    ],
    treatments: [
      { icon: 'bi-chat-heart', title: 'Terapia Cognitivo-Comportamental (TCC)', desc: 'Considerada padrão-ouro. Ajuda a identificar e modificar padrões de pensamento disfuncionais que alimentam a ansiedade.', color: '#198754' },
      { icon: 'bi-capsule', title: 'Medicação', desc: 'Antidepressivos (ISRS) e ansiolíticos podem ser prescritos por psiquiatras para casos moderados a graves.', color: '#0d6efd' },
      { icon: 'bi-lungs', title: 'Técnicas de Relaxamento', desc: 'Respiração diafragmática, relaxamento muscular progressivo e mindfulness são eficazes para controlar crises.', color: '#6f42c1' },
      { icon: 'bi-heart-pulse', title: 'Exercícios Físicos', desc: 'Atividade física regular libera endorfinas e reduz significativamente os níveis de ansiedade.', color: '#e83e8c' }
    ],
    warning: 'Se você sente ansiedade intensa que interfere nas suas atividades diárias por mais de 6 meses, procure ajuda profissional.'
  },
  {
    id: 'depressao',
    title: 'Depressão',
    shortDesc: 'Mais do que tristeza, a depressão é um transtorno que afeta o humor, pensamentos e funções corporais, impactando todos os aspectos da vida.',
    image: '/images/depressao.png',
    badgeColor: 'rgba(13, 110, 253, 0.85)',
    badgeText: 'Comum',
    prevalence: 10.8,
    affectedBR: '~16 milhões',
    description: 'A depressão é um transtorno de humor que causa um sentimento persistente de tristeza e perda de interesse. Ela afeta como você sente, pensa e lida com atividades diárias como dormir, comer ou trabalhar. O Brasil é o país da América Latina com maior prevalência de depressão.',
    symptoms: [
      'Tristeza persistente, vazio ou desesperança',
      'Perda de interesse em atividades antes prazerosas',
      'Alterações no apetite e peso (ganho ou perda)',
      'Insônia ou sono excessivo (hipersonia)',
      'Fadiga extrema e perda de energia',
      'Sentimentos de inutilidade e culpa excessiva',
      'Dificuldade de concentração e tomada de decisões',
      'Pensamentos recorrentes de morte ou suicídio'
    ],
    treatments: [
      { icon: 'bi-chat-heart', title: 'Psicoterapia', desc: 'TCC e Terapia Interpessoal são altamente eficazes. O acompanhamento regular com psicólogo é fundamental.', color: '#198754' },
      { icon: 'bi-capsule', title: 'Antidepressivos', desc: 'Medicamentos como ISRS, IRSN podem corrigir desequilíbrios químicos cerebrais. Prescrição exclusiva de psiquiatra.', color: '#0d6efd' },
      { icon: 'bi-sun', title: 'Mudanças no Estilo de Vida', desc: 'Exercícios regulares, alimentação balanceada, sono adequado e exposição solar são complementos essenciais.', color: '#fd7e14' },
      { icon: 'bi-people', title: 'Rede de Apoio', desc: 'Manter vínculos sociais, participar de grupos de apoio e buscar acolhimento familiar fazem parte do tratamento.', color: '#e83e8c' }
    ],
    warning: 'Se você ou alguém que conhece apresenta pensamentos suicidas, ligue imediatamente para o CVV: 188 (24 horas).'
  },
  {
    id: 'tdah',
    title: 'TDAH',
    shortDesc: 'O Transtorno de Déficit de Atenção e Hiperatividade afeta a capacidade de foco, organização e controle de impulsos, tanto em crianças como adultos.',
    image: '/images/tdah.png',
    badgeColor: 'rgba(111, 66, 193, 0.85)',
    badgeText: 'Frequente',
    prevalence: 7.6,
    affectedBR: '~11 milhões',
    description: 'O TDAH é um transtorno do neurodesenvolvimento que afeta cerca de 5-8% das crianças e 2-5% dos adultos. Caracteriza-se por padrões persistentes de desatenção, hiperatividade e impulsividade. Não é falta de inteligência nem preguiça — é uma diferença na forma como o cérebro funciona.',
    symptoms: [
      'Dificuldade em manter atenção em tarefas ou conversas',
      'Erros por descuido em atividades do dia a dia',
      'Dificuldade de organização e gestão do tempo',
      'Tendência a procrastinar e deixar tarefas inacabadas',
      'Inquietação física, dificuldade de ficar parado',
      'Impulsividade nas decisões e interrupção de outros',
      'Hiperfoco em atividades de interesse intenso',
      'Esquecimento frequente de compromissos e objetos'
    ],
    treatments: [
      { icon: 'bi-capsule', title: 'Medicação Estimulante', desc: 'Metilfenidato e anfetaminas melhoram a concentração ao regular neurotransmissores. Acompanhamento médico obrigatório.', color: '#6f42c1' },
      { icon: 'bi-chat-heart', title: 'Terapia Comportamental', desc: 'TCC adaptada para TDAH ajuda a desenvolver estratégias de organização, planejamento e controle emocional.', color: '#198754' },
      { icon: 'bi-journal-check', title: 'Técnicas de Organização', desc: 'Uso de agendas, listas, alarmes, técnica Pomodoro e ambientes estruturados ajudam na rotina diária.', color: '#fd7e14' },
      { icon: 'bi-heart-pulse', title: 'Exercício e Alimentação', desc: 'Atividade física regular e dieta balanceada (rica em ômega-3) auxiliam na regulação da atenção.', color: '#e83e8c' }
    ],
    warning: 'O TDAH é um transtorno real e tratável. Não o confunda com falta de esforço. Busque avaliação com neurologista ou psiquiatra.'
  },
  {
    id: 'bipolar',
    title: 'Transtorno Bipolar',
    shortDesc: 'Caracterizado por oscilações extremas de humor — episódios de mania (euforia intensa) alternando com depressão profunda.',
    image: '/images/bipolar.png',
    badgeColor: 'rgba(232, 62, 140, 0.85)',
    badgeText: 'Sério',
    prevalence: 4.4,
    affectedBR: '~6 milhões',
    description: 'O transtorno bipolar é uma condição crônica que causa mudanças dramáticas no humor, energia e capacidade funcional. Existem dois tipos principais: Tipo I (com episódios maníacos completos) e Tipo II (com episódios hipomaníacos e depressão mais frequente). É uma das principais causas de incapacidade no mundo.',
    symptoms: [
      'Episódios de humor excessivamente elevado ou irritável (mania)',
      'Redução da necessidade de sono sem sentir cansaço',
      'Pensamentos acelerados e fala rápida',
      'Comportamentos impulsivos e de risco (gastos excessivos, decisões precipitadas)',
      'Grandiosidade e autoestima inflada durante mania',
      'Alternância com episódios depressivos profundos',
      'Dificuldade de manter relacionamentos estáveis'
    ],
    treatments: [
      { icon: 'bi-capsule', title: 'Estabilizadores de Humor', desc: 'Lítio e ácido valproico são a base do tratamento. Mantêm o equilíbrio entre episódios maníacos e depressivos.', color: '#e83e8c' },
      { icon: 'bi-chat-heart', title: 'Psicoterapia Especializada', desc: 'Terapia focada em psicoeducação, regulação de ritmo social e prevenção de recaídas é fundamental.', color: '#198754' },
      { icon: 'bi-clock-history', title: 'Rotina Estruturada', desc: 'Manter horários regulares de sono, alimentação e atividades ajuda a prevenir episódios.', color: '#0d6efd' },
      { icon: 'bi-shield-check', title: 'Monitoramento Contínuo', desc: 'Acompanhamento psiquiátrico regular e ajuste de medicação são essenciais para estabilidade a longo prazo.', color: '#6f42c1' }
    ],
    warning: 'O transtorno bipolar requer tratamento contínuo. Nunca interrompa a medicação por conta própria.'
  },
  {
    id: 'burnout',
    title: 'Síndrome de Burnout',
    shortDesc: 'Esgotamento profissional causado por estresse crônico no trabalho, reconhecido pela OMS como um fenômeno ocupacional.',
    image: '/images/burnout.png',
    badgeColor: 'rgba(253, 126, 20, 0.85)',
    badgeText: 'Em Alta',
    prevalence: 15.0,
    affectedBR: '~30 milhões',
    description: 'A Síndrome de Burnout é um estado de esgotamento físico, emocional e mental causado por envolvimento prolongado em situações de trabalho emocionalmente exigentes. Foi oficialmente incluída na CID-11 pela OMS em 2022. O Brasil está entre os países com maiores índices.',
    symptoms: [
      'Exaustão física e emocional constante',
      'Cinismo e distanciamento emocional do trabalho',
      'Redução da realização e eficácia profissional',
      'Sensação de incompetência e falta de produtividade',
      'Dores de cabeça, insônia e problemas gastrointestinais',
      'Isolamento social e irritabilidade',
      'Dificuldade de concentração e lapsos de memória'
    ],
    treatments: [
      { icon: 'bi-door-open', title: 'Reestruturação do Trabalho', desc: 'Estabelecer limites claros, delegar tarefas e renegociar demandas são os primeiros passos essenciais.', color: '#fd7e14' },
      { icon: 'bi-chat-heart', title: 'Acompanhamento Psicológico', desc: 'Terapia ajuda a processar o esgotamento, desenvolver resiliência e restabelecer limites saudáveis.', color: '#198754' },
      { icon: 'bi-calendar-heart', title: 'Autocuidado', desc: 'Férias, hobbies, desconexão digital e atividades prazerosas são fundamentais para a recuperação.', color: '#e83e8c' },
      { icon: 'bi-lungs', title: 'Práticas de Bem-Estar', desc: 'Meditação, yoga, exercícios físicos e técnicas de respiração auxiliam na regulação do estresse.', color: '#6f42c1' }
    ],
    warning: 'Se você se sente esgotado há semanas e não consegue se recuperar com descanso, procure um profissional de saúde mental.'
  },
  {
    id: 'panico',
    title: 'Síndrome do Pânico',
    shortDesc: 'Crises súbitas e intensas de medo com sintomas físicos avassaladores, gerando um ciclo de ansiedade antecipatória.',
    image: '/images/panico.png',
    badgeColor: 'rgba(220, 53, 69, 0.85)',
    badgeText: 'Incapacitante',
    prevalence: 3.5,
    affectedBR: '~5 milhões',
    description: 'O transtorno do pânico é caracterizado por ataques de pânico recorrentes e inesperados — surtos abruptos de medo intenso que atingem um pico em minutos. A pessoa frequentemente desenvolve medo de ter novas crises, o que pode levar à fobia de espaços abertos ou à evitação de locais e situações.',
    symptoms: [
      'Ataques súbitos de medo intenso e terror',
      'Taquicardia, palpitações e dor no peito',
      'Falta de ar e sensação de sufocamento',
      'Tontura, náusea e formigamento',
      'Sensação de irrealidade ou despersonalização',
      'Medo de morrer, "enlouquecer" ou perder o controle',
      'Evitação de locais onde já ocorreram crises'
    ],
    treatments: [
      { icon: 'bi-chat-heart', title: 'TCC com Exposição', desc: 'Exposição gradual às sensações temidas (interoceptiva) é o tratamento mais eficaz para eliminar crises.', color: '#198754' },
      { icon: 'bi-capsule', title: 'Medicação', desc: 'Antidepressivos ISRS tratam a raiz do transtorno. Benzodiazepínicos podem ser usados pontualmente em crises.', color: '#0d6efd' },
      { icon: 'bi-lungs', title: 'Técnicas de Respiração', desc: 'Respiração 4-7-8 e respiração diafragmática interrompem o ciclo fisiológico do pânico durante uma crise.', color: '#6f42c1' },
      { icon: 'bi-book', title: 'Psicoeducação', desc: 'Entender que as crises de pânico não são perigosas é parte fundamental do tratamento e reduz a ansiedade antecipatória.', color: '#fd7e14' }
    ],
    warning: 'Ataques de pânico imitam infartos. Se for a primeira vez, vá ao pronto-socorro para descartar causas cardíacas.'
  }
];

const ConditionCard = ({ condition, onClick, isActive }) => (
  <div className="col-md-6 col-lg-4 sm-fade-in">
    <div
      className={`sm-condition-card h-100 ${isActive ? 'border border-2 border-success' : ''}`}
      onClick={() => onClick(condition.id)}
      role="button"
      tabIndex={0}
      id={`card-${condition.id}`}
    >
      <div className="sm-card-img-wrapper">
        <img src={condition.image} alt={condition.title} loading="lazy" />
        <div className="sm-card-img-overlay" />
        <span className="sm-card-badge" style={{ background: condition.badgeColor, color: '#fff' }}>
          {condition.badgeText}
        </span>
      </div>
      <div className="sm-card-body">
        <h3>{condition.title}</h3>
        <p>{condition.shortDesc}</p>
        <div className="sm-card-stats">
          <span className="sm-stat">
            <i className="bi bi-people-fill text-success"></i>{condition.affectedBR}
          </span>
          <span className="sm-stat">
            <i className="bi bi-graph-up text-info"></i>{condition.prevalence}%
          </span>
        </div>
        <button className="btn btn-sm btn-outline-success rounded-pill w-100 fw-bold">
          <i className="bi bi-arrow-down-circle me-1"></i>
          {isActive ? 'Fechar detalhes' : 'Ver detalhes e tratamentos'}
        </button>
      </div>
    </div>
  </div>
);

const ConditionDetail = ({ condition }) => (
  <div className="sm-detail-section" id={`detail-${condition.id}`}>
    <div className="sm-detail-hero">
      <img src={condition.image} alt={condition.title} />
      <div className="sm-detail-hero-overlay">
        <div>
          <span className="badge rounded-pill mb-2" style={{ background: condition.badgeColor, fontSize: '0.8rem' }}>
            {condition.badgeText}
          </span>
          <h2 className="fw-bold text-white mb-0 display-6">{condition.title}</h2>
        </div>
      </div>
    </div>

    <div className="sm-detail-content">
      {/* Description */}
      <p className="lead mb-4" style={{ lineHeight: '1.8' }}>{condition.description}</p>

      {/* Prevalence */}
      <div className="mb-4 p-3 rounded-3" style={{ background: 'var(--bg-secondary)' }}>
        <small className="text-muted fw-bold text-uppercase">Prevalência no Brasil</small>
        <div className="sm-prevalence mt-2">
          <sm className="sm-prevalence-label">{condition.prevalence}%</sm>
          <div className="sm-prevalence-bar">
            <div className="sm-prevalence-fill" style={{ width: `${Math.min(condition.prevalence * 3.5, 100)}%` }} />
          </div>
          <span className="sm-prevalence-label">{condition.affectedBR}</span>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Symptoms */}
        <div className="col-lg-6">
          <h4 className="fw-bold mb-3">
            <i className="bi bi-list-check text-danger me-2"></i>Sintomas Principais
          </h4>
          <ul className="sm-symptom-list">
            {condition.symptoms.map((s, i) => (
              <li key={i}>
                <span className="sm-symptom-icon" style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545' }}>
                  <i className="bi bi-exclamation-circle-fill"></i>
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Treatments */}
        <div className="col-lg-6">
          <h4 className="fw-bold mb-3">
            <i className="bi bi-heart-pulse text-success me-2"></i>Tratamentos Recomendados
          </h4>
          <div className="row g-3">
            {condition.treatments.map((t, i) => (
              <div key={i} className="col-sm-6">
                <div className="sm-treatment-card">
                  <div className="sm-treatment-icon" style={{ background: `${t.color}18`, color: t.color }}>
                    <i className={`bi ${t.icon}`}></i>
                  </div>
                  <h5>{t.title}</h5>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="sm-info-box warning">
        <h5><i className="bi bi-exclamation-triangle-fill text-warning"></i>Atenção</h5>
        <p>{condition.warning}</p>
      </div>

      <div className="sm-info-box success">
        <h5><i className="bi bi-check-circle-fill text-success"></i>Lembre-se</h5>
        <p>Cada pessoa é única e o tratamento deve ser personalizado. Procure um profissional qualificado para receber o diagnóstico correto e o plano de tratamento adequado para o seu caso.</p>
      </div>
    </div>
  </div>
);

const SaudeMental = () => {
  const [activeCondition, setActiveCondition] = useState(null);
  const detailRef = useRef(null);

  const handleCardClick = (id) => {
    if (activeCondition === id) {
      setActiveCondition(null);
    } else {
      setActiveCondition(id);
      setTimeout(() => {
        const el = document.getElementById(`detail-${id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.sm-fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCondition]);

  const activeData = conditions.find(c => c.id === activeCondition);

  return (
    <>
      {/* Hero */}
      <section className="sm-hero text-white">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 mb-4 mb-lg-0">
              <span className="badge bg-white bg-opacity-10 rounded-pill px-3 py-2 mb-3 fw-normal" style={{ backdropFilter: 'blur(10px)' }}>
                <i className="bi bi-book me-1"></i> Guia Informativo Cedro
              </span>
              <h1 className="display-4 fw-bold mb-3">Entendendo a<br /><span style={{ color: '#20c997' }}>Saúde Mental</span></h1>
              <p className="lead mb-4 opacity-75" style={{ maxWidth: '520px' }}>
                Conheça os principais transtornos mentais, seus sintomas, e os tratamentos mais eficazes recomendados por especialistas.
              </p>
              <div className="sm-quick-nav">
                {conditions.map(c => (
                  <a key={c.id} href={`#card-${c.id}`} className={`sm-pill ${activeCondition === c.id ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); handleCardClick(c.id); }}>
                    {c.title.split(' ').slice(-1)[0]}
                  </a>
                ))}
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <img src="/images/saude-mental-hero.png" alt="Saúde Mental" className="sm-hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="py-5" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="text-center mb-5 sm-fade-in">
            <h2 className="fw-bold mb-3">Transtornos mais comuns</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Clique em cada card para explorar informações detalhadas sobre sintomas, causas e os melhores tratamentos disponíveis.
            </p>
          </div>

          <div className="row g-4 mb-5">
            {conditions.map(c => (
              <ConditionCard key={c.id} condition={c} onClick={handleCardClick} isActive={activeCondition === c.id} />
            ))}
          </div>

          {/* Expanded Detail */}
          {activeData && <ConditionDetail condition={activeData} />}
        </div>
      </section>

      {/* CTA */}
      <section className="py-5" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="sm-cta text-white text-center">
            <div className="position-relative" style={{ zIndex: 2 }}>
              <i className="bi bi-heart-pulse-fill fs-1 mb-3 d-block" style={{ color: '#20c997' }}></i>
              <h2 className="fw-bold mb-3">Precisa de ajuda profissional?</h2>
              <p className="lead mb-4 mx-auto opacity-75" style={{ maxWidth: '550px' }}>
                O primeiro passo é o mais importante. Nossa equipe de psicólogos está pronta para te acolher.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/psicologos" className="btn btn-light btn-lg fw-bold rounded-pill px-4">
                  <i className="bi bi-people me-2"></i>Encontrar Psicólogo
                </Link>
                <a href="tel:188" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  <i className="bi bi-telephone me-2"></i>CVV: 188
                </a>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-4">
            <div className="col-md-4 sm-fade-in">
              <div className="sm-info-box info">
                <h5><i className="bi bi-info-circle-fill text-info"></i>Disclaimer</h5>
                <p>Este conteúdo é informativo e não substitui diagnóstico ou tratamento profissional. Consulte sempre um profissional de saúde mental.</p>
              </div>
            </div>
            <div className="col-md-4 sm-fade-in">
              <div className="sm-info-box success">
                <h5><i className="bi bi-shield-check text-success"></i>Fontes</h5>
                <p>Informações baseadas em dados da OMS, APA (American Psychiatric Association) e Ministério da Saúde do Brasil.</p>
              </div>
            </div>
            <div className="col-md-4 sm-fade-in">
              <div className="sm-info-box warning">
                <h5><i className="bi bi-telephone-fill text-warning"></i>Emergência</h5>
                <p>Em caso de crise, ligue 188 (CVV), 192 (SAMU) ou vá ao pronto-socorro mais próximo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SaudeMental;
