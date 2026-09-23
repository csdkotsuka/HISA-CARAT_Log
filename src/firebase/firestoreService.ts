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
import type { ConcertGoal } from '../utils/storage';
import { INITIAL_DAILY_LOGS, INITIAL_PT_DOCKS } from '../data/initialData';

const DAILY_LOGS_COL = 'daily_logs';
const PT_DOCKS_COL = 'pt_eval_docks';
const SETTINGS_COL = 'settings';
const CONCERT_GOAL_DOC = 'concert_goal';

// Real-time listener for Daily Logs (strictly reads what is in Firestore)
export const subscribeDailyLogs = (
  onData: (logs: DailyLog[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, DAILY_LOGS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const logs: DailyLog[] = [];
      snapshot.forEach((docSnap) => {
        logs.push(docSnap.data() as DailyLog);
      });
      // Sort descending by date
      logs.sort((a, b) => b.date.localeCompare(a.date));
      onData(logs);
    },
    (error) => {
      console.warn('Firestore daily_logs subscription error:', error);
      if (onError) onError(error);
    }
  );
};

// Save a Daily Log to Firestore
export const saveDailyLogToFirestore = async (log: DailyLog): Promise<void> => {
  const docRef = doc(db, DAILY_LOGS_COL, log.date); // Use YYYY-MM-DD as document ID
  await setDoc(docRef, log, { merge: true });
};

// Delete a Daily Log from Firestore
export const deleteDailyLogFromFirestore = async (dateOrId: string): Promise<void> => {
  const docRef = doc(db, DAILY_LOGS_COL, dateOrId);
  await deleteDoc(docRef);
};

// Real-time listener for PT Eval Docks (strictly reads what is in Firestore)
export const subscribePTDocks = (
  onData: (docks: PTEvalDock[]) => void,
  onError?: (err: Error) => void
) => {
  const colRef = collection(db, PT_DOCKS_COL);
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
      console.warn('Firestore pt_eval_docks subscription error:', error);
      if (onError) onError(error);
    }
  );
};

// Save PT Eval Dock to Firestore
export const savePTDockToFirestore = async (dock: PTEvalDock): Promise<void> => {
  const docRef = doc(db, PT_DOCKS_COL, dock.id);
  await setDoc(docRef, dock, { merge: true });
};

// Delete PT Eval Dock from Firestore
export const deletePTDockFromFirestore = async (id: string): Promise<void> => {
  const docRef = doc(db, PT_DOCKS_COL, id);
  await deleteDoc(docRef);
};

// Real-time listener for Concert Goal
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

// Save Concert Goal to Firestore
export const saveConcertGoalToFirestore = async (goal: ConcertGoal): Promise<void> => {
  const docRef = doc(db, SETTINGS_COL, CONCERT_GOAL_DOC);
  await setDoc(docRef, goal, { merge: true });
};

// Manual helper: seed sample data only when explicitly clicked
export const seedSampleDataManually = async (): Promise<void> => {
  for (const log of INITIAL_DAILY_LOGS) {
    await setDoc(doc(db, DAILY_LOGS_COL, log.date), log);
  }
  for (const dock of INITIAL_PT_DOCKS) {
    await setDoc(doc(db, PT_DOCKS_COL, dock.id), dock);
  }
};

// Manual helper: clear all data in Firestore
export const clearAllFirestoreData = async (): Promise<void> => {
  const dailySnap = await getDocs(collection(db, DAILY_LOGS_COL));
  for (const d of dailySnap.docs) {
    await deleteDoc(d.ref);
  }
  const ptSnap = await getDocs(collection(db, PT_DOCKS_COL));
  for (const d of ptSnap.docs) {
    await deleteDoc(d.ref);
  }
};
