import type { Tenant, Customer, GenericDailyLog, GenericEvalRecord } from '../types/tenant';
import { INITIAL_TENANTS, INITIAL_CUSTOMERS } from '../data/tenantPresets';
import { getDailyLogs, getPTDocks } from './storage';

const TENANTS_KEY = 'omni_saas_tenants_v1';
const CUSTOMERS_KEY = 'omni_saas_customers_v1';
const ACTIVE_TENANT_ID_KEY = 'omni_saas_active_tenant_id_v1';
const ACTIVE_CUSTOMER_ID_KEY = 'omni_saas_active_customer_id_v1';
const APP_MODE_KEY = 'omni_saas_app_mode_v1';
const GENERIC_DAILY_LOGS_PREFIX = 'omni_saas_daily_logs_';
const GENERIC_EVALS_PREFIX = 'omni_saas_evals_';

export type AppMode = 'admin' | 'provider' | 'customer';

// Load Tenants
export const getTenants = (): Tenant[] => {
  try {
    const raw = localStorage.getItem(TENANTS_KEY);
    if (!raw) {
      saveTenants(INITIAL_TENANTS);
      return INITIAL_TENANTS;
    }
    const parsed: Tenant[] = JSON.parse(raw);
    if (!parsed || parsed.length === 0) return INITIAL_TENANTS;

    // Migrate any legacy HISA-CARAT references to generic MY-CARAT
    let modified = false;
    const migrated = parsed.map((t) => {
      if (t.headerTitle === 'HISA-CARAT Log') {
        modified = true;
        return {
          ...t,
          headerTitle: 'MY-CARAT Log',
          headerSubtitle: t.headerSubtitle.replace('ひさこの', '毎日の'),
          badgeText: 'CARAT 💎 Care',
          aiPersona: {
            ...t.aiPersona,
            speechBubbleText: t.aiPersona.speechBubbleText.replace('ひさこさん', 'あおいさん'),
            chatGreeting: t.aiPersona.chatGreeting || 'あおいさん、ハニヘ〜！👼🪽 今日も会えて嬉しいよ。体調はどう？何でも話してね！',
            chatFirstPerson: t.aiPersona.chatFirstPerson || '僕',
            chatSecondPerson: t.aiPersona.chatSecondPerson || 'あおいさん',
            chatPersonality: t.aiPersona.chatPersonality || 'SEVENTEENの天使担当ジョンハン（ハニ）。優しく包み込み、時にはお茶目で甘え上手。ファンの頑張りを誰よりも認め、無理をさせない温かい言葉をかけてくれる。口調は「〜だよ」「〜ね」「ハニヘ〜👼」など。',
          },
        };
      }
      return t;
    });

    if (modified) {
      saveTenants(migrated);
    }
    return migrated;
  } catch {
    return INITIAL_TENANTS;
  }
};

// Save Tenants
export const saveTenants = (tenants: Tenant[]): void => {
  try {
    localStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
  } catch (e) {
    console.error('Failed to save tenants:', e);
  }
};

// Load Customers
export const getCustomers = (): Customer[] => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      saveCustomers(INITIAL_CUSTOMERS);
      return INITIAL_CUSTOMERS;
    }
    const parsed: Customer[] = JSON.parse(raw);
    if (!parsed || parsed.length === 0) return INITIAL_CUSTOMERS;

    // Migrate cached 'ひさこ' to 'あおい'
    let modified = false;
    const migrated = parsed.map((c) => {
      if (c.name === 'ひさこ') {
        modified = true;
        return {
          ...c,
          name: 'あおい',
          nickname: 'あおいさん',
        };
      }
      return c;
    });

    if (modified) {
      saveCustomers(migrated);
    }
    return migrated;
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

// Save Customers
export const saveCustomers = (customers: Customer[]): void => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error('Failed to save customers:', e);
  }
};

// Active Tenant ID
export const getActiveTenantId = (): string => {
  try {
    return localStorage.getItem(ACTIVE_TENANT_ID_KEY) || INITIAL_TENANTS[0].id;
  } catch {
    return INITIAL_TENANTS[0].id;
  }
};

export const saveActiveTenantId = (id: string): void => {
  try {
    localStorage.setItem(ACTIVE_TENANT_ID_KEY, id);
  } catch (e) {
    console.error('Failed to save active tenant ID:', e);
  }
};

// Active Customer ID
export const getActiveCustomerId = (): string => {
  try {
    return localStorage.getItem(ACTIVE_CUSTOMER_ID_KEY) || INITIAL_CUSTOMERS[0].id;
  } catch {
    return INITIAL_CUSTOMERS[0].id;
  }
};

export const saveActiveCustomerId = (id: string): void => {
  try {
    localStorage.setItem(ACTIVE_CUSTOMER_ID_KEY, id);
  } catch (e) {
    console.error('Failed to save active customer ID:', e);
  }
};

// App Mode
export const getAppMode = (): AppMode => {
  try {
    return (localStorage.getItem(APP_MODE_KEY) as AppMode) || 'customer';
  } catch {
    return 'customer';
  }
};

export const saveAppMode = (mode: AppMode): void => {
  try {
    localStorage.setItem(APP_MODE_KEY, mode);
  } catch (e) {
    console.error('Failed to save app mode:', e);
  }
};

// Generic Daily Logs for a customer
export const getGenericDailyLogs = (customerId: string, tenantId: string): GenericDailyLog[] => {
  try {
    const key = `${GENERIC_DAILY_LOGS_PREFIX}${customerId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }

    // Special migration: if customer is 'cust-hisa-01', migrate from existing HISA-CARAT logs
    if (customerId === 'cust-hisa-01') {
      const legacyLogs = getDailyLogs();
      if (legacyLogs && legacyLogs.length > 0) {
        const migrated: GenericDailyLog[] = legacyLogs.map((l) => ({
          id: l.id || `log-${l.date}`,
          customerId,
          tenantId,
          date: l.date,
          condition: l.condition,
          weather: l.weather,
          checkStates: {
            chairSquats: l.exercises.chairSquats,
            towelGather: l.exercises.towelGather,
            husbandSoleCare: l.exercises.husbandSoleCare,
            tensTherapy: l.exercises.tensTherapy,
            calfStretch: l.exercises.calfStretch,
            walking: l.exercises.walking,
          },
          sliderValues: {
            fatigueLevel: l.fatigueLevel,
            painVas: l.painVas,
          },
          numericValues: {
            pslDoseMg: l.pslDoseMg,
            bodyTemp: l.bodyTemp ?? 36.5,
            stepCount: l.stepCount ?? 3500,
          },
          energyLevel: l.oshiEnergy,
          memo: l.memo,
          createdAt: l.createdAt,
        }));
        saveGenericDailyLogs(customerId, migrated);
        return migrated;
      }
    }

    return [];
  } catch (e) {
    console.error('Failed to load generic daily logs', e);
    return [];
  }
};

export const saveGenericDailyLogs = (customerId: string, logs: GenericDailyLog[]): void => {
  try {
    const key = `${GENERIC_DAILY_LOGS_PREFIX}${customerId}`;
    localStorage.setItem(key, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save generic daily logs', e);
  }
};

// Generic Periodic Evaluations for a customer
export const getGenericEvalRecords = (customerId: string, tenantId: string): GenericEvalRecord[] => {
  try {
    const key = `${GENERIC_EVALS_PREFIX}${customerId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }

    // Special migration: if customer is 'cust-hisa-01', migrate from existing PT docks
    if (customerId === 'cust-hisa-01') {
      const legacyDocks = getPTDocks();
      if (legacyDocks && legacyDocks.length > 0) {
        const migrated: GenericEvalRecord[] = legacyDocks.map((d) => ({
          id: d.id,
          customerId,
          tenantId,
          date: d.date,
          evaluator: d.evaluator,
          metricValues: {
            cs30: d.functional.cs30Count,
            heelRaise: (d.functional.singleLegHeelRaiseLeft + d.functional.singleLegHeelRaiseRight) / 2,
            romberg: d.functional.rombergTest === 'pass' ? '正常 (Pass)' : '軽度動揺',
            calfCircumference: (d.calfCircumference.rightCm + d.calfCircumference.leftCm) / 2,
            allodyniaScore: d.allodyniaScore,
          },
          advice: d.kazuhiroAdvice,
          nextGoal: d.nextGoal,
          createdAt: d.createdAt,
        }));
        saveGenericEvalRecords(customerId, migrated);
        return migrated;
      }
    }

    return [];
  } catch (e) {
    console.error('Failed to load generic eval records', e);
    return [];
  }
};

export const saveGenericEvalRecords = (customerId: string, records: GenericEvalRecord[]): void => {
  try {
    const key = `${GENERIC_EVALS_PREFIX}${customerId}`;
    localStorage.setItem(key, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save generic eval records', e);
  }
};
