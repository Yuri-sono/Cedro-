/**
 * Conte�do do Chat de Emerg�ncia � espelho do ChatEmergencia.jsx do web.
 * Funcionalidade 100% local (sem backend), com respostas pr�-definidas.
 */
export interface OpcaoEmergencia {
  id: string;
  emoji: string;
  texto: string;
  resposta: string;
}

export const OPCOES_EMERGENCIA: OpcaoEmergencia[] = [
  {
    id: 'ansiedade',
    emoji: '??',
    texto: 'Estou sentindo ansiedade',
    resposta:
      'Entendo que voc� est� sentindo ansiedade. Algumas t�cnicas que podem ajudar:\n\n' +
      '� Respira��o profunda: inspire por 4 segundos, segure por 4, expire por 6\n' +
      '� T�cnica 5-4-3-2-1: identifique 5 coisas que v�, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia\n' +
      '� Lembre-se: este sentimento � tempor�rio\n\n' +
      'Se a ansiedade persistir, procure ajuda profissional.',
  },
  {
    id: 'tristeza',
    emoji: '??',
    texto: 'Estou me sentindo triste',
    resposta:
      'Percebo que voc� est� passando por um momento dif�cil. � importante lembrar:\n\n' +
      '� Voc� n�o est� sozinho nessa\n' +
      '� Buscar ajuda � um sinal de for�a, n�o fraqueza\n' +
      '� Pequenos passos j� fazem diferen�a\n' +
      '� Este momento vai passar\n\n' +
      'Se a tristeza persistir, considere conversar com um profissional.',
  },
  {
    id: 'panico',
    emoji: '??',
    texto: 'Estou tendo um ataque de p�nico',
    resposta:
      'Vamos fazer um exerc�cio para te ajudar neste momento:\n\n' +
      '1. RESPIRE: Inspire pelo nariz (4 seg), segure (4 seg), expire pela boca (6 seg)\n' +
      '2. OBSERVE: Olhe ao redor e nomeie 5 objetos que voc� v�\n' +
      '3. LEMBRE-SE: Isso vai passar, voc� est� seguro\n' +
      '4. REPITA: Continue respirando devagar\n\n' +
      'Se os ataques s�o frequentes, procure um m�dico.',
  },
  {
    id: 'insonia',
    emoji: '??',
    texto: 'N�o consigo dormir',
    resposta:
      'Problemas de sono s�o comuns. Algumas dicas que podem ajudar:\n\n' +
      '� Evite telas 1h antes de dormir\n' +
      '� Mantenha o quarto escuro e fresco\n' +
      '� V� para cama sempre no mesmo hor�rio\n' +
      '� Evite cafe�na ap�s 14h\n' +
      '� Pratique relaxamento antes de dormir\n\n' +
      'Se a ins�nia persistir, consulte um m�dico.',
  },
  {
    id: 'trabalho',
    emoji: '??',
    texto: 'Problemas no trabalho',
    resposta:
      'O estresse no trabalho � muito comum. Estrat�gias que podem ajudar:\n\n' +
      '� Defina limites entre trabalho e vida pessoal\n' +
      '� Fa�a pausas regulares durante o dia\n' +
      '� Priorize tarefas importantes\n' +
      '� Pratique t�cnicas de relaxamento\n' +
      '� Converse com colegas ou supervisor quando poss�vel\n\n' +
      'Se o estresse for excessivo, considere apoio profissional.',
  },
  {
    id: 'relacionamento',
    emoji: '??',
    texto: 'Problemas de relacionamento',
    resposta:
      'Relacionamentos podem ser desafiadores. Algumas dicas:\n\n' +
      '� Comunique seus sentimentos com clareza\n' +
      '� Ou�a ativamente o outro lado\n' +
      '� Estabele�a limites saud�veis\n' +
      '� Lembre-se que relacionamentos envolvem reciprocidade\n' +
      '� Respeite seus pr�prios valores\n\n' +
      'Se os conflitos persistirem, terapia de casal pode ajudar.',
  },
  {
    id: 'autoestima',
    emoji: '??',
    texto: 'Problemas de autoestima',
    resposta:
      'A autoestima � algo que podemos trabalhar. Lembre-se:\n\n' +
      '� Voc� � �nico e tem valor\n' +
      '� Ningu�m � perfeito, e est� tudo bem\n' +
      '� Liste 3 coisas boas sobre voc� todo dia\n' +
      '� Trate-se com a mesma gentileza que trataria um amigo\n' +
      '� Celebre pequenas conquistas\n\n' +
      'Se a baixa autoestima afetar muito sua vida, procure ajuda profissional.',
  },
  {
    id: 'emergencia',
    emoji: '??',
    texto: 'Pensamentos de autoles�o',
    resposta:
      '?? ATEN��O: Sua vida tem valor e existem pessoas que podem te ajudar neste momento:\n\n' +
      '?? CVV - 188 (24h, gratuito)\n' +
      '?? CAPS - Centro de Aten��o Psicossocial\n' +
      '?? UBS - Unidade B�sica de Sa�de\n' +
      '?? SAMU - 192\n\n' +
      'Voc� n�o precisa passar por isso sozinho. Por favor, ligue para um desses n�meros ou v� ao hospital mais pr�ximo.',
  },
];

export const MENSAGEM_INICIAL =
  'Ol�! Sou o assistente virtual do Cedro. Estou aqui para te ajudar. Escolha uma das op��es abaixo:';
