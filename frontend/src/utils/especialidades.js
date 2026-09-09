// Lista fixa de especialidades/abordagens reconhecidas (base CFP).
// Deve ser usada em todos os formulários e filtros de especialidade
// (CadastroPsicologo, ConfiguracoesPsicologo, ListaPsicologos etc.),
// garantindo que o valor salvo bata exatamente com o valor filtrado.
export const ESPECIALIDADES = [
  'Terapia Cognitivo-Comportamental (TCC)',
  'Psicanálise',
  'Psicologia Humanista',
  'Terapia Sistêmica / Familiar',
  'Terapia de Casal',
  'Psicologia Infantil',
  'Psicologia do Adolescente',
  'Neuropsicologia',
  'Psicologia Organizacional',
  'Psicologia Escolar',
  'Psicologia do Esporte',
  'Psicologia Hospitalar',
  'Psicologia Forense',
  'EMDR',
  'Terapia de Aceitação e Compromisso (ACT)',
  'Terapia Dialético-Comportamental (DBT)',
  'Gestalt-terapia',
  'Análise do Comportamento (ABA)',
  'Psicologia Positiva',
  'Ansiedade e Depressão',
  'Trauma e TEPT',
  'Dependência Química',
  'Luto e Perdas',
  'Orientação Vocacional',
];

// Normaliza texto para comparação: trim, minúsculas e sem acentos.
const normalizar = (texto) =>
  (texto || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

// Regra de compatibilidade com cadastros antigos (texto livre):
// 1) match exato (após normalização);
// 2) fallback: includes case-insensitive nos dois sentidos — cobre
//    variações como "TCC" vs "Terapia Cognitivo-Comportamental (TCC)"
//    ou valores salvos com texto extra.
export const especialidadeCorresponde = (valorSalvo, filtro) => {
  if (!valorSalvo || !filtro) return false;
  const valor = normalizar(valorSalvo);
  const alvo = normalizar(filtro);
  if (!valor || !alvo) return false;
  if (valor === alvo) return true;
  return valor.includes(alvo) || alvo.includes(valor);
};
