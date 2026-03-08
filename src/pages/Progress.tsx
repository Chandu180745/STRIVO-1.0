import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Scale, Ruler, Activity, Target, BarChart3, Brain, Flame, Calendar, Award } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useFitnessData } from '@/hooks/useFitnessData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

const Progress = () => {
  const { weightHistory, bodyMeasurements, currentStreak, longestStreak, xp, level, totalWorkoutsLogged, fitnessGoal, weight } = useSettings();
  const { logs } = useFitnessData();
  const [activeSection, setActiveSection] = useState<'graphs' | 'reports' | 'prediction'>('graphs');

  const last7 = logs.slice(-7).map(l => ({ date: l.date.slice(5), steps: l.steps, cal: l.calories, mins: l.activeMinutes }));
  const weightData = weightHistory.slice(-14).map(w => ({ date: w.date.slice(5), weight: w.weight }));
  const measureData = bodyMeasurements.slice(-10).map(m => ({ date: m.date.slice(5), chest: m.chest, waist: m.waist, arms: m.arms }));

  const xpForNext = 500;
  const xpInLevel = xp % 500;
  const xpPercent = Math.round((xpInLevel / xpForNext) * 100);

  // Weekly report calculations
  const totalCalsBurned = last7.reduce((s, d) => s + d.cal, 0);
  const totalSteps = last7.reduce((s, d) => s + d.steps, 0);
  const avgMins = last7.length ? Math.round(last7.reduce((s, d) => s + d.mins, 0) / last7.length) : 0;
  const fitnessScore = Math.min(100, Math.round((currentStreak * 5) + (totalWorkoutsLogged * 2) + (xpPercent * 0.3)));
  const consistencyRating = currentStreak >= 7 ? 'EXCELLENT' : currentStreak >= 3 ? 'GOOD' : currentStreak >= 1 ? 'FAIR' : 'NEEDS WORK';
  const recoveryScore = Math.min(100, 60 + (avgMins > 30 ? 20 : avgMins > 15 ? 10 : 0) + (currentStreak > 3 ? 20 : 10));

  // Calorie burn chart data
  const calData = last7.map(d => ({ date: d.date, calories: d.cal }));

  // Goal prediction
  const goalLabels: Record<string, string> = {
    'lose-weight': 'Target Weight Loss', 'build-muscle': 'Muscle Building Goal',
    'stay-fit': 'Fitness Maintenance', 'gain-weight': 'Weight Gain Goal', 'improve-endurance': 'Endurance Target',
  };
  const currentWeight = parseFloat(weight) || 70;
  const targetWeight = fitnessGoal === 'lose-weight' ? currentWeight - 10 : fitnessGoal === 'gain-weight' ? currentWeight + 8 : currentWeight;
  const weeklyChange = fitnessGoal === 'lose-weight' ? 0.5 : fitnessGoal === 'gain-weight' ? 0.3 : 0;
  const weeksToGoal = weeklyChange > 0 ? Math.ceil(Math.abs(targetWeight - currentWeight) / weeklyChange) : 0;
  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + weeksToGoal * 7);

  const stats = [
    { label: 'LEVEL', value: level, icon: Target, color: 'text-yellow-500' },
    { label: 'TOTAL XP', value: xp, icon: TrendingUp, color: 'text-strivo-red' },
    { label: 'WORKOUTS', value: totalWorkoutsLogged, icon: Activity, color: 'text-blue-400' },
    { label: 'STREAK', value: currentStreak, icon: BarChart3, color: 'text-green-400' },
  ];

  const sections = [
    { id: 'graphs' as const, label: 'GRAPHS', icon: BarChart3 },
    { id: 'reports' as const, label: 'REPORTS', icon: Calendar },
    { id: 'prediction' as const, label: 'AI PREDICT', icon: Brain },
  ];

  return (
    <div className="space-y-4">
      {/* XP Bar */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="glass-card mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-display text-sm tracking-wider">LEVEL {level}</span>
          <span className="text-xs text-muted-foreground font-display">{xpInLevel}/{xpForNext} XP</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${xpPercent}%` }} transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-strivo-red to-yellow-500 rounded-full" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: i * 0.05 }}
            className="glass-card text-center p-3">
            <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
            <p className="font-display text-xl">{s.value}</p>
            <p className="text-[8px] font-display tracking-wider text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-4">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-display tracking-wider border transition-colors ${
              activeSection === s.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 hover:border-foreground/40'
            }`}>
            <s.icon className="w-3.5 h-3.5" /> {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── GRAPHS ─── */}
        {activeSection === 'graphs' && (
          <motion.div key="graphs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {last7.length > 0 && (
              <div className="glass-card">
                <h3 className="font-display text-sm tracking-wider mb-3">WEEKLY ACTIVITY</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={last7}>
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <Area type="monotone" dataKey="steps" stroke="hsl(var(--strivo-red))" fill="hsl(var(--strivo-red) / 0.2)" />
                    <Area type="monotone" dataKey="cal" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Calories Burned Chart */}
            {calData.length > 0 && (
              <div className="glass-card">
                <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-strivo-red" /> CALORIES BURNED
                </h3>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={calData}>
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <Bar dataKey="calories" fill="hsl(var(--strivo-red))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {weightData.length > 0 && (
              <div className="glass-card">
                <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4" /> WEIGHT TREND
                </h3>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={weightData}>
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {measureData.length > 0 && (
              <div className="glass-card">
                <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4" /> BODY MEASUREMENTS
                </h3>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={measureData}>
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <Line type="monotone" dataKey="chest" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="waist" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="arms" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 justify-center">
                  <span className="text-[9px] font-display flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />CHEST</span>
                  <span className="text-[9px] font-display flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />WAIST</span>
                  <span className="text-[9px] font-display flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />ARMS</span>
                </div>
              </div>
            )}

            {weightData.length === 0 && measureData.length === 0 && last7.length === 0 && (
              <div className="glass-card text-center py-12">
                <TrendingUp className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-display text-sm tracking-wider text-muted-foreground">START TRACKING TO SEE PROGRESS</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── WEEKLY REPORTS ─── */}
        {activeSection === 'reports' && (
          <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="glass-card">
              <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-strivo-red" /> WEEKLY REPORT
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'FITNESS SCORE', value: fitnessScore, suffix: '/100', color: fitnessScore >= 70 ? 'text-green-400' : fitnessScore >= 40 ? 'text-yellow-400' : 'text-strivo-red' },
                  { label: 'CONSISTENCY', value: consistencyRating, suffix: '', color: consistencyRating === 'EXCELLENT' ? 'text-green-400' : 'text-yellow-400' },
                  { label: 'RECOVERY', value: recoveryScore, suffix: '%', color: recoveryScore >= 70 ? 'text-green-400' : 'text-yellow-400' },
                ].map(item => (
                  <div key={item.label} className="text-center p-3 border border-foreground/10">
                    <p className={`font-display text-2xl ${item.color}`}>{item.value}{item.suffix}</p>
                    <p className="text-[8px] font-display tracking-wider text-muted-foreground mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h3 className="font-display text-xs tracking-wider mb-3 text-muted-foreground">THIS WEEK SUMMARY</h3>
              <div className="space-y-2">
                {[
                  { label: 'Calories Burned', value: `${totalCalsBurned.toLocaleString()} kcal`, icon: Flame },
                  { label: 'Total Steps', value: totalSteps.toLocaleString(), icon: Activity },
                  { label: 'Avg Active Mins', value: `${avgMins} min/day`, icon: Target },
                  { label: 'Current Streak', value: `${currentStreak} days`, icon: Award },
                  { label: 'Longest Streak', value: `${longestStreak} days`, icon: TrendingUp },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-foreground/5 last:border-0">
                    <span className="text-xs flex items-center gap-2"><row.icon className="w-3.5 h-3.5 text-muted-foreground" /> {row.label}</span>
                    <span className="text-xs font-display tracking-wider">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── AI GOAL PREDICTION ─── */}
        {activeSection === 'prediction' && (
          <motion.div key="prediction" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="glass-card border-l-2 border-strivo-red">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-strivo-red" />
                <h3 className="font-display text-sm tracking-wider">AI GOAL PREDICTION</h3>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-muted/30 border border-foreground/10">
                  <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1">YOUR GOAL</p>
                  <p className="font-display text-lg tracking-wider">{goalLabels[fitnessGoal] || 'Stay Fit'}</p>
                </div>

                {(fitnessGoal === 'lose-weight' || fitnessGoal === 'gain-weight') && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border border-foreground/10 text-center">
                        <p className="text-[10px] font-display text-muted-foreground">CURRENT</p>
                        <p className="font-display text-2xl">{currentWeight}<span className="text-xs text-muted-foreground ml-1">kg</span></p>
                      </div>
                      <div className="p-3 border border-strivo-red/30 bg-strivo-red/5 text-center">
                        <p className="text-[10px] font-display text-strivo-red">TARGET</p>
                        <p className="font-display text-2xl">{targetWeight}<span className="text-xs text-muted-foreground ml-1">kg</span></p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/20 border border-foreground/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-strivo-red animate-pulse" />
                        <p className="text-xs font-display tracking-wider">AI ESTIMATES</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on your activity ({currentStreak}-day streak, {totalWorkoutsLogged} workouts), you'll reach your target in approximately:
                      </p>
                      <p className="font-display text-3xl mt-2 text-strivo-red">{weeksToGoal} WEEKS</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Estimated date: <span className="font-display">{goalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2 border-t border-foreground/10 pt-2">
                        Rate: ~{weeklyChange} kg/week • Maintain consistency for best results
                      </p>
                    </div>
                  </>
                )}

                {(fitnessGoal === 'stay-fit' || fitnessGoal === 'build-muscle' || fitnessGoal === 'improve-endurance') && (
                  <div className="p-4 bg-muted/20 border border-foreground/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-strivo-red animate-pulse" />
                      <p className="text-xs font-display tracking-wider">AI ANALYSIS</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {fitnessGoal === 'build-muscle'
                        ? `With ${totalWorkoutsLogged} workouts logged and a ${currentStreak}-day streak, you're on track. Increase progressive overload weekly for optimal hypertrophy.`
                        : fitnessGoal === 'improve-endurance'
                        ? `Your cardio consistency is ${consistencyRating.toLowerCase()}. Aim for 150+ active minutes per week. Current avg: ${avgMins} min/day.`
                        : `Fitness score: ${fitnessScore}/100. You're maintaining well. Keep your streak going for bonus XP and recovery improvements.`
                      }
                    </p>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${fitnessScore}%` }} transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-strivo-red to-green-400 rounded-full" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 text-right">{fitnessScore}% towards optimal</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Progress;
