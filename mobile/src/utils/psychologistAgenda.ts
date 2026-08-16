import { PsicologoAgendaConfig } from '../types/api.types';

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
] as const;

export const WEEKDAY_OPTIONS = [
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sab' },
  { value: 0, label: 'Dom' },
] as const;

type AgendaCarrier = {
  id: number;
  precoSessao: number | null;
  diasAtendimento?: number[];
  horariosAtendimento?: string[];
};

export function mergeAgendaConfig<T extends AgendaCarrier>(
  item: T,
  config?: PsicologoAgendaConfig | null,
): T {
  if (!config || config.psicologoId !== item.id) {
    return item;
  }

  const apiDias = normalizeWeekdays(item.diasAtendimento);
  const apiHorarios = normalizeTimeSlots(item.horariosAtendimento);

  return {
    ...item,
    precoSessao: config.precoSessao ?? item.precoSessao,
    diasAtendimento: apiDias.length ? apiDias : normalizeWeekdays(config.diasAtendimento),
    horariosAtendimento: apiHorarios.length ? apiHorarios : normalizeTimeSlots(config.horariosAtendimento),
  };
}

export function normalizeWeekdays(days?: number[]): number[] {
  if (!days?.length) return [];
  return Array.from(new Set(days)).filter((day) => day >= 0 && day <= 6).sort();
}

export function normalizeTimeSlots(slots?: string[]): string[] {
  if (!slots?.length) return [];
  return Array.from(new Set(slots)).sort((left, right) => left.localeCompare(right));
}

export function getNextAvailableDates(days?: number[], limit = 7): Date[] {
  const normalizedDays = normalizeWeekdays(days);
  const dates: Date[] = [];
  const today = new Date();

  for (let offset = 1; offset <= 21 && dates.length < limit; offset += 1) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + offset);

    if (normalizedDays.length === 0) {
      if (candidate.getDay() !== 0 && candidate.getDay() !== 6) {
        dates.push(candidate);
      }
      continue;
    }

    if (normalizedDays.includes(candidate.getDay())) {
      dates.push(candidate);
    }
  }

  return dates;
}

export function formatAgendaSummary(days?: number[], slots?: string[]): string {
  const dayLabels = normalizeWeekdays(days).flatMap((day) => {
    const label = WEEKDAY_OPTIONS.find((option) => option.value === day)?.label;
    return label ? [label] : [];
  });

  const normalizedSlots = normalizeTimeSlots(slots);

  if (!dayLabels.length && !normalizedSlots.length) {
    return 'Agenda ainda nao configurada.';
  }

  if (!dayLabels.length) {
    return `Horarios: ${normalizedSlots.join(', ')}`;
  }

  if (!normalizedSlots.length) {
    return `Dias: ${dayLabels.join(', ')}`;
  }

  return `${dayLabels.join(', ')} • ${normalizedSlots.join(', ')}`;
}
