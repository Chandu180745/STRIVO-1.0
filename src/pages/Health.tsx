import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Heart, Activity, History, UtensilsCrossed, BookOpen, Play, Users, ChevronRight, Dumbbell, Apple, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ASCIIProgressBar } from '@/components/ASCIIProgressBar';
import { HealthStats } from '@/components/HealthStats';
import { WorkoutInfo } from '@/components/WorkoutInfo';
import { CalorieCalculator, BodyFatCalculator, OneRepMaxCalculator } from '@/components/HealthCalculators';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { WaterTracker } from '@/components/WaterTracker';
import { WomensHealth } from '@/components/WomensHealth';
import { NutritionTracker } from '@/components/NutritionTracker';
import { SleepTracker } from '@/components/SleepTracker';
import { WearableIntegration } from '@/components/WearableIntegration';
import { FoodScanner } from '@/components/FoodScanner';
import { BodyTracker } from '@/components/BodyTracker';
import { useSettings } from '@/hooks/useSettings';

interface BMIResult { bmi: number; category: string; isAlert: boolean; }
interface FormData { height: string; weight: string; age: string; }

const calculateBMI = (height: number, weight: number): BMIResult => {
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  let category = '', isAlert = false;
  if (bmi < 18.5) { category = 'UNDERWEIGHT'; isAlert = true; }
  else if (bmi < 25) category = 'NORMAL';
  else if (bmi < 30) category = 'OVERWEIGHT';
  else { category = 'OBESE'; isAlert = true; }
  return { bmi, category, isAlert };
};

const getDietPlan = (category: string): string => {
  const plans: Record<string, string> = {
    UNDERWEIGHT: `> CALORIC SURPLUS REQUIRED\n> DAILY TARGET: +500 kcal above maintenance\n> PROTEIN: 1.8g per kg body weight\n> MEAL FREQUENCY: 5-6 meals/day`,
    NORMAL: `> MAINTAIN CURRENT DIET\n> DAILY TARGET: Maintenance calories\n> PROTEIN: 1.6g per kg body weight\n> MEAL FREQUENCY: 4-5 meals/day`,
    OVERWEIGHT: `> CALORIC DEFICIT REQUIRED\n> DAILY TARGET: -300 kcal below maintenance\n> PROTEIN: 2.0g per kg body weight\n> MEAL FREQUENCY: 3-4 meals/day`,
    OBESE: `> SIGNIFICANT CALORIC DEFICIT REQUIRED\n> DAILY TARGET: -500 kcal below maintenance\n> PROTEIN: 2.2g per kg body weight\n> CONSULT: Medical supervision recommended`,
  };
  return plans[category] || plans.NORMAL;
};

const getWorkoutPlan = (category: string): string => {
  const plans: Record<string, string> = {
    UNDERWEIGHT: `> FOCUS: Strength training for muscle gain\n> FREQUENCY: 4 days/week\n> TYPE: Compound movements`,
    NORMAL: `> FOCUS: Balanced strength and conditioning\n> FREQUENCY: 4-5 days/week\n> TYPE: Mix of compound and isolation`,
    OVERWEIGHT: `> FOCUS: Fat loss with muscle preservation\n> FREQUENCY: 5 days/week\n> TYPE: Circuit training, supersets`,
    OBESE: `> FOCUS: Low-impact cardio, progressive resistance\n> FREQUENCY: 5-6 days/week\n> TYPE: Walking, swimming, resistance bands`,
  };
  return plans[category] || plans.NORMAL;
};

const Health = () => {
  const [formData, setFormData] = useState<FormData>({ height: '', weight: '', age: '' });
  const [result, setResult] = useState<BMIResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { gender } = useSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => { setResult(calculateBMI(parseFloat(formData.height), parseFloat(formData.weight))); setIsCalculating(false); }, 800);
  };

  const handleInputChange = (field: keyof FormData, value: string) => { setFormData(prev => ({ ...prev, [field]: value })); setResult(null); };

  return (
    <div className="min-h-screen pb-24 pixel-grid">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl tracking-wider flex items-center gap-3">
            <Heart className="w-8 h-8 text-strivo-red" /> HEALTH
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-muted-foreground text-sm">Monitor. Analyze. Optimize.</p>
            <Link to="/workout-history">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="terminal-button-outline text-[10px] py-1 px-3 flex items-center gap-1">
                <History className="w-3 h-3" /> HISTORY
              </motion.span>
            </Link>
            <Link to="/meals">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="terminal-button-outline text-[10px] py-1 px-3 flex items-center gap-1">
                <UtensilsCrossed className="w-3 h-3" /> MEAL PLANNER
              </motion.span>
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* BMI Calculator */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card scanline">
              <h2 className="font-display text-lg tracking-wider mb-4 flex items-center gap-2"><Calculator className="w-5 h-5" /> BMI CALCULATOR</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs font-display tracking-wider text-muted-foreground">HEIGHT (cm)</label><input type="number" value={formData.height} onChange={e => handleInputChange('height', e.target.value)} placeholder="175" required className="terminal-input w-full mt-1" /></div>
                  <div><label className="text-xs font-display tracking-wider text-muted-foreground">WEIGHT (kg)</label><input type="number" value={formData.weight} onChange={e => handleInputChange('weight', e.target.value)} placeholder="70" required className="terminal-input w-full mt-1" /></div>
                  <div><label className="text-xs font-display tracking-wider text-muted-foreground">AGE</label><input type="number" value={formData.age} onChange={e => handleInputChange('age', e.target.value)} placeholder="25" required className="terminal-input w-full mt-1" /></div>
                </div>
                <button type="submit" disabled={isCalculating} className="terminal-button w-full">{isCalculating ? 'CALCULATING...' : 'ANALYZE'}</button>
              </form>
            </motion.div>

            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="glass-card text-center">
                  <p className="text-xs font-display tracking-wider text-muted-foreground mb-2">BODY MASS INDEX</p>
                  <p className={`font-display text-6xl ${result.isAlert ? 'alert-text' : ''}`}>{result.bmi.toFixed(1)}</p>
                  <p className={`font-display text-xl tracking-widest mt-2 ${result.isAlert ? 'alert-text' : ''}`}>{result.category}</p>
                </div>
                <div className="glass-card space-y-4">
                  <ASCIIProgressBar label="UNDERWEIGHT" value={result.bmi < 18.5 ? 100 : 0} max={100} isAlert={result.category === 'UNDERWEIGHT'} />
                  <ASCIIProgressBar label="NORMAL" value={result.bmi >= 18.5 && result.bmi < 25 ? 100 : 0} max={100} />
                  <ASCIIProgressBar label="OVERWEIGHT" value={result.bmi >= 25 && result.bmi < 30 ? 100 : 0} max={100} />
                  <ASCIIProgressBar label="OBESE" value={result.bmi >= 30 ? 100 : 0} max={100} isAlert={result.category === 'OBESE'} />
                </div>
                <div className="glass-card"><h3 className="font-display text-sm tracking-wider text-muted-foreground mb-3">RECOMMENDED DIET PLAN</h3><pre className="font-mono text-xs whitespace-pre-wrap text-foreground/80 bg-muted/30 p-4 border border-foreground/10">{getDietPlan(result.category)}</pre></div>
                <div className="glass-card"><h3 className="font-display text-sm tracking-wider text-muted-foreground mb-3">WORKOUT PROTOCOL</h3><pre className="font-mono text-xs whitespace-pre-wrap text-foreground/80 bg-muted/30 p-4 border border-foreground/10">{getWorkoutPlan(result.category)}</pre></div>
              </motion.div>
            )}

            {/* Sleep Tracker */}
            <SleepTracker />

            {/* Wearable Integration */}
            <WearableIntegration />

            {/* Body Tracker */}
            <BodyTracker />

            {/* Women's Health (only for female users) */}
            {gender === 'female' && <WomensHealth />}
          </div>

          <div className="space-y-6">
            <FoodScanner />
            <NutritionTracker />
            <WorkoutLogger />
            <WaterTracker />
            <HealthStats />
            <CalorieCalculator />
            <BodyFatCalculator />
            <OneRepMaxCalculator />
            <WorkoutInfo />
          </div>
        </div>

        {/* Health Education Hub */}
        <HealthEducationHub />
      </div>
    </div>
  );
};

/* ─── Health Education Hub ─── */
const articles = [
  { title: 'Muscle Building Science', desc: 'Progressive overload, hypertrophy rep ranges, and recovery windows explained.', icon: Dumbbell, tag: 'SCIENCE' },
  { title: 'Fat Loss Strategies', desc: 'Evidence-based caloric deficit approaches, NEAT, and metabolic adaptation.', icon: Activity, tag: 'GUIDE' },
  { title: 'Nutrition Myths Debunked', desc: 'Meal timing, "clean" eating, and supplement claims fact-checked.', icon: Apple, tag: 'MYTHS' },
];

const videos = [
  { title: 'Exercise Form Guide', desc: 'Squat, deadlift, bench press – avoid injury with proper technique.', duration: '12:30', views: '45K' },
  { title: 'Meal Prep Masterclass', desc: 'Batch cook a full week of balanced meals in 2 hours.', duration: '18:45', views: '32K' },
  { title: 'Recovery & Mobility', desc: 'Foam rolling, stretching routines, and active recovery days.', duration: '9:15', views: '28K' },
];

const experts = [
  { name: 'Dr. Sarah Chen', role: 'Sports Nutritionist', topic: 'Macro periodization for athletes', icon: Apple },
  { name: 'Coach Mike Torres', role: 'Strength Trainer', topic: 'Periodization & progressive overload', icon: Dumbbell },
  { name: 'Dr. Raj Patel', role: 'Sports Medicine', topic: 'Injury prevention & rehab protocols', icon: Stethoscope },
];

const HealthEducationHub = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'experts'>('articles');
  const tabs = [
    { id: 'articles' as const, label: 'ARTICLES', icon: BookOpen },
    { id: 'videos' as const, label: 'TUTORIALS', icon: Play },
    { id: 'experts' as const, label: 'EXPERTS', icon: Users },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
      <h2 className="font-display text-2xl tracking-wider mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-strivo-red" /> HEALTH EDUCATION HUB
      </h2>
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-display tracking-wider border transition-colors rounded-full ${
              activeTab === t.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 hover:border-foreground/40'
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'articles' && (
          <motion.div key="articles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {articles.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card flex items-start gap-3 group hover:border-foreground/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-strivo-red/10 border border-strivo-red/20 flex items-center justify-center shrink-0 rounded-full">
                  <a.icon className="w-5 h-5 text-strivo-red" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm tracking-wider">{a.title}</h3>
                    <span className="px-1.5 py-0.5 text-[8px] font-display bg-muted border border-foreground/10 rounded-full">{a.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'videos' && (
          <motion.div key="videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {videos.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card flex items-start gap-3 group hover:border-foreground/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-strivo-red/10 border border-strivo-red/20 flex items-center justify-center shrink-0 rounded-full">
                  <Play className="w-5 h-5 text-strivo-red" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm tracking-wider">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-[9px] font-display text-muted-foreground">⏱ {v.duration}</span>
                    <span className="text-[9px] font-display text-muted-foreground">👁 {v.views} views</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'experts' && (
          <motion.div key="experts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {experts.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card flex items-start gap-3 group hover:border-foreground/30 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-strivo-red/10 border border-strivo-red/20 flex items-center justify-center shrink-0 rounded-full">
                  <e.icon className="w-5 h-5 text-strivo-red" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm tracking-wider">{e.name}</h3>
                  <p className="text-[10px] font-display text-strivo-red">{e.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">Topic: {e.topic}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Health;
