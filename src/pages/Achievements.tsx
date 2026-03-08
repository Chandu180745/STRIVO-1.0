import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Zap, Target, Award, Crown, Medal, Shield, Dumbbell, Heart, Droplets } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

const ALL_BADGES = [
  { id: 'first-workout', label: 'FIRST WORKOUT', icon: Zap, description: 'Log your first workout', points: 10 },
  { id: '7-day-streak', label: '7 DAY STREAK', icon: Flame, description: 'Work out 7 days in a row', points: 100 },
  { id: '30-day-streak', label: '30 DAY STREAK', icon: Star, description: '30 consecutive active days', points: 500 },
  { id: '100-day-streak', label: '100 DAY STREAK', icon: Crown, description: 'Century of consistency', points: 1000 },
  { id: 'hydration-master', label: 'HYDRATION MASTER', icon: Droplets, description: 'Hit 8 glasses 7 days straight', points: 50 },
  { id: '10k-steps', label: '10K STEPS', icon: Target, description: 'Walk 10,000 steps in a day', points: 25 },
  { id: 'early-bird', label: 'EARLY BIRD', icon: Medal, description: 'Work out before 7 AM', points: 15 },
  { id: 'night-owl', label: 'NIGHT OWL', icon: Trophy, description: 'Work out after 10 PM', points: 15 },
  { id: 'beast-mode', label: 'BEAST MODE', icon: Shield, description: 'Complete Beast Mode challenge', points: 200 },
  { id: 'gym-warrior', label: 'GYM WARRIOR', icon: Dumbbell, description: 'Log 50 workouts', points: 150 },
  { id: 'iron-lifter', label: 'IRON LIFTER', icon: Award, description: 'Lift 10,000kg total volume', points: 300 },
  { id: 'protein-king', label: 'PROTEIN KING', icon: Heart, description: 'Hit protein goal 30 days', points: 250 },
];

const LEVELS_UNLOCKS = [
  { level: 1, unlock: 'Basic Workouts' },
  { level: 5, unlock: 'Custom Plans' },
  { level: 10, unlock: 'Advanced Analytics' },
  { level: 15, unlock: 'AI Trainer Pro' },
  { level: 20, unlock: 'Premium Programs' },
  { level: 30, unlock: 'Elite Badge' },
  { level: 50, unlock: 'Legend Status' },
];

const Achievements = () => {
  const { badges, rewardPoints, xp, level, currentStreak, longestStreak, totalWorkoutsLogged, totalMealsLogged } = useSettings();

  const xpInLevel = xp % 500;
  const xpPercent = Math.round((xpInLevel / 500) * 100);
  const earnedCount = badges.length;

  return (
    <div className="space-y-4">

      {/* Level Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring}
        className="glass-card mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-strivo-red/5 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-display text-3xl">{level}</p>
            <p className="text-[10px] font-display tracking-wider text-muted-foreground">LEVEL</p>
          </div>
          <div className="text-right">
            <p className="font-display text-xl text-yellow-500">{xp}</p>
            <p className="text-[10px] font-display tracking-wider text-muted-foreground">TOTAL XP</p>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
          <motion.div initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-strivo-red to-yellow-500 rounded-full" />
        </div>
        <p className="text-[9px] text-muted-foreground font-display text-center">{xpInLevel}/500 XP TO NEXT LEVEL</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'STREAK', value: currentStreak, icon: Flame, color: 'text-strivo-red' },
          { label: 'BEST', value: longestStreak, icon: Crown, color: 'text-yellow-500' },
          { label: 'WORKOUTS', value: totalWorkoutsLogged, icon: Dumbbell, color: 'text-blue-400' },
          { label: 'POINTS', value: rewardPoints, icon: Star, color: 'text-green-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.05 }} className="glass-card text-center p-2">
            <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
            <p className="font-display text-lg">{s.value}</p>
            <p className="text-[7px] font-display tracking-wider text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.2 }}
        className="glass-card mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-display text-sm tracking-wider">BADGES</h3>
          <span className="text-[10px] font-display text-muted-foreground">{earnedCount}/{ALL_BADGES.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {ALL_BADGES.map((badge, i) => {
            const earned = badges.includes(badge.id);
            const Icon = badge.icon;
            return (
              <motion.div key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: 0.3 + i * 0.03 }}
                whileHover={{ scale: 1.08, rotateY: 10 }}
                className={`flex flex-col items-center p-2 border text-center transition-all rounded-2xl ${
                  earned ? 'border-strivo-red/40 bg-strivo-red/5 shadow-sm shadow-strivo-red/10' : 'border-foreground/10 opacity-30'
                }`}>
                <Icon className={`w-5 h-5 mb-1 ${earned ? 'text-strivo-red' : 'text-muted-foreground'}`} />
                <p className="text-[7px] font-display tracking-wider leading-tight">{badge.label}</p>
                <p className="text-[6px] text-muted-foreground mt-0.5">+{badge.points}pts</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Level Unlocks */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.4 }}
        className="glass-card">
        <h3 className="font-display text-sm tracking-wider mb-3">LEVEL UNLOCKS</h3>
        <div className="space-y-2">
          {LEVELS_UNLOCKS.map((lu, i) => {
            const unlocked = level >= lu.level;
            return (
              <motion.div key={lu.level}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...spring, delay: 0.5 + i * 0.04 }}
                className={`flex items-center gap-3 p-2 border rounded ${unlocked ? 'border-foreground/20' : 'border-foreground/5 opacity-40'}`}>
                <span className={`font-display text-xs w-8 text-center ${unlocked ? 'text-yellow-500' : ''}`}>L{lu.level}</span>
                <span className="text-xs flex-1">{lu.unlock}</span>
                {unlocked && <Zap className="w-3 h-3 text-yellow-500" />}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
