import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { useFitnessData } from '@/hooks/useFitnessData';

const DAILY_GOAL = 8;

export const WaterTracker = () => {
  const { todayLog, addWater } = useFitnessData();
  const log = todayLog();
  const progress = Math.min(log.water / DAILY_GOAL, 1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card scanline">
      <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
        <Droplets className="w-5 h-5 text-blue-400" />
        WATER INTAKE
      </h3>

      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="text-center">
          <p className="font-display text-4xl">{log.water}</p>
          <p className="text-[10px] text-muted-foreground font-display">/ {DAILY_GOAL} GLASSES</p>
        </div>
      </div>

      {/* Visual water fill */}
      <div className="relative h-32 w-20 mx-auto border-2 border-foreground/30 rounded-b-xl overflow-hidden mb-4">
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-blue-400/30"
          initial={{ height: 0 }}
          animate={{ height: `${progress * 100}%` }}
          transition={{ type: 'spring', stiffness: 50 }}
        >
          <div className="absolute inset-0 opacity-50" style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(96,165,250,0.3) 4px, rgba(96,165,250,0.3) 8px)'
          }} />
        </motion.div>
        {/* Marks */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0 border-t border-foreground/10"
            style={{ bottom: `${((i + 1) / 8) * 100}%` }}>
            <span className="absolute -right-5 -top-1.5 text-[7px] text-muted-foreground">{i + 1}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={addWater}
          className="terminal-button text-xs py-2 px-4 flex items-center gap-1">
          <Plus className="w-3 h-3" /> ADD GLASS
        </motion.button>
      </div>

      {log.water >= DAILY_GOAL && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center text-[10px] font-display text-green-400 mt-3 tracking-wider">
          ✓ DAILY GOAL REACHED!
        </motion.p>
      )}
    </motion.div>
  );
};
