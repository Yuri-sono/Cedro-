/**
 * Conteúdo do Chat de Emergência — espelho do ChatEmergencia.jsx do web.
 * Funcionalidade 100% local (sem backend), com respostas pré-definidas.
 */
export interface OpcaoEmergencia {
  id: string;
  texto: string;
  resposta: string;
}

export const OPCOES_EMERGENCIA: OpcaoEmergencia[] = [
  {
    id: 'ansiedade',
    texto: 'Estou sentindo ansiedade',
    resposta:
      'Entendo que você está sentindo ansiedade. Algumas técnicas que podem ajudar:\n\n' +
      '• Respiração profunda: inspire por 4 segundos, segure por 4, expire por 6\n' +
      '• Técnica 5-4-3-2-1: identifique 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia\n' +
      '• Lembre-se: este sentimento é temporário\n\n' +
      'Se a ansiedade persistir, procure ajuda profissional.',
  },
  {
    id: 'tristeza',
    texto: 'Estou me sentindo triste',
    resposta:
      'Percebo que você está passando por um momento difícil. É importante lembrar:\n\n' +
      '• Você não está sozinho nessa\n' +
      '• Buscar ajuda é um sinal de força, não fraqueza\n' +
      '• Pequenos passos já fazem diferença\n' +
      '• Este momento vai passar\n\n' +
      'Se a tristeza persistir, considere conversar com um profissional.',
  },
  {
    id: 'panico',
    texto: 'Estou tendo um ataque de pânico',
    resposta:
      'Vamos fazer um exercício para te ajudar neste momento:\n\n' +
      '1. RESPIRE: Inspire pelo nariz (4 seg), segure (4 seg), expire pela boca (6 seg)\n' +
      '2. OBSERVE: Olhe ao redor e nomeie 5 objetos que você vê\n' +
      '3. LEMBRE-SE: Isso vai passar, você está seguro\n' +
      '4. REPITA: Continue respirando devagar\n\n' +
      'Se os ataques são frequentes, procure um médico.',
  },
  {
    id: 'insonia',
    texto: 'Não consigo dormir',
    resposta:
      'Problemas de sono são comuns. Algumas dicas que podem ajudar:\n\n' +
      '• Evite telas 1h antes de dormir\n' +
      '• Mantenha o quarto escuro e fresco\n' +
      '• Vá para cama sempre no mesmo horário\n' +
      '• Evite cafeína após 14h\n' +
      '• Pratique relaxamento antes de dormir\n\n' +
      'Se a insônia persistir, consulte um médico.',
  },
  {
    id: 'trabalho',
    texto: 'Problemas no trabalho',
    resposta:
      'O estresse no trabalho é muito comum. Estratégias que podem ajudar:\n\n' +
      '• Defina limites entre trabalho e vida pessoal\n' +
      '• Faça pausas regulares durante o dia\n' +
      '• Priorize tarefas importantes\n' +
      '• Pratique técnicas de relaxamento\n' +
      '• Converse com colegas ou supervisor quando possível\n\n' +
      'Se o estresse for excessivo, considere apoio profissional.',
  },
  {
    id: 'relacionamento',
    texto: 'Problemas de relacionamento',
    resposta:
      'Relacionamentos podem ser desafiadores. Algumas dicas:\n\n' +
      '• Comunique seus sentimentos com clareza\n' +
      '• Ouça ativamente o outro lado\n' +
      '• Estabeleça limites saudáveis\n' +
      '• Lembre-se que relacionamentos envolvem reciprocidade\n' +
      '• Respeite seus próprios valores\n\n' +
      'Se os conflitos persistirem, terapia de casal pode ajudar.',
  },
  {
    id: 'autoestima',
    texto: 'Problemas de autoestima',
    resposta:
      'A autoestima é algo que podemos trabalhar. Lembre-se:\n\n' +
      '• Você é único e tem valor\n' +
      '• Ninguém é perfeito, e está tudo bem\n' +
      '• Liste 3 coisas boas sobre você todo dia\n' +
      '• Trate-se com a mesma gentileza que trataria um amigo\n' +
      '• Celebre pequenas conquistas\n\n' +
      'Se a baixa autoestima afetar muito sua vida, procure ajuda profissional.',
  },
  {
    id: 'emergencia',
    texto: 'Pensamentos de autolesão',
    resposta:
      'ATENÇÃO: Sua vida tem valor e existem pessoas que podem te ajudar neste momento:\n\n' +
      'CVV - 188 (24h, gratuito)\n' +
      'CAPS - Centro de Atenção Psicossocial\n' +
      'UBS - Unidade Básica de Saúde\n' +
      'SAMU - 192\n\n' +
      'Você não precisa passar por isso sozinho. Por favor, ligue para um desses números ou vá ao hospital mais próximo.',
  },
];

export const MENSAGEM_INICIAL =
  'Olá! Sou o assistente virtual do Cedro. Estou aqui para te ajudar. Escolha uma das opções abaixo:';
