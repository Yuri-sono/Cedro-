/**
 * Conte�do do Guia de Sa�de Mental � condensado do SaudeMental.jsx do web.
 * Informa��es baseadas em OMS, APA e Minist�rio da Sa�de.
 */
export interface Tratamento {
  titulo: string;
  desc: string;
}

export interface Transtorno {
  id: string;
  emoji: string;
  titulo: string;
  badge: string;
  prevalencia: number;
  afetadosBR: string;
  descricao: string;
  sintomas: string[];
  tratamentos: Tratamento[];
  aviso: string;
}

export const TRANSTORNOS: Transtorno[] = [
  {
    id: 'ansiedade',
    emoji: '??',
    titulo: 'Transtorno de Ansiedade',
    badge: 'Muito Comum',
    prevalencia: 18.6,
    afetadosBR: '~26 milh�es',
    descricao:
      'Os transtornos de ansiedade se caracterizam por apreens�o, preocupa��o e medo excessivos. O Brasil tem a maior taxa do mundo, segundo a OMS. Incluem TAG, ansiedade social e fobias espec�ficas.',
    sintomas: [
      'Preocupa��o excessiva e constante, dif�cil de controlar',
      'Inquieta��o, sensa��o de estar "no limite"',
      'Tens�o muscular, dores de cabe�a e fadiga',
      'Sintomas f�sicos: taquicardia, sudorese, tremores, falta de ar',
      'Evita��o de situa��es que geram ansiedade',
    ],
    tratamentos: [
      {
        titulo: 'Terapia Cognitivo-Comportamental (TCC)',
        desc: 'Considerada padr�o-ouro. Ajuda a modificar padr�es de pensamento que alimentam a ansiedade.',
      },
      {
        titulo: 'Medica��o',
        desc: 'Antidepressivos (ISRS) e ansiol�ticos podem ser prescritos por psiquiatras.',
      },
      {
        titulo: 'T�cnicas de Relaxamento',
        desc: 'Respira��o diafragm�tica, relaxamento muscular progressivo e mindfulness.',
      },
      {
        titulo: 'Exerc�cios F�sicos',
        desc: 'Atividade f�sica regular libera endorfinas e reduz os n�veis de ansiedade.',
      },
    ],
    aviso:
      'Se voc� sente ansiedade intensa que interfere nas suas atividades h� mais de 6 meses, procure ajuda profissional.',
  },
  {
    id: 'depressao',
    emoji: '??',
    titulo: 'Depress�o',
    badge: 'Comum',
    prevalencia: 10.8,
    afetadosBR: '~16 milh�es',
    descricao:
      'A depress�o � um transtorno de humor que causa tristeza persistente e perda de interesse. O Brasil � o pa�s da Am�rica Latina com maior preval�ncia.',
    sintomas: [
      'Tristeza persistente, vazio ou desesperan�a',
      'Perda de interesse em atividades antes prazerosas',
      'Ins�nia ou sono excessivo (hipersonia)',
      'Fadiga extrema e perda de energia',
      'Sentimentos de inutilidade e culpa excessiva',
      'Pensamentos recorrentes de morte ou suic�dio',
    ],
    tratamentos: [
      {
        titulo: 'Psicoterapia',
        desc: 'TCC e Terapia Interpessoal s�o altamente eficazes. O acompanhamento regular � fundamental.',
      },
      {
        titulo: 'Antidepressivos',
        desc: 'Prescritos por m�dicos, ajudam a reequilibrar os neurotransmissores do humor.',
      },
      {
        titulo: 'Rotina e Exerc�cios',
        desc: 'Sono regular, alimenta��o equilibrada e atividade f�sica auxiliam no tratamento.',
      },
      {
        titulo: 'Rede de Apoio',
        desc: 'Conex�es sociais e grupos de apoio reduzem o isolamento t�pico da depress�o.',
      },
    ],
    aviso:
      'Se voc� tem pensamentos de autoles�o, ligue 188 (CVV) imediatamente � apoio 24h, gratuito.',
  },
  {
    id: 'tdah',
    emoji: '?',
    titulo: 'TDAH',
    badge: 'Comum',
    prevalencia: 5.2,
    afetadosBR: '~2 milh�es de adultos',
    descricao:
      'O Transtorno de D�ficit de Aten��o e Hiperatividade afeta a capacidade de foco, organiza��o e controle de impulsos, tanto em crian�as quanto em adultos.',
    sintomas: [
      'Dificuldade de manter o foco em tarefas',
      'Desorganiza��o e esquecimentos frequentes',
      'Inquieta��o e dificuldade de ficar parado',
      'Impulsividade e interrup��es nas conversas',
      'Procrastina��o e dificuldade de concluir tarefas',
    ],
    tratamentos: [
      {
        titulo: 'Psicoeduca��o',
        desc: 'Entender o transtorno � o primeiro passo para gerenciar seus impactos.',
      },
      {
        titulo: 'Medica��o',
        desc: 'Estimulantes e n�o-estimulantes t�m alta efic�cia quando prescritos por m�dicos.',
      },
      {
        titulo: 'Terapia Comportamental',
        desc: 'Estrat�gias de organiza��o, rotina e manejo de impulsos.',
      },
      {
        titulo: 'Adapta��es no Dia a Dia',
        desc: 'Ambientes estruturados, lembretes e divis�o de tarefas em etapas pequenas.',
      },
    ],
    aviso:
      'O diagn�stico do TDAH deve sempre ser feito por profissional capacitado (psic�logo ou psiquiatra).',
  },
  {
    id: 'burnout',
    emoji: '??',
    titulo: 'S�ndrome de Burnout',
    badge: 'Crescente',
    prevalencia: 4.5,
    afetadosBR: '~30% dos trabalhadores',
    descricao:
      'Esgotamento profissional causado por estresse cr�nico no trabalho, reconhecido pela OMS como fen�meno ocupacional.',
    sintomas: [
      'Exaust�o f�sica e emocional constante',
      'Distanciamento e cinismo em rela��o ao trabalho',
      'Sensa��o de inefic�cia e baixa realiza��o',
      'Dificuldade de concentra��o',
      'Problemas de sono e dores f�sicas',
    ],
    tratamentos: [
      {
        titulo: 'Pausas e Limites',
        desc: 'Estabelecer fronteiras claras entre trabalho e vida pessoal.',
      },
      {
        titulo: 'Psicoterapia',
        desc: 'Ajuda a identificar gatilhos e reestruturar a rela��o com o trabalho.',
      },
      {
        titulo: 'Descanso Real',
        desc: 'F�rias, afastamentos e momentos de lazer sem culpa.',
      },
      {
        titulo: 'Mudan�as Organizacionais',
        desc: 'Negociar carga de trabalho e buscar ambientes mais saud�veis.',
      },
    ],
    aviso:
      'Burnout severo pode exigir afastamento m�dico. Converse com um profissional de sa�de.',
  },
  {
    id: 'panico',
    emoji: '??',
    titulo: 'S�ndrome do P�nico',
    badge: 'Trat�vel',
    prevalencia: 2.5,
    afetadosBR: '~4 milh�es',
    descricao:
      'Crises s�bitas e intensas de medo com sintomas f�sicos avassaladores, gerando um ciclo de ansiedade antecipat�ria.',
    sintomas: [
      'Palpita��es e taquicardia s�bitas',
      'Sensa��o de falta de ar ou sufocamento',
      'Tremores e sudorese intensos',
      'Medo de perder o controle ou "enlouquecer"',
      'Medo antecipat�rio de novas crises',
    ],
    tratamentos: [
      {
        titulo: 'TCC',
        desc: 'Tratamento de escolha: quebra o ciclo do p�nico ao modificar interpreta��es catastr�ficas.',
      },
      {
        titulo: 'Respira��o Controlada',
        desc: 'T�cnicas aprendidas em terapia ajudam a interromper as crises.',
      },
      {
        titulo: 'Medica��o',
        desc: 'ISRS e ansiol�ticos podem reduzir a frequ�ncia e intensidade das crises.',
      },
      {
        titulo: 'Exposi��o Gradual',
        desc: 'Enfrentar progressivamente situa��es evitadas reduz o medo antecipat�rio.',
      },
    ],
    aviso:
      'Durante uma crise, lembre-se: ela dura alguns minutos e n�o � fatal. Se for a primeira vez, busque atendimento m�dico.',
  },
];
