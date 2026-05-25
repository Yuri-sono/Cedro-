import AsyncStorage from '@react-native-async-storage/async-storage';
import { PsicologoAgendaConfig } from '../types/api.types';
import { normalizeTimeSlots, normalizeWeekdays } from '../utils/psychologistAgenda';

const AGENDA_CONFIG_STORAGE_KEY = 'cedro_psicologo_agenda_configs';

type AgendaConfigMap = Record<string, PsicologoAgendaConfig>;

async function readConfigMap(): Promise<AgendaConfigMap> {
  const rawValue = await AsyncStorage.getItem(AGENDA_CONFIG_STORAGE_KEY);

  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as AgendaConfigMap;
  } catch {
    return {};
  }
}

async function writeConfigMap(configMap: AgendaConfigMap): Promise<void> {
  await AsyncStorage.setItem(AGENDA_CONFIG_STORAGE_KEY, JSON.stringify(configMap));
}

export const agendaConfigService = {
  async get(psicologoId: number): Promise<PsicologoAgendaConfig | null> {
    const configMap = await readConfigMap();
    return configMap[String(psicologoId)] || null;
  },

  async save(config: PsicologoAgendaConfig): Promise<PsicologoAgendaConfig> {
    const normalizedConfig: PsicologoAgendaConfig = {
      ...config,
      diasAtendimento: normalizeWeekdays(config.diasAtendimento),
      horariosAtendimento: normalizeTimeSlots(config.horariosAtendimento),
    };

    const configMap = await readConfigMap();
    configMap[String(config.psicologoId)] = normalizedConfig;
    await writeConfigMap(configMap);
    return normalizedConfig;
  },
};
