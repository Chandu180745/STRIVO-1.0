import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Dumbbell, Flame, Droplets, Timer, TrendingUp, ChevronRight, Moon, Sparkles, Download, Zap, Trophy, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WorkoutTimer } from '@/components/WorkoutTimer';
import { ProgressChart } from '@/components/ProgressChart';
import { FitnessDashboard } from '@/components/FitnessDashboard';
import { AIFitnessTools } from '@/components/AIFitnessTools';
import { useAuth } from '@/hooks/useAuth';
import { useFitnessData } from '@/hooks/useFitnessData';
import { useSettings } from '@/hooks/useSettings';
import { exportHealthReport } from '@/lib/pdfExport';
import { t } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

const motivationalQuotes = [
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't wish for it. Work for it.",
  "Success isn't always about greatness. It's about consistency.",
  "Wake up with determination. Go to bed with satisfaction.",
  "The only limit is the one you set yourself.",
  "Champions keep playing until they get it right.",
  "Discipline is the bridge between goals and accomplishment.",
  "Every rep counts. Every step matters.",
  "You don't have to be extreme, just consistent.",
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { todayLog, addSteps, addCalories, addWater, addActiveMinutes } = useFitnessData();
  const settings = useSettings();
  const { dashShowSteps, dashShowCalories, dashShowWater, dashShowHeartRate, language, recordActivity,
    currentStreak, longestStreak, xp, level, rewardPoints, badges,
    totalWorkoutsLogged, totalMealsLogged, totalGoalsAchieved, height, weight, age, gender, fitnessGoal } = settings;
  const lang = language as Language;
  const [currentTime, setCurrentTime] = useState(new Date());
  const today = todayLog();

  const bmi = useMemo(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return 0;
    return w / (h * h);
  }, [height, weight]);

  const fitnessScore = useMemo(() => {
    let score = 50;
    score += Math.min(currentStreak * 2, 20);
    if (today.steps > 5000) score += 10;
    if (today.activeMinutes > 30) score += 10;
    if (today.water >= 8) score += 5;
    if (bmi >= 18.5 && bmi < 25) score += 5;
    return Math.min(score, 100);
  }, [currentStreak, today, bmi]);
  const [dailyQuote] = useState(() => {
    const dayIndex = new Date().getDate() % motivationalQuotes.length;
    return motivationalQuotes[dayIndex];
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { recordActivity(); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) addSteps(Math.floor(Math.random() * 3 + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  };

  return (
    <div className="min-h-screen pb-24 pixel-grid">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-strivo-red/5 to-transparent" />
        <div className="container py-12 relative">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-center justify-between text-xs font-display tracking-wider text-muted-foreground">
              <span>{formatDate(currentTime)}</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-strivo-red rounded-full animate-pulse" />
                {formatTime(currentTime)}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="font-display text-5xl md:text-7xl tracking-wider leading-tight">
                {lang === 'en' ? <>DEFINE<br />YOUR<br /><span className="text-strivo-red">METRICS</span></> :
                  <span className="text-strivo-red">{t('defineYourMetrics', lang)}</span>}
              </h1>
              <p className="text-muted-foreground max-w-md">{t('trackTrainTransform', lang)}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <Link to="/health">
                <motion.div whileHover={{ scale: 1.05, rotateY: 5 }} whileTap={{ scale: 0.95 }} className="terminal-button flex items-center gap-2" style={{ perspective: 600 }}>
                  <Heart className="w-4 h-4" /> {t('health', lang)}
                </motion.div>
              </Link>
              <Link to="/shop">
                <motion.div whileHover={{ scale: 1.05, rotateY: -5 }} whileTap={{ scale: 0.95 }} className="terminal-button-outline flex items-center gap-2" style={{ perspective: 600 }}>
                  <ShoppingBag className="w-4 h-4" /> {t('shop', lang)}
                </motion.div>
              </Link>
            </motion.div>

            {isAuthenticated && user && (
              <motion.div variants={itemVariants} className="glass-card inline-block card-3d">
                <p className="font-display text-sm tracking-wider">
                  {t('welcomeBack', lang)}, <span className="text-strivo-red">{user.name.toUpperCase()}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {user.userId}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">

          {/* Essential Live Stats Strip */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Streak */}
            <motion.div
              whileHover={{ scale: 1.04, rotateY: 4 }}
              className="glass-card card-3d flex items-center gap-3 p-4"
              style={{ perspective: 800 }}
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-strivo-red flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none">{currentStreak}</p>
                <p className="text-[9px] font-display tracking-wider text-muted-foreground">DAY STREAK</p>
                <p className="text-[8px] text-muted-foreground">Best: {longestStreak}</p>
              </div>
            </motion.div>

            {/* XP & Level */}
            <motion.div
              whileHover={{ scale: 1.04, rotateY: -4 }}
              className="glass-card card-3d flex items-center gap-3 p-4"
              style={{ perspective: 800 }}
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1">
                  <p className="font-display text-2xl leading-none">LV {level}</p>
                </div>
                <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(xp % 500) / 5}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-[8px] text-muted-foreground mt-0.5">{xp % 500}/500 XP</p>
              </div>
            </motion.div>

            {/* Fitness Score */}
            <motion.div
              whileHover={{ scale: 1.04, rotateY: 4 }}
              className="glass-card card-3d flex items-center gap-3 p-4"
              style={{ perspective: 800 }}
            >
              <div className="relative w-11 h-11 shrink-0">
                <svg width="44" height="44" className="transform -rotate-90">
                  <circle cx="22" cy="22" r="18" stroke="hsl(var(--foreground)/0.1)" strokeWidth="4" fill="none" />
                  <motion.circle
                    cx="22" cy="22" r="18"
                    stroke="hsl(var(--strivo-red))"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={113}
                    initial={{ strokeDashoffset: 113 }}
                    animate={{ strokeDashoffset: 113 * (1 - fitnessScore / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-xs">{fitnessScore}</span>
                </div>
              </div>
              <div>
                <p className="font-display text-sm leading-none">FITNESS</p>
                <p className="text-[9px] font-display tracking-wider text-muted-foreground">SCORE</p>
                <p className={`text-[8px] font-display ${fitnessScore >= 70 ? 'text-green-400' : fitnessScore >= 40 ? 'text-yellow-400' : 'text-strivo-red'}`}>
                  {fitnessScore >= 70 ? 'GREAT' : fitnessScore >= 40 ? 'GOOD' : 'IMPROVE'}
                </p>
              </div>
            </motion.div>

            {/* Badges & Rewards */}
            <motion.div
              whileHover={{ scale: 1.04, rotateY: -4 }}
              className="glass-card card-3d flex items-center gap-3 p-4"
              style={{ perspective: 800 }}
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none">{rewardPoints}</p>
                <p className="text-[9px] font-display tracking-wider text-muted-foreground">REWARDS</p>
                <p className="text-[8px] text-muted-foreground">{badges.length} badges</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Live Activity Ticker */}
          <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-1">
            <LiveChip icon={<Dumbbell className="w-3 h-3" />} label="WORKOUTS" value={totalWorkoutsLogged.toString()} />
            <LiveChip icon={<Target className="w-3 h-3" />} label="GOALS" value={totalGoalsAchieved.toString()} />
            <LiveChip icon={<Award className="w-3 h-3" />} label="MEALS LOGGED" value={totalMealsLogged.toString()} />
            <LiveChip icon={<Timer className="w-3 h-3" />} label="ACTIVE TODAY" value={`${today.activeMinutes}m`} />
            <LiveChip icon={<Droplets className="w-3 h-3" />} label="WATER" value={`${today.water}/8`} />
          </motion.div>

          {/* AI Motivation */}
          <motion.div variants={itemVariants} className="glass-card border-l-4 border-strivo-red card-3d">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-strivo-red shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1">{t('aiMotivation', lang)}</p>
                <p className="font-display text-sm tracking-wider leading-relaxed">"{dailyQuote}"</p>
              </div>
              <button onClick={() => exportHealthReport({ steps: today.steps, calories: today.calories, water: today.water, activeMinutes: today.activeMinutes, sleepHours: today.sleepHours || 0, heartRate: 72 })}
                className="p-2 border border-foreground/20 hover:bg-muted shrink-0 rounded-full" title="Download Health Report PDF">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <h2 className="font-display text-lg tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-strivo-red" />
              {t('todaysTracking', lang)}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {dashShowSteps && <FitnessCard icon={<Dumbbell className="w-5 h-5" />} label={t('steps', lang)} value={today.steps.toLocaleString()} unit={t('steps', lang).toLowerCase()} onClick={() => addSteps(100)} actionLabel="+100" />}
              {dashShowCalories && <FitnessCard icon={<Flame className="w-5 h-5 text-strivo-red" />} label={t('calories', lang)} value={today.calories.toLocaleString()} unit="kcal" onClick={() => addCalories(50)} actionLabel="+50" />}
              {dashShowWater && <FitnessCard icon={<Droplets className="w-5 h-5" />} label={t('water', lang)} value={today.water.toString()} unit="glasses" onClick={() => addWater()} actionLabel="+1" />}
              <FitnessCard icon={<Timer className="w-5 h-5" />} label={t('active', lang)} value={today.activeMinutes.toString()} unit="min" onClick={() => addActiveMinutes(5)} actionLabel="+5m" />
              <FitnessCard icon={<Moon className="w-5 h-5" />} label={t('sleep', lang)} value={today.sleepHours?.toFixed(1) || '0.0'} unit="hrs" onClick={() => {}} actionLabel="" />
              {dashShowHeartRate && <FitnessCard icon={<Heart className="w-5 h-5 text-strivo-red" />} label={t('heartRate', lang)} value={(68 + Math.floor(Math.random() * 15)).toString()} unit="bpm" onClick={() => {}} actionLabel="" />}
            </div>
          </motion.div>

          {/* Fitness Dashboard */}
          <motion.div variants={itemVariants}>
            <FitnessDashboard />
          </motion.div>

          {/* AI Fitness Tools */}
          <motion.div variants={itemVariants}>
            <AIFitnessTools />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}><WorkoutTimer /></motion.div>
            <motion.div variants={itemVariants}><ProgressChart /></motion.div>
          </div>

          {/* Strivo Branding */}
          <motion.div variants={itemVariants} className="text-center py-4">
            <p className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">POWERED BY</p>
            <p className="font-display text-2xl tracking-widest mt-1">
              <span className="text-strivo-red">S</span>TRIVO
            </p>
          </motion.div>

          {/* Motivational */}
          <motion.div variants={itemVariants} className="glass-card text-center py-8 relative overflow-hidden card-3d">
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-strivo-red/5 to-transparent" />
            <p className="font-display text-2xl md:text-3xl tracking-widest relative z-10">
              "THE ONLY BAD WORKOUT IS THE ONE<br />
              <span className="text-strivo-red">THAT DIDN'T HAPPEN</span>"
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
            <QuickLink to="/health" title={t('healthMetrics', lang)} description="BMI, Vitals, Diet Plans" icon={<Heart className="w-6 h-6" />} />
            <QuickLink to="/shop" title={t('gearAndDiet', lang)} description={t('equipment', lang) + ', ' + t('supplements', lang)} icon={<ShoppingBag className="w-6 h-6" />} />
            <QuickLink to="/profile" title={t('profile', lang)} description={t('settings', lang)} icon={<Dumbbell className="w-6 h-6" />} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const FitnessCard = ({ icon, label, value, unit, onClick, actionLabel }: {
  icon: React.ReactNode; label: string; value: string; unit: string; onClick: () => void; actionLabel: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.04, rotateY: 4 }}
    whileTap={{ scale: 0.97 }}
    className="glass-card relative group card-3d"
    style={{ perspective: 800 }}
  >
    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
      {icon}
      <span className="font-display text-xs tracking-wider">{label}</span>
    </div>
    <p className="font-display text-2xl">{value}</p>
    <p className="text-xs text-muted-foreground">{unit}</p>
    {actionLabel && (
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="absolute top-2 right-2 text-xs font-display px-2 py-1 border border-foreground/20 hover:bg-strivo-red hover:text-white hover:border-strivo-red transition-colors opacity-0 group-hover:opacity-100 rounded-full"
      >
        {actionLabel}
      </motion.button>
    )}
  </motion.div>
);

const QuickLink = ({ to, title, description, icon }: { to: string; title: string; description: string; icon: React.ReactNode }) => (
  <Link to={to}>
    <motion.div whileHover={{ scale: 1.03, x: 5, rotateY: 3 }} className="glass-card flex items-center gap-4 group card-3d" style={{ perspective: 800 }}>
      <div className="p-3 border border-foreground/20 group-hover:border-strivo-red/50 group-hover:bg-strivo-red/5 transition-colors rounded-2xl">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-display tracking-wider">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  </Link>
);

const LiveChip = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 border border-foreground/10 rounded-full bg-card whitespace-nowrap shrink-0">
    <span className="text-strivo-red">{icon}</span>
    <span className="text-[8px] font-display tracking-wider text-muted-foreground">{label}</span>
    <span className="text-xs font-display">{value}</span>
  </div>
);

export default Home;
