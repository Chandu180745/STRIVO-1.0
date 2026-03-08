import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Target, TrendingUp, Zap } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useFitnessData } from '@/hooks/useFitnessData';

const CircularProgress = ({ value, max, size = 120, strokeWidth = 8, label, sublabel, color = 'hsl(var(--strivo-red))' }: {
  value: number; max: number; size?: number; strokeWidth?: number; label: string; sublabel?: string; color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--foreground)/0.1)" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          className="font-display text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {label}
        </motion.p>
        {sublabel && <p className="text-[10px] text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
};

const MacroBar = ({ label, current, target, color, unit = 'g' }: {
  label: string; current: number; target: number; color: string; unit?: string;
}) => {
  const pct = Math.min((current / target) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-display tracking-wider">{label}</span>
        <span className="text-xs text-muted-foreground">{current}/{target}{unit}</span>
      </div>
      <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export const FitnessDashboard = () => {
  const settings = useSettings();
  const { todayLog } = useFitnessData();
  const today = todayLog();

  const bmi = useMemo(() => {
    const h = parseFloat(settings.height) / 100;
    const w = parseFloat(settings.weight);
    if (!h || !w) return 0;
    return w / (h * h);
  }, [settings.height, settings.weight]);

  const bmr = useMemo(() => {
    const w = parseFloat(settings.weight);
    const h = parseFloat(settings.height);
    const a = parseInt(settings.age);
    if (!w || !h || !a) return 0;
    if (settings.gender === 'female') return 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    return 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
  }, [settings.weight, settings.height, settings.age, settings.gender]);

  const dailyCalories = useMemo(() => {
    const multipliers: Record<string, number> = {
      'lose-weight': 1.3, 'build-muscle': 1.7, 'stay-fit': 1.55, 'gain-weight': 1.8, 'improve-endurance': 1.6,
    };
    return Math.round(bmr * (multipliers[settings.fitnessGoal] || 1.55));
  }, [bmr, settings.fitnessGoal]);

  const macros = useMemo(() => {
    const w = parseFloat(settings.weight) || 70;
    const proteinPerKg: Record<string, number> = {
      'lose-weight': 2.0, 'build-muscle': 2.2, 'stay-fit': 1.6, 'gain-weight': 2.0, 'improve-endurance': 1.8,
    };
    const protein = Math.round(w * (proteinPerKg[settings.fitnessGoal] || 1.6));
    const fat = Math.round(dailyCalories * 0.25 / 9);
    const carbs = Math.round((dailyCalories - protein * 4 - fat * 9) / 4);
    return { protein, carbs, fat };
  }, [settings.weight, settings.fitnessGoal, dailyCalories]);

  // Fitness score (0-100)
  const fitnessScore = useMemo(() => {
    let score = 50;
    // Streak bonus
    score += Math.min(settings.currentStreak * 2, 20);
    // Activity bonus
    if (today.steps > 5000) score += 10;
    if (today.activeMinutes > 30) score += 10;
    if (today.water >= 8) score += 5;
    // BMI alignment
    if (bmi >= 18.5 && bmi < 25) score += 5;
    return Math.min(score, 100);
  }, [settings.currentStreak, today, bmi]);

  const bmiCategory = bmi < 18.5 ? 'UNDERWEIGHT' : bmi < 25 ? 'NORMAL' : bmi < 30 ? 'OVERWEIGHT' : 'OBESE';
  const bmiIsAlert = bmi < 18.5 || bmi >= 30;

  const cardClass = "glass-card card-3d";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="font-display text-lg tracking-wider flex items-center gap-2">
        <Activity className="w-5 h-5 text-strivo-red" />
        FITNESS DASHBOARD
      </h2>

      {/* Top Row: Fitness Score + BMI + BMR */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          whileHover={{ scale: 1.03, rotateY: 3 }}
          className={`${cardClass} flex flex-col items-center justify-center`}
          style={{ perspective: 800 }}
        >
          <CircularProgress value={fitnessScore} max={100} size={90} label={`${fitnessScore}`} sublabel="SCORE" />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, rotateY: -3 }}
          className={`${cardClass} text-center`}
          style={{ perspective: 800 }}
        >
          <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1">BMI</p>
          <p className={`font-display text-3xl ${bmiIsAlert ? 'text-strivo-red' : ''}`}>{bmi.toFixed(1)}</p>
          <p className={`text-[10px] font-display tracking-wider mt-1 ${bmiIsAlert ? 'text-strivo-red' : 'text-muted-foreground'}`}>{bmiCategory}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03, rotateY: 3 }}
          className={`${cardClass} text-center`}
          style={{ perspective: 800 }}
        >
          <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1">BMR</p>
          <p className="font-display text-2xl">{Math.round(bmr)}</p>
          <p className="text-[10px] text-muted-foreground">kcal/day</p>
        </motion.div>
      </div>

      {/* Daily Calorie Target */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cardClass}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-strivo-red" />
            <span className="text-xs font-display tracking-wider">DAILY CALORIE TARGET</span>
          </div>
          <span className="font-display text-xl text-strivo-red">{dailyCalories} <span className="text-xs text-muted-foreground">kcal</span></span>
        </div>
        <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-strivo-red"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((today.calories / dailyCalories) * 100, 100)}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">{today.calories} / {dailyCalories} kcal consumed</p>
      </motion.div>

      {/* Macro Targets */}
      <motion.div whileHover={{ scale: 1.01 }} className={cardClass}>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-strivo-red" />
          <span className="text-xs font-display tracking-wider">MACRO TARGETS</span>
        </div>
        <div className="space-y-3">
          <MacroBar label="PROTEIN" current={Math.round(today.calories * 0.3 / 4)} target={macros.protein} color="hsl(var(--strivo-red))" />
          <MacroBar label="CARBS" current={Math.round(today.calories * 0.45 / 4)} target={macros.carbs} color="hsl(205 80% 45%)" />
          <MacroBar label="FATS" current={Math.round(today.calories * 0.25 / 9)} target={macros.fat} color="hsl(45 100% 50%)" />
        </div>
      </motion.div>

      {/* Health Indicators */}
      <motion.div whileHover={{ scale: 1.01 }} className={cardClass}>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-strivo-red" />
          <span className="text-xs font-display tracking-wider">HEALTH STATUS</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'BMI STATUS', value: bmiCategory, alert: bmiIsAlert },
            { label: 'METABOLISM', value: bmr > 1600 ? 'HIGH' : bmr > 1300 ? 'MODERATE' : 'LOW', alert: false },
            { label: 'GOAL ALIGN', value: `${Math.min(fitnessScore, 100)}%`, alert: fitnessScore < 40 },
          ].map(({ label, value, alert }) => (
            <div key={label} className={`border p-2 text-center rounded-2xl ${alert ? 'border-strivo-red/40 bg-strivo-red/5' : 'border-foreground/10'}`}>
              <p className="text-[9px] font-display tracking-wider text-muted-foreground">{label}</p>
              <p className={`font-display text-sm ${alert ? 'text-strivo-red' : ''}`}>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
