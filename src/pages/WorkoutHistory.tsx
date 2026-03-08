import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, TrendingUp, Flame, Footprints, Droplets, Timer } from 'lucide-react';
import { useFitnessData } from '@/hooks/useFitnessData';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';

const WorkoutHistory = () => {
  const { logs } = useFitnessData();

  const chartData = useMemo(() => {
    const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
    return sorted.map(l => ({
      date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      steps: l.steps,
      calories: l.calories,
      water: l.water,
      activeMinutes: l.activeMinutes,
    }));
  }, [logs]);

  const totals = useMemo(() => ({
    steps: logs.reduce((s, l) => s + l.steps, 0),
    calories: logs.reduce((s, l) => s + l.calories, 0),
    water: logs.reduce((s, l) => s + l.water, 0),
    activeMinutes: logs.reduce((s, l) => s + l.activeMinutes, 0),
    sessions: logs.filter(l => l.activeMinutes > 0).length,
  }), [logs]);

  const tooltipStyle = {
    contentStyle: {
      background: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      fontFamily: "'Orbitron', sans-serif",
      fontSize: 11,
      borderRadius: 4,
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen pb-24 pixel-grid">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl tracking-wider flex items-center gap-3">
            <History className="w-7 h-7 text-strivo-red" />
            WORKOUT HISTORY
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Track your progress over time.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Summary cards */}
          <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <SummaryCard icon={<Footprints className="w-5 h-5" />} label="TOTAL STEPS" value={totals.steps.toLocaleString()} />
            <SummaryCard icon={<Flame className="w-5 h-5 text-strivo-red" />} label="CALORIES" value={`${totals.calories.toLocaleString()} kcal`} />
            <SummaryCard icon={<Droplets className="w-5 h-5" />} label="WATER" value={`${totals.water} glasses`} />
            <SummaryCard icon={<Timer className="w-5 h-5" />} label="ACTIVE MIN" value={`${totals.activeMinutes} min`} />
            <SummaryCard icon={<TrendingUp className="w-5 h-5 text-strivo-red" />} label="SESSIONS" value={totals.sessions.toString()} />
          </motion.div>

          {chartData.length === 0 ? (
            <motion.div variants={item} className="glass-card text-center py-12">
              <p className="font-display text-muted-foreground tracking-wider">NO DATA YET</p>
              <p className="text-xs text-muted-foreground mt-2">Log workouts and track metrics to see your history here.</p>
            </motion.div>
          ) : (
            <>
              {/* Steps chart */}
              <motion.div variants={item} className="glass-card">
                <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
                  <Footprints className="w-4 h-4" /> STEPS
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--strivo-red))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--strivo-red))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'Orbitron'" }} axisLine={false} tickLine={false} stroke="currentColor" />
                      <YAxis tick={{ fontSize: 10, fontFamily: "'Orbitron'" }} axisLine={false} tickLine={false} stroke="currentColor" width={40} />
                      <Tooltip {...tooltipStyle} />
                      <Area type="monotone" dataKey="steps" stroke="hsl(var(--strivo-red))" strokeWidth={2} fill="url(#stepsGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Calories & Active minutes side by side */}
              <motion.div variants={item} className="grid md:grid-cols-2 gap-6">
                <div className="glass-card">
                  <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-strivo-red" /> CALORIES BURNED
                  </h3>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: "'Orbitron'" }} axisLine={false} tickLine={false} stroke="currentColor" />
                        <YAxis tick={{ fontSize: 9, fontFamily: "'Orbitron'" }} axisLine={false} tickLine={false} stroke="currentColor" width={35} />
                        <Tooltip {...tooltipStyle} />
                        <Bar dataKey="calories" fill="hsl(var(--strivo-red))" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card">
                  <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
                    <Timer className="w-4 h-4" /> ACTIVE MINUTES
                  </h3>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fontFamily: "'Orbitron'" }} axisLine={false} tickLine={false} stroke="currentColor" />
                        <YAxis tick={{ fontSize: 9, fontFamily: "'Orbitron'" }} axisLine={false} tickLine={false} stroke="currentColor" width={35} />
                        <Tooltip {...tooltipStyle} />
                        <Line type="monotone" dataKey="activeMinutes" stroke="currentColor" strokeWidth={2} dot={{ fill: 'currentColor', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* Water chart */}
              <motion.div variants={item} className="glass-card">
                <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> WATER INTAKE
                </h3>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'Orbitron'" }} axisLine={false} tickLine={false} stroke="currentColor" />
                      <YAxis tick={{ fontSize: 10, fontFamily: "'Orbitron'" }} axisLine={false} tickLine={false} stroke="currentColor" width={30} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="water" fill="hsl(205 80% 45%)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <motion.div whileHover={{ scale: 1.03 }} className="glass-card text-center">
    <div className="flex justify-center mb-2 text-muted-foreground">{icon}</div>
    <p className="font-display text-xs tracking-wider text-muted-foreground">{label}</p>
    <p className="font-display text-lg mt-1">{value}</p>
  </motion.div>
);

export default WorkoutHistory;
