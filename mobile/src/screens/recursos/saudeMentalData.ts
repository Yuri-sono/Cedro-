import type { ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

/**
 * Conteúdo do Guia de Saúde Mental — condensado do SaudeMental.jsx do web.
 * Informações baseadas em OMS, APA e Ministério da Saúde.
 */
export interface Tratamento {
  titulo: string;
  desc: string;
}

export interface Transtorno {
  id: string;
  icone: NomeIcone;
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
    icone: 'pulse',
    titulo: 'Transtorno de Ansiedade',
    badge: 'Muito Comum',
    prevalencia: 18.6,
    afetadosBR: '~26 milhões',
    descricao:
      'Os transtornos de ansiedade se caracterizam por apreensão, preocupação e medo excessivos. O Brasil tem a maior taxa do mundo, segundo a OMS. Incluem TAG, ansiedade social e fobias específicas.',
    sintomas: [
      'Preocupação excessiva e constante, difícil de controlar',
      'Inquietação, sensação de estar "no limite"',
      'Tensão muscular, dores de cabeça e fadiga',
      'Sintomas físicos: taquicardia, sudorese, tremores, falta de ar',
      'Evitação de situações que geram ansiedade',
    ],
    tratamentos: [
      {
        titulo: 'Terapia Cognitivo-Comportamental (TCC)',
        desc: 'Considerada padrão-ouro. Ajuda a modificar padrões de pensamento que alimentam a ansiedade.',
      },
      {
        titulo: 'Medicação',
        desc: 'Antidepressivos (ISRS) e ansiolíticos podem ser prescritos por psiquiatras.',
      },
      {
        titulo: 'Técnicas de Relaxamento',
        desc: 'Respiração diafragmática, relaxamento muscular progressivo e mindfulness.',
      },
      {
        titulo: 'Exercícios Físicos',
        desc: 'Atividade física regular libera endorfinas e reduz os níveis de ansiedade.',
      },
    ],
    aviso:
      'Se você sente ansiedade intensa que interfere nas suas atividades há mais de 6 meses, procure ajuda profissional.',
  },
  {
    id: 'depressao',
    icone: 'cloud',
    titulo: 'Depressão',
    badge: 'Comum',
    prevalencia: 10.8,
    afetadosBR: '~16 milhões',
    descricao:
      'A depressão é um transtorno de humor que causa tristeza persistente e perda de interesse. O Brasil é o país da América Latina com maior prevalência.',
    sintomas: [
      'Tristeza persistente, vazio ou desesperança',
      'Perda de interesse em atividades antes prazerosas',
      'Insônia ou sono excessivo (hipersonia)',
      'Fadiga extrema e perda de energia',
      'Sentimentos de inutilidade e culpa excessiva',
      'Pensamentos recorrentes de morte ou suicídio',
    ],
    tratamentos: [
      {
        titulo: 'Psicoterapia',
        desc: 'TCC e Terapia Interpessoal são altamente eficazes. O acompanhamento regular é fundamental.',
      },
      {
        titulo: 'Antidepressivos',
        desc: 'Prescritos por médicos, ajudam a reequilibrar os neurotransmissores do humor.',
      },
      {
        titulo: 'Rotina e Exercícios',
        desc: 'Sono regular, alimentação equilibrada e atividade física auxiliam no tratamento.',
      },
      {
        titulo: 'Rede de Apoio',
        desc: 'Conexões sociais e grupos de apoio reduzem o isolamento típico da depressão.',
      },
    ],
    aviso:
      'Se você tem pensamentos de autolesão, ligue 188 (CVV) imediatamente — apoio 24h, gratuito.',
  },
  {
    id: 'tdah',
    icone: 'flash',
    titulo: 'TDAH',
    badge: 'Comum',
    prevalencia: 5.2,
    afetadosBR: '~2 milhões de adultos',
    descricao:
      'O Transtorno de Déficit de Atenção e Hiperatividade afeta a capacidade de foco, organização e controle de impulsos, tanto em crianças quanto em adultos.',
    sintomas: [
      'Dificuldade de manter o foco em tarefas',
      'Desorganização e esquecimentos frequentes',
      'Inquietação e dificuldade de ficar parado',
      'Impulsividade e interrupções nas conversas',
      'Procrastinação e dificuldade de concluir tarefas',
    ],
    tratamentos: [
      {
        titulo: 'Psicoeducação',
        desc: 'Entender o transtorno é o primeiro passo para gerenciar seus impactos.',
      },
      {
        titulo: 'Medicação',
        desc: 'Estimulantes e não-estimulantes têm alta eficácia quando prescritos por médicos.',
      },
      {
        titulo: 'Terapia Comportamental',
        desc: 'Estratégias de organização, rotina e manejo de impulsos.',
      },
      {
        titulo: 'Adaptações no Dia a Dia',
        desc: 'Ambientes estruturados, lembretes e divisão de tarefas em etapas pequenas.',
      },
    ],
    aviso:
      'O diagnóstico do TDAH deve sempre ser feito por profissional capacitado (psicólogo ou psiquiatra).',
  },
  {
    id: 'burnout',
    icone: 'flame',
    titulo: 'Síndrome de Burnout',
    badge: 'Crescente',
    prevalencia: 4.5,
    afetadosBR: '~30% dos trabalhadores',
    descricao:
      'Esgotamento profissional causado por estresse crônico no trabalho, reconhecido pela OMS como fenômeno ocupacional.',
    sintomas: [
      'Exaustão física e emocional constante',
      'Distanciamento e cinismo em relação ao trabalho',
      'Sensação de ineficácia e baixa realização',
      'Dificuldade de concentração',
      'Problemas de sono e dores físicas',
    ],
    tratamentos: [
      {
        titulo: 'Pausas e Limites',
        desc: 'Estabelecer fronteiras claras entre trabalho e vida pessoal.',
      },
      {
        titulo: 'Psicoterapia',
        desc: 'Ajuda a identificar gatilhos e reestruturar a relação com o trabalho.',
      },
      {
        titulo: 'Descanso Real',
        desc: 'Férias, afastamentos e momentos de lazer sem culpa.',
      },
      {
        titulo: 'Mudanças Organizacionais',
        desc: 'Negociar carga de trabalho e buscar ambientes mais saudáveis.',
      },
    ],
    aviso:
      'Burnout severo pode exigir afastamento médico. Converse com um profissional de saúde.',
  },
  {
    id: 'panico',
    icone: 'alert-circle',
    titulo: 'Síndrome do Pânico',
    badge: 'Tratável',
    prevalencia: 2.5,
    afetadosBR: '~4 milhões',
    descricao:
      'Crises súbitas e intensas de medo com sintomas físicos avassaladores, gerando um ciclo de ansiedade antecipatória.',
    sintomas: [
      'Palpitações e taquicardia súbitas',
      'Sensação de falta de ar ou sufocamento',
      'Tremores e sudorese intensos',
      'Medo de perder o controle ou "enlouquecer"',
      'Medo antecipatório de novas crises',
    ],
    tratamentos: [
      {
        titulo: 'TCC',
        desc: 'Tratamento de escolha: quebra o ciclo do pânico ao modificar interpretações catastróficas.',
      },
      {
        titulo: 'Respiração Controlada',
        desc: 'Técnicas aprendidas em terapia ajudam a interromper as crises.',
      },
      {
        titulo: 'Medicação',
        desc: 'ISRS e ansiolíticos podem reduzir a frequência e intensidade das crises.',
      },
      {
        titulo: 'Exposição Gradual',
        desc: 'Enfrentar progressivamente situações evitadas reduz o medo antecipatório.',
      },
    ],
    aviso:
      'Durante uma crise, lembre-se: ela dura alguns minutos e não é fatal. Se for a primeira vez, busque atendimento médico.',
  },
];
