import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Star, Zap, Target, Award, Crown, Medal, Check } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const allBadges = [
  { id: '7-day-streak', label: '7 DAY STREAK', icon: Flame, description: 'Work out 7 days in a row', points: 100 },
  { id: '30-day-streak', label: '30 DAY STREAK', icon: Star, description: '30 consecutive active days', points: 500 },
  { id: '100-day-streak', label: '100 DAY STREAK', icon: Crown, description: 'Century of consistency', points: 1000 },
  { id: 'first-workout', label: 'FIRST WORKOUT', icon: Zap, description: 'Log your first workout', points: 10 },
  { id: 'hydration-master', label: 'HYDRATION MASTER', icon: Target, description: 'Hit 8 glasses 7 days straight', points: 50 },
  { id: '10k-steps', label: '10K STEPS', icon: Award, description: 'Walk 10,000 steps in a day', points: 25 },
  { id: 'early-bird', label: 'EARLY BIRD', icon: Medal, description: 'Work out before 7 AM', points: 15 },
  { id: 'night-owl', label: 'NIGHT OWL', icon: Trophy, description: 'Work out after 10 PM', points: 15 },
];

const getWeekDays = (weekStart: 'sunday' | 'monday') => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const startOffset = weekStart === 'monday' ? (dayOfWeek === 0 ? -6 : 1 - dayOfWeek) : -dayOfWeek;
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + startOffset + i);
    days.push(d);
  }
  return days;
};

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayLabelsMon = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const StreaksAndBadges = () => {
  const { currentStreak, longestStreak, badges, rewardPoints, lastActiveDate, weekStart } = useSettings();

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const todayStr = new Date().toISOString().split('T')[0];

  // Build set of active dates in the current week
  // We know lastActiveDate and currentStreak, so we can derive recent active days
  const activeDates = useMemo(() => {
    const dates = new Set<string>();
    if (!lastActiveDate || currentStreak === 0) return dates;
    const last = new Date(lastActiveDate);
    for (let i = 0; i < currentStreak && i < 7; i++) {
      const d = new Date(last);
      d.setDate(last.getDate() - i);
      dates.add(d.toISOString().split('T')[0]);
    }
    return dates;
  }, [lastActiveDate, currentStreak]);

  const labels = weekStart === 'monday' ? dayLabelsMon : dayLabels;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <h3 className="font-display text-lg tracking-wider mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-strivo-red" /> STREAKS & BADGES
      </h3>

      {/* Streak Display */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 text-center p-3 border border-foreground/10 rounded-2xl">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-5 h-5 text-strivo-red" />
            <span className="font-display text-3xl text-strivo-red">{currentStreak}</span>
          </div>
          <p className="text-[10px] font-display tracking-wider text-muted-foreground">CURRENT STREAK</p>
        </div>
        <div className="flex-1 text-center p-3 border border-foreground/10 rounded-2xl">
          <span className="font-display text-3xl">{longestStreak}</span>
          <p className="text-[10px] font-display tracking-wider text-muted-foreground">LONGEST STREAK</p>
        </div>
        <div className="flex-1 text-center p-3 border border-foreground/10 rounded-2xl">
          <span className="font-display text-3xl text-yellow-500">{rewardPoints}</span>
          <p className="text-[10px] font-display tracking-wider text-muted-foreground">REWARD PTS</p>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="mb-4">
        <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-2">THIS WEEK</p>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((day, i) => {
            const dateStr = day.toISOString().split('T')[0];
            const isActive = activeDates.has(dateStr);
            const isToday = dateStr === todayStr;
            const isPast = day < new Date(todayStr);
            return (
              <motion.div
                key={dateStr}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`flex flex-col items-center py-2 rounded-xl border transition-all ${
                  isToday
                    ? 'border-strivo-red/60 bg-strivo-red/10 shadow-[0_0_12px_hsl(var(--strivo-red)/0.2)]'
                    : isActive
                    ? 'border-green-500/40 bg-green-500/10'
                    : isPast
                    ? 'border-foreground/5 opacity-40'
                    : 'border-foreground/10'
                }`}
              >
                <span className="text-[9px] font-display tracking-wider text-muted-foreground">{labels[i]}</span>
                <span className={`text-xs font-display mt-0.5 ${isToday ? 'text-strivo-red' : ''}`}>{day.getDate()}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-1"
                  >
                    {isToday ? (
                      <Flame className="w-3.5 h-3.5 text-strivo-red" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 7-day streak bonus note */}
      {currentStreak >= 1 && currentStreak < 7 && (
        <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-3 text-center">
          🔥 {7 - currentStreak} more day{7 - currentStreak > 1 ? 's' : ''} for 100 bonus points!
        </p>
      )}

      {/* Badges Grid */}
      <p className="text-xs font-display tracking-wider text-muted-foreground mb-3">ACHIEVEMENTS</p>
      <div className="grid grid-cols-4 gap-2">
        {allBadges.map(badge => {
          const earned = badges.includes(badge.id);
          const Icon = badge.icon;
          return (
            <motion.div key={badge.id} whileHover={{ scale: 1.05 }}
              className={`flex flex-col items-center p-2 border text-center transition-all rounded-xl ${
                earned ? 'border-strivo-red/40 bg-strivo-red/5' : 'border-foreground/10 opacity-40'
              }`}>
              <Icon className={`w-5 h-5 mb-1 ${earned ? 'text-strivo-red' : 'text-muted-foreground'}`} />
              <p className="text-[8px] font-display tracking-wider leading-tight">{badge.label}</p>
              <p className="text-[7px] text-muted-foreground mt-0.5">+{badge.points}pts</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
