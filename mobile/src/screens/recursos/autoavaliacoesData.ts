/**
 * Conteúdo das Autoavaliações — espelho do Autoavaliacoes.jsx do web.
 * Cada teste tem 5 perguntas com escala de 5 opções (0-4 pontos).
 */
export interface Pergunta {
  texto: string;
}

export interface Teste {
  id: 'ansiedade' | 'depressao' | 'estresse';
  titulo: string;
  emoji: string;
  descricao: string;
  perguntas: Pergunta[];
}

export const OPCOES_ESCALA = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'];

export const TESTES: Teste[] = [
  {
    id: 'ansiedade',
    titulo: 'Teste de Ansiedade',
    emoji: '😰',
    descricao: 'Avalie como você tem se sentido nas últimas 2 semanas.',
    perguntas: [
      { texto: 'Com que frequência você se sente nervoso ou ansioso?' },
      { texto: 'Você tem dificuldade para relaxar?' },
      { texto: 'Você se preocupa excessivamente com coisas pequenas?' },
      { texto: 'Você sente sintomas físicos como coração acelerado ou suor?' },
      { texto: 'Você evita situações que podem causar ansiedade?' },
    ],
  },
  {
    id: 'depressao',
    titulo: 'Teste de Depressão',
    emoji: '😔',
    descricao: 'Avalie seu humor e energia nas últimas 2 semanas.',
    perguntas: [
      { texto: 'Com que frequência você se sente triste ou desanimado?' },
      { texto: 'Você perdeu interesse em atividades que antes gostava?' },
      { texto: 'Você tem dificuldade para dormir ou dorme demais?' },
      { texto: 'Você se sente sem energia ou cansado?' },
      { texto: 'Você tem pensamentos negativos sobre si mesmo?' },
    ],
  },
  {
    id: 'estresse',
    titulo: 'Teste de Estresse',
    emoji: '🔥',
    descricao: 'Avalie a carga de tensão que você tem sentido no dia a dia.',
    perguntas: [
      { texto: 'Você se sente sobrecarregado com suas responsabilidades?' },
      { texto: 'Você tem dificuldade para se concentrar?' },
      { texto: 'Você se irrita facilmente com pequenas coisas?' },
      { texto: 'Você sente tensão muscular ou dores de cabeça?' },
      { texto: 'Você tem dificuldade para tomar decisões?' },
    ],
  },
];

export interface Resultado {
  nivel: string;
  cor: 'success' | 'warning' | 'error';
  recomendacao: string;
}

export const calcularResultado = (pontuacao: number): Resultado => {
  // Pontuação mínima 5 (5 perguntas × 0) e máxima 20 (5 × 4)
  if (pontuacao <= 8) {
    return {
      nivel: 'Baixo',
      cor: 'success',
      recomendacao:
        'Seus sintomas parecem estar sob controle no momento. Mantenha hábitos saudáveis e fique atento a mudanças.',
    };
  }
  if (pontuacao <= 14) {
    return {
      nivel: 'Moderado',
      cor: 'warning',
      recomendacao:
        'Você apresenta sintomas que merecem atenção. Considere conversar com um profissional e praticar atividades que te ajudem a relaxar.',
    };
  }
  return {
    nivel: 'Alto',
    cor: 'error',
    recomendacao:
      'Seus sintomas indicam sofrimento significativo. Recomendamos fortemente procurar um psicólogo ou psiquiatra o quanto antes.',
  };
};
