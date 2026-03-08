import { motion } from 'framer-motion';

interface ASCIIProgressBarProps {
  value: number;
  max: number;
  label: string;
  isAlert?: boolean;
}

export const ASCIIProgressBar = ({ value, max, label, isAlert = false }: ASCIIProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const filled = Math.round(percentage / 5);
  const empty = 20 - filled;

  const bar = '[' + '|'.repeat(filled) + '.'.repeat(empty) + ']';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="font-mono text-sm"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-display tracking-wider">{label}</span>
        <span className={isAlert ? 'alert-text' : ''}>{percentage.toFixed(0)}%</span>
      </div>
      <div className={`ascii-bar tracking-tight ${isAlert ? 'alert-text' : 'text-muted-foreground'}`}>
        {bar}
      </div>
    </motion.div>
  );
};
