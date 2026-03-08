import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, BedDouble, TrendingUp, Zap } from 'lucide-react';
import { useFitnessData } from '@/hooks/useFitnessData';

export const SleepTracker = () => {
  const { todayLog, setSleep } = useFitnessData();
  const today = todayLog();
  const [sleepInput, setSleepInput] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const sleepHours = today.sleepHours || 0;
  const sleepQuality = sleepHours >= 7 ? 'EXCELLENT' : sleepHours >= 6 ? 'GOOD' : sleepHours >= 5 ? 'FAIR' : 'POOR';
  const recoveryScore = Math.min(100, Math.round((sleepHours / 8) * 100));
  const qualityColor = sleepQuality === 'EXCELLENT' ? 'text-green-400' : sleepQuality === 'GOOD' ? 'text-sky-400' : sleepQuality === 'FAIR' ? 'text-yellow-400' : 'text-strivo-red';

  const handleLog = () => {
    const h = parseFloat(sleepInput);
    if (h > 0 && h <= 24) {
      setSleep(h);
      setSleepInput('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card card-3d space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm tracking-wider flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-400" />
          SLEEP TRACKER
        </h3>
        <button onClick={() => setShowDetails(!showDetails)} className="text-[10px] font-display text-muted-foreground hover:text-foreground transition-colors">
          {showDetails ? 'HIDE' : 'DETAILS'}
        </button>
      </div>

      {/* Log Input */}
      <div className="flex gap-2 items-center">
        <input
          type="number"
          step="0.5"
          min="0"
          max="24"
          value={sleepInput}
          onChange={e => setSleepInput(e.target.value)}
          placeholder="Hours slept"
          className="terminal-input flex-1 text-xs py-2"
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLog} className="terminal-button text-xs py-2 px-3">
          LOG
        </motion.button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="border border-foreground/10 p-2 text-center rounded-2xl">
          <BedDouble className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
          <p className="font-display text-lg">{sleepHours.toFixed(1)}</p>
          <p className="text-[8px] text-muted-foreground font-display">HOURS</p>
        </div>
        <div className="border border-foreground/10 p-2 text-center rounded-2xl">
          <Sun className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
          <p className={`font-display text-xs ${qualityColor}`}>{sleepQuality}</p>
          <p className="text-[8px] text-muted-foreground font-display">QUALITY</p>
        </div>
        <div className="border border-foreground/10 p-2 text-center rounded-2xl">
          <Zap className="w-4 h-4 mx-auto mb-1 text-green-400" />
          <p className="font-display text-lg">{recoveryScore}</p>
          <p className="text-[8px] text-muted-foreground font-display">RECOVERY</p>
        </div>
      </div>

      {/* Sleep bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] font-display text-muted-foreground">
          <span>0h</span>
          <span>8h TARGET</span>
        </div>
        <div className="h-3 bg-foreground/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, hsl(240 60% 50%), hsl(270 70% 60%))' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((sleepHours / 8) * 100, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
            <div className="border-t border-foreground/10 pt-2">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-display tracking-wider text-muted-foreground">SLEEP INSIGHTS</span>
              </div>
              <div className="space-y-1 text-[10px] text-muted-foreground">
                {sleepHours < 6 && <p className="text-strivo-red">⚠️ You're sleeping less than recommended. Aim for 7-9 hours.</p>}
                {sleepHours >= 7 && sleepHours <= 9 && <p className="text-green-400">✓ Great sleep duration! Keep it consistent.</p>}
                {sleepHours > 9 && <p className="text-yellow-400">⚠️ Oversleeping may indicate fatigue. Check recovery.</p>}
                <p>• Deep sleep typically occurs in first 3-4 hours</p>
                <p>• Avoid screens 1 hour before bed for better quality</p>
                <p>• Consistent sleep schedule improves recovery by 23%</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
