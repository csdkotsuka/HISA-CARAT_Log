import type { DailyLog, PTEvalDock } from '../types';
import { INITIAL_DAILY_LOGS, INITIAL_PT_DOCKS } from '../data/initialData';

const DAILY_LOGS_KEY = 'hisa_carat_daily_logs_v1';
const PT_DOCKS_KEY = 'hisa_carat_pt_docks_v1';
const CONCERT_GOAL_KEY = 'hisa_carat_concert_goal_v1';

export interface ConcertGoal {
  targetDate: string;
  eventName: string;
  targetMotto: string;
}

const DEFAULT_CONCERT_GOAL: ConcertGoal = {
  targetDate: '2026-11-20',
  eventName: 'SEVENTEEN 2026 WORLD TOUR IN JAPAN 💎',
  targetMotto: 'ジョンハンの前で元気に飛び跳ねてハニヘ〜する！👼✨',
};

export const getDailyLogs = (): DailyLog[] => {
  try {
    const raw = localStorage.getItem(DAILY_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(INITIAL_DAILY_LOGS));
      return INITIAL_DAILY_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load daily logs from localStorage', e);
    return INITIAL_DAILY_LOGS;
  }
};

export const saveDailyLogs = (logs: DailyLog[]): void => {
  try {
    localStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save daily logs', e);
  }
};

export const getPTDocks = (): PTEvalDock[] => {
  try {
    const raw = localStorage.getItem(PT_DOCKS_KEY);
    if (!raw) {
      localStorage.setItem(PT_DOCKS_KEY, JSON.stringify(INITIAL_PT_DOCKS));
      return INITIAL_PT_DOCKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load PT docks from localStorage', e);
    return INITIAL_PT_DOCKS;
  }
};

export const savePTDocks = (docks: PTEvalDock[]): void => {
  try {
    localStorage.setItem(PT_DOCKS_KEY, JSON.stringify(docks));
  } catch (e) {
    console.error('Failed to save PT docks', e);
  }
};

export const getConcertGoal = (): ConcertGoal => {
  try {
    const raw = localStorage.getItem(CONCERT_GOAL_KEY);
    if (!raw) return DEFAULT_CONCERT_GOAL;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONCERT_GOAL;
  }
};

export const saveConcertGoal = (goal: ConcertGoal): void => {
  try {
    localStorage.setItem(CONCERT_GOAL_KEY, JSON.stringify(goal));
  } catch (e) {
    console.error('Failed to save concert goal', e);
  }
};
