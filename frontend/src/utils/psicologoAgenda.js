// Util de agenda do psicólogo — espelho javascript da lógica/constantes de
// mobile/src/utils/psychologistAgenda.ts (mesmos valores e ordem de exibição).

export const DEFAULT_TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

// 0=Domingo a 6=Sábado (mesmo padrão do backend em dias_atendimento)
export const WEEKDAY_OPTIONS = [
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sab' },
  { value: 0, label: 'Dom' },
];

// Mantém apenas dias válidos (0..6), remove duplicados e ordena.
export function normalizeWeekdays(days = []) {
  if (!Array.isArray(days) || !days.length) return [];
  return Array.from(new Set(days))
    .filter((day) => day >= 0 && day <= 6)
    .sort((left, right) => left - right);
}

// Remove duplicados e ordena horários (formato HH:mm).
export function normalizeTimeSlots(slots = []) {
  if (!Array.isArray(slots) || !slots.length) return [];
  return Array.from(new Set(slots)).sort((left, right) => left.localeCompare(right));
}

// Resumo textual da agenda, ex.: "Seg, Qua, Sex • 14:00, 15:00, 16:00, 17:00"
export function formatAgendaSummary(days = [], slots = []) {
  const dayLabels = normalizeWeekdays(days)
    .map((day) => WEEKDAY_OPTIONS.find((option) => option.value === day)?.label)
    .filter(Boolean);

  const normalizedSlots = normalizeTimeSlots(slots);

  if (!dayLabels.length && !normalizedSlots.length) {
    return 'Agenda ainda não configurada.';
  }

  if (!dayLabels.length) {
    return `Horários: ${normalizedSlots.join(', ')}`;
  }

  if (!normalizedSlots.length) {
    return `Dias: ${dayLabels.join(', ')}`;
  }

  return `${dayLabels.join(', ')} • ${normalizedSlots.join(', ')}`;
}