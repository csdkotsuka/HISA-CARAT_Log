import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from './config';
import type { DailyLog, PTEvalDock } from '../types';
import type { Tenant, Customer, GenericDailyLog, GenericEvalRecord, PublicTemplate } from '../types/tenant';
import type { ConcertGoal } from '../utils/storage';
import { INITIAL_DAILY_LOGS, INITIAL_PT_DOCKS } from '../data/initialData';
import { INITIAL_TENANTS, INITIAL_CUSTOMERS } from '../data/tenantPresets';
import { PUBLIC_TEMPLATES } from '../data/publicTemplates';
import {
  getTenants,
  getCustomers,
  getGenericDailyLogs,
  getGenericEvalRecords,
} from '../utils/tenantStorage';

// Firestore Collection Names
const TENANTS_COL = 'tenants';
const CUSTOMERS_COL = 'customers';
const PUBLIC_TEMPLATES_COL = 'public_templates';
const GENERIC_DAILY_LOGS_COL = 'daily_logs';
const GENERIC_EVALS_COL = 'eval_records';
const SETTINGS_COL = 'settings';
const CONCERT_GOAL_DOC = 'concert_goal';

// Legacy Collection Names
const LEGACY_DAILY_LOGS_COL = 'hisa_daily_logs';
const LEGACY_PT_DOCKS_COL = 'hisa_pt_docks';

/* ---------------- TENANTS SYNC ---------------- */
export const subscribeTenants = (
  onData: (tenants: Tenant[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, TENANTS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const tenants: Tenant[] = [];
      snapshot.forEach((d) => {
        tenants.push(d.data() as Tenant);
      });
      if (tenants.length > 0) {
        onData(tenants);
      }
    },
    (error) => {
      console.warn('Firestore tenants subscription notice:', error);
      if (onError) onError(error);
    }
  );
};

export const saveTenantToFirestore = async (tenant: Tenant): Promise<void> => {
  const docRef = doc(db, TENANTS_COL, tenant.id);
  await setDoc(docRef, tenant, { merge: true });
};

export const saveAllTenantsToFirestore = async (tenants: Tenant[]): Promise<void> => {
  for (const t of tenants) {
    await saveTenantToFirestore(t);
  }
};

/* ---------------- CUSTOMERS SYNC ---------------- */
export const subscribeCustomers = (
  onData: (customers: Customer[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, CUSTOMERS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const customers: Customer[] = [];
      snapshot.forEach((d) => {
        customers.push(d.data() as Customer);
      });
      if (customers.length > 0) {
        onData(customers);
      }
    },
    (error) => {
      console.warn('Firestore customers subscription notice:', error);
      if (onError) onError(error);
    }
  );
};

export const saveCustomerToFirestore = async (customer: Customer): Promise<void> => {
  const docRef = doc(db, CUSTOMERS_COL, customer.id);
  await setDoc(docRef, customer, { merge: true });
};

export const saveAllCustomersToFirestore = async (customers: Customer[]): Promise<void> => {
  for (const c of customers) {
    await saveCustomerToFirestore(c);
  }
};

/* ---------------- PUBLIC TEMPLATES SYNC ---------------- */
export const subscribePublicTemplates = (
  onData: (templates: PublicTemplate[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, PUBLIC_TEMPLATES_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const templates: PublicTemplate[] = [];
      snapshot.forEach((d) => {
        templates.push(d.data() as PublicTemplate);
      });
      if (templates.length > 0) {
        templates.sort((a, b) => a.sortOrder - b.sortOrder);
        onData(templates);
      }
    },
    (error) => {
      console.warn('Firestore public_templates subscription notice:', error);
      if (onError) onError(error);
    }
  );
};

export const savePublicTemplateToFirestore = async (template: PublicTemplate): Promise<void> => {
  const docRef = doc(db, PUBLIC_TEMPLATES_COL, template.id);
  await setDoc(docRef, template, { merge: true });
};

export const saveAllPublicTemplatesToFirestore = async (
  templates: PublicTemplate[]
): Promise<void> => {
  for (const t of templates) {
    await savePublicTemplateToFirestore(t);
  }
};

/* ---------------- GENERIC DAILY LOGS SYNC ---------------- */
export const subscribeAllGenericDailyLogs = (
  onData: (logs: GenericDailyLog[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, GENERIC_DAILY_LOGS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const logs: GenericDailyLog[] = [];
      snapshot.forEach((d) => {
        logs.push(d.data() as GenericDailyLog);
      });
      logs.sort((a, b) => b.date.localeCompare(a.date));
      onData(logs);
    },
    (error) => {
      console.warn('Firestore daily_logs subscription notice:', error);
      if (onError) onError(error);
    }
  );
};

export const saveGenericDailyLogToFirestore = async (log: GenericDailyLog): Promise<void> => {
  // Document ID: ${customerId}_${date} for idempotency
  const docId = `${log.customerId}_${log.date}`;
  const docRef = doc(db, GENERIC_DAILY_LOGS_COL, docId);
  await setDoc(docRef, log, { merge: true });
};

export const deleteGenericDailyLogFromFirestore = async (
  customerId: string,
  dateOrId: string
): Promise<void> => {
  const docId = dateOrId.includes('_') ? dateOrId : `${customerId}_${dateOrId}`;
  const docRef = doc(db, GENERIC_DAILY_LOGS_COL, docId);
  await deleteDoc(docRef);
};

export const saveAllGenericDailyLogsToFirestore = async (
  logs: GenericDailyLog[]
): Promise<void> => {
  for (const log of logs) {
    await saveGenericDailyLogToFirestore(log);
  }
};

/* ---------------- GENERIC EVAL RECORDS SYNC ---------------- */
export const subscribeAllGenericEvalRecords = (
  onData: (records: GenericEvalRecord[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, GENERIC_EVALS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const records: GenericEvalRecord[] = [];
      snapshot.forEach((d) => {
        records.push(d.data() as GenericEvalRecord);
      });
      records.sort((a, b) => b.date.localeCompare(a.date));
      onData(records);
    },
    (error) => {
      console.warn('Firestore eval_records subscription notice:', error);
      if (onError) onError(error);
    }
  );
};

export const saveGenericEvalRecordToFirestore = async (
  record: GenericEvalRecord
): Promise<void> => {
  const docId = `${record.customerId}_${record.id || record.date}`;
  const docRef = doc(db, GENERIC_EVALS_COL, docId);
  await setDoc(docRef, record, { merge: true });
};

export const deleteGenericEvalRecordFromFirestore = async (
  customerId: string,
  id: string
): Promise<void> => {
  const docId = id.includes('_') ? id : `${customerId}_${id}`;
  const docRef = doc(db, GENERIC_EVALS_COL, docId);
  await deleteDoc(docRef);
};

export const saveAllGenericEvalRecordsToFirestore = async (
  records: GenericEvalRecord[]
): Promise<void> => {
  for (const r of records) {
    await saveGenericEvalRecordToFirestore(r);
  }
};

/* ---------------- MASTER SYNC ALL DATA ---------------- */
export const syncAllLocalDataToFirestore = async (): Promise<{
  tenantsCount: number;
  customersCount: number;
  dailyLogsCount: number;
  evalRecordsCount: number;
}> => {
  // 1. Tenants
  const currentTenants = getTenants().length > 0 ? getTenants() : INITIAL_TENANTS;
  await saveAllTenantsToFirestore(currentTenants);

  // 2. Customers
  const currentCustomers = getCustomers().length > 0 ? getCustomers() : INITIAL_CUSTOMERS;
  await saveAllCustomersToFirestore(currentCustomers);

  // 2.5 Public Templates
  await saveAllPublicTemplatesToFirestore(PUBLIC_TEMPLATES);

  // 3. Daily Logs across all customers
  let dailyLogsCount = 0;
  for (const cust of currentCustomers) {
    const logs = getGenericDailyLogs(cust.id, cust.tenantId);
    if (logs && logs.length > 0) {
      await saveAllGenericDailyLogsToFirestore(logs);
      dailyLogsCount += logs.length;
    }
  }

  // 4. Eval Records across all customers
  let evalRecordsCount = 0;
  for (const cust of currentCustomers) {
    const evals = getGenericEvalRecords(cust.id, cust.tenantId);
    if (evals && evals.length > 0) {
      await saveAllGenericEvalRecordsToFirestore(evals);
      evalRecordsCount += evals.length;
    }
  }

  return {
    tenantsCount: currentTenants.length,
    customersCount: currentCustomers.length,
    dailyLogsCount,
    evalRecordsCount,
  };
};

/* ---------------- LEGACY HISA-CARAT SUPPORT ---------------- */
export const subscribeDailyLogs = (
  onData: (logs: DailyLog[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, LEGACY_DAILY_LOGS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const logs: DailyLog[] = [];
      snapshot.forEach((docSnap) => {
        logs.push(docSnap.data() as DailyLog);
      });
      logs.sort((a, b) => b.date.localeCompare(a.date));
      onData(logs);
    },
    (error) => {
      console.warn('Legacy daily_logs subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export const saveDailyLogToFirestore = async (log: DailyLog): Promise<void> => {
  const docRef = doc(db, LEGACY_DAILY_LOGS_COL, log.date);
  await setDoc(docRef, log, { merge: true });
};

export const deleteDailyLogFromFirestore = async (dateOrId: string): Promise<void> => {
  const docRef = doc(db, LEGACY_DAILY_LOGS_COL, dateOrId);
  await deleteDoc(docRef);
};

export const subscribePTDocks = (
  onData: (docks: PTEvalDock[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, LEGACY_PT_DOCKS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const docks: PTEvalDock[] = [];
      snapshot.forEach((docSnap) => {
        docks.push(docSnap.data() as PTEvalDock);
      });
      docks.sort((a, b) => a.date.localeCompare(b.date));
      onData(docks);
    },
    (error) => {
      console.warn('Legacy pt_eval_docks subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export const savePTDockToFirestore = async (dock: PTEvalDock): Promise<void> => {
  const docRef = doc(db, LEGACY_PT_DOCKS_COL, dock.id);
  await setDoc(docRef, dock, { merge: true });
};

export const deletePTDockFromFirestore = async (id: string): Promise<void> => {
  const docRef = doc(db, LEGACY_PT_DOCKS_COL, id);
  await deleteDoc(docRef);
};

export const subscribeConcertGoal = (
  onData: (goal: ConcertGoal) => void,
  onError?: (err: Error) => void
) => {
  const docRef = doc(db, SETTINGS_COL, CONCERT_GOAL_DOC);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as ConcertGoal);
      }
    },
    (error) => {
      console.warn('Firestore concert_goal subscription error:', error);
      if (onError) onError(error);
    }
  );
};

export const saveConcertGoalToFirestore = async (goal: ConcertGoal): Promise<void> => {
  const docRef = doc(db, SETTINGS_COL, CONCERT_GOAL_DOC);
  await setDoc(docRef, goal, { merge: true });
};

export const seedSampleDataManually = async (): Promise<void> => {
  for (const log of INITIAL_DAILY_LOGS) {
    await setDoc(doc(db, LEGACY_DAILY_LOGS_COL, log.date), log);
  }
  for (const dock of INITIAL_PT_DOCKS) {
    await setDoc(doc(db, LEGACY_PT_DOCKS_COL, dock.id), dock);
  }
};

export const clearAllFirestoreData = async (): Promise<void> => {
  const dailySnap = await getDocs(collection(db, LEGACY_DAILY_LOGS_COL));
  for (const d of dailySnap.docs) {
    await deleteDoc(d.ref);
  }
  const ptSnap = await getDocs(collection(db, LEGACY_PT_DOCKS_COL));
  for (const d of ptSnap.docs) {
    await deleteDoc(d.ref);
  }
};
