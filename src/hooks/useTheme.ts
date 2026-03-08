import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light' | 'ember' | 'peach-aqua' | 'violet' | 'pumpkin-charcoal' | 'sky-ocean' | 'sage-olive' | 'yellow' | 'pink';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const themeClasses: Record<ThemeMode, string[]> = {
  dark: ['dark'],
  light: [],
  'ember': ['dark', 'theme-ember'],
  'peach-aqua': ['dark', 'theme-peach-aqua'],
  'violet': ['dark', 'theme-violet'],
  'pumpkin-charcoal': ['dark', 'theme-pumpkin-charcoal'],
  'sky-ocean': ['dark', 'theme-sky-ocean'],
  'sage-olive': ['dark', 'theme-sage-olive'],
  'yellow': ['dark', 'theme-yellow'],
  'pink': ['dark', 'theme-pink'],
};

const allClasses = ['dark', 'theme-ember', 'theme-peach-aqua', 'theme-violet', 'theme-pumpkin-charcoal', 'theme-sky-ocean', 'theme-sage-olive', 'theme-yellow', 'theme-pink'];

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      setMode: (mode) => {
        // Migrate old 'red' theme to 'ember'
        const resolved = (mode as string) === 'red' ? 'ember' : mode;
        set({ mode: resolved });
        const root = document.documentElement;
        root.classList.remove(...allClasses);
        const classes = themeClasses[resolved] || [];
        classes.forEach(c => root.classList.add(c));
      },
    }),
    { name: 'strivo-theme' }
  )
);
