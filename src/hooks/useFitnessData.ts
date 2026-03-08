import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DailyLog {
  date: string;
  steps: number;
  calories: number;
  water: number;
  activeMinutes: number;
  sleepHours?: number;
}

interface FitnessState {
  logs: DailyLog[];
  todayLog: () => DailyLog;
  addSteps: (steps: number) => void;
  addCalories: (cal: number) => void;
  addWater: () => void;
  addActiveMinutes: (min: number) => void;
  setSleep: (hours: number) => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

const emptyLog = (date: string): DailyLog => ({ date, steps: 0, calories: 0, water: 0, activeMinutes: 0, sleepHours: 0 });

export const useFitnessData = create<FitnessState>()(
  persist(
    (set, get) => ({
      logs: [],
      todayLog: () => {
        const today = getToday();
        return get().logs.find(l => l.date === today) || emptyLog(today);
      },
      addSteps: (steps) => set(state => {
        const today = getToday();
        const exists = state.logs.find(l => l.date === today);
        if (exists) {
          return { logs: state.logs.map(l => l.date === today ? { ...l, steps: l.steps + steps } : l) };
        }
        return { logs: [...state.logs, { ...emptyLog(today), steps }] };
      }),
      addCalories: (cal) => set(state => {
        const today = getToday();
        const exists = state.logs.find(l => l.date === today);
        if (exists) {
          return { logs: state.logs.map(l => l.date === today ? { ...l, calories: l.calories + cal } : l) };
        }
        return { logs: [...state.logs, { ...emptyLog(today), calories: cal }] };
      }),
      addWater: () => set(state => {
        const today = getToday();
        const exists = state.logs.find(l => l.date === today);
        if (exists) {
          return { logs: state.logs.map(l => l.date === today ? { ...l, water: l.water + 1 } : l) };
        }
        return { logs: [...state.logs, { ...emptyLog(today), water: 1 }] };
      }),
      addActiveMinutes: (min) => set(state => {
        const today = getToday();
        const exists = state.logs.find(l => l.date === today);
        if (exists) {
          return { logs: state.logs.map(l => l.date === today ? { ...l, activeMinutes: l.activeMinutes + min } : l) };
        }
        return { logs: [...state.logs, { ...emptyLog(today), activeMinutes: min }] };
      }),
      setSleep: (hours) => set(state => {
        const today = getToday();
        const exists = state.logs.find(l => l.date === today);
        if (exists) {
          return { logs: state.logs.map(l => l.date === today ? { ...l, sleepHours: hours } : l) };
        }
        return { logs: [...state.logs, { ...emptyLog(today), sleepHours: hours }] };
      }),
    }),
    { name: 'strivo-fitness' }
  )
);
