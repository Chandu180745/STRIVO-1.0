import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplets, Moon, Activity, AlertTriangle, Plus, X, Calendar } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';

export const WomensHealth = () => {
  const settings = useSettings();
  const [newInjury, setNewInjury] = useState('');

  // Calculate cycle info
  const getCycleInfo = () => {
    if (!settings.lastPeriodDate) return null;
    const lastPeriod = new Date(settings.lastPeriodDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastPeriod.getTime()) / 86400000);
    const dayInCycle = (diffDays % settings.cycleLength) + 1;
    const nextPeriod = new Date(lastPeriod.getTime() + settings.cycleLength * 86400000 * Math.ceil(diffDays / settings.cycleLength));
    const daysUntilNext = Math.floor((nextPeriod.getTime() - today.getTime()) / 86400000);
    const ovulationDay = settings.cycleLength - 14;
    const isOvulating = dayInCycle >= ovulationDay - 1 && dayInCycle <= ovulationDay + 1;
    const isPeriod = dayInCycle <= settings.periodLength;
    let phase = 'Follicular';
    if (isPeriod) phase = 'Menstrual';
    else if (isOvulating) phase = 'Ovulation';
    else if (dayInCycle > ovulationDay + 1) phase = 'Luteal';
    return { dayInCycle, daysUntilNext, phase, isPeriod, isOvulating };
  };

  const cycleInfo = getCycleInfo();

  const addInjury = () => {
    if (newInjury.trim()) {
      settings.addInjuryNote(`${new Date().toLocaleDateString()} - ${newInjury.trim()}`);
      setNewInjury('');
      toast.success('Injury note added');
    }
  };

  return (
    <div className="space-y-4">
      {/* Menstrual Cycle Tracker */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-strivo-red" /> MENSTRUAL CYCLE TRACKER
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-display tracking-wider text-muted-foreground">LAST PERIOD DATE</label>
            <input type="date" value={settings.lastPeriodDate} onChange={e => settings.setLastPeriodDate(e.target.value)}
              className="terminal-input w-full mt-1 text-sm py-2" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-display tracking-wider text-muted-foreground">CYCLE LENGTH</label>
              <input type="number" value={settings.cycleLength} onChange={e => settings.setCycleLength(+e.target.value)}
                className="terminal-input w-full mt-1 text-sm py-2" min={21} max={35} />
            </div>
            <div>
              <label className="text-[10px] font-display tracking-wider text-muted-foreground">PERIOD LENGTH</label>
              <input type="number" value={settings.periodLength} onChange={e => settings.setPeriodLength(+e.target.value)}
                className="terminal-input w-full mt-1 text-sm py-2" min={3} max={7} />
            </div>
          </div>

          {cycleInfo && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-center p-2 border border-foreground/10">
                <p className="font-display text-xl text-strivo-red">{cycleInfo.dayInCycle}</p>
                <p className="text-[9px] text-muted-foreground font-display">DAY IN CYCLE</p>
              </div>
              <div className="text-center p-2 border border-foreground/10">
                <p className="font-display text-xl">{cycleInfo.daysUntilNext}</p>
                <p className="text-[9px] text-muted-foreground font-display">DAYS TO NEXT</p>
              </div>
              <div className={`text-center p-2 border ${cycleInfo.isPeriod ? 'border-strivo-red/30 bg-strivo-red/5' : 'border-foreground/10'}`}>
                <p className="font-display text-xs mt-1">{cycleInfo.phase.toUpperCase()}</p>
                <p className="text-[9px] text-muted-foreground font-display">PHASE</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Sugar Level Tracker */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
        <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-strivo-red" /> SUGAR LEVEL (mg/dL)
        </h3>
        <div className="flex items-center gap-3">
          <input type="number" value={settings.sugarLevel || ''} onChange={e => settings.setSugarLevel(+e.target.value)}
            placeholder="Enter reading" className="terminal-input flex-1 text-sm py-2" />
          <div className={`px-3 py-2 text-xs font-display border ${
            settings.sugarLevel < 70 ? 'border-yellow-500/30 text-yellow-400' :
            settings.sugarLevel <= 140 ? 'border-green-500/30 text-green-400' :
            'border-strivo-red/30 text-strivo-red'
          }`}>
            {settings.sugarLevel < 70 ? 'LOW' : settings.sugarLevel <= 140 ? 'NORMAL' : 'HIGH'}
          </div>
        </div>
      </motion.div>

      {/* Recovery Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card">
        <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
          <Moon className="w-4 h-4 text-strivo-red" /> RECOVERY SCORE
        </h3>
        <div className="flex items-center gap-4">
          <input type="range" min={0} max={100} value={settings.recoveryScore}
            onChange={e => settings.setRecoveryScore(+e.target.value)}
            className="flex-1 accent-strivo-red" />
          <span className={`font-display text-2xl ${settings.recoveryScore < 40 ? 'text-strivo-red' : settings.recoveryScore < 70 ? 'text-yellow-400' : 'text-green-400'}`}>
            {settings.recoveryScore}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Based on sleep quality & activity level</p>
      </motion.div>

      {/* Injury Tracker & Rehab */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
        <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-strivo-red" /> INJURY TRACKER & REHAB
        </h3>
        <div className="flex gap-2 mb-3">
          <input type="text" value={newInjury} onChange={e => setNewInjury(e.target.value)} onKeyDown={e => e.key === 'Enter' && addInjury()}
            placeholder="Log injury or rehab note..." className="terminal-input flex-1 text-sm py-2" />
          <button onClick={addInjury} className="p-2 border border-foreground/30 hover:bg-muted"><Plus className="w-4 h-4" /></button>
        </div>
        {settings.injuryNotes.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">No injuries logged ✓</p>
        ) : (
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {settings.injuryNotes.map((note, i) => (
              <div key={i} className="flex items-start gap-2 text-xs p-2 border border-foreground/10">
                <Activity className="w-3 h-3 mt-0.5 shrink-0 text-strivo-red" />
                <span className="flex-1">{note}</span>
                <button onClick={() => settings.removeInjuryNote(i)} className="text-muted-foreground hover:text-strivo-red"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
