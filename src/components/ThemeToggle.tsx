import { useTheme, ThemeMode } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

interface ThemeOption {
  id: ThemeMode;
  label: string;
  color: string;
}

const themes: ThemeOption[] = [
  { id: 'dark', label: 'DARK', color: '#000000' },
  { id: 'light', label: 'LIGHT', color: '#FFFFFF' },
  { id: 'ember', label: 'EMBER', color: '#D2691E' },
  { id: 'peach-aqua', label: 'PEACH', color: '#FFDAB9' },
  { id: 'violet', label: 'VIOLET', color: '#7B2FBE' },
  { id: 'pumpkin-charcoal', label: 'PUMPKIN', color: '#FF7518' },
  { id: 'sky-ocean', label: 'SKY', color: '#1A5276' },
  { id: 'sage-olive', label: 'SAGE', color: '#B2BDA0' },
  { id: 'yellow', label: 'YELLOW', color: '#F5C518' },
  { id: 'pink', label: 'PINK', color: '#FF69B4' },
];

export const ThemeToggle = () => {
  const { mode, setMode } = useTheme();

  return (
    <div className="grid grid-cols-5 gap-2">
      {themes.map((theme) => {
        const isActive = mode === theme.id;
        return (
          <motion.button
            key={theme.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(theme.id)}
            className={`flex flex-col items-center gap-1 px-1 py-2 text-[9px] font-display tracking-wider transition-all rounded-full border
              ${isActive ? 'border-strivo-red bg-strivo-red/10' : 'border-foreground/20 hover:border-foreground/40'}`}
          >
            <div className="w-5 h-5 rounded-full border-2 border-foreground/20" style={{ backgroundColor: theme.color }} />
            <span>{theme.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
