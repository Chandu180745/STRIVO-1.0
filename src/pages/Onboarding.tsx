import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Target, Dumbbell, Activity, CheckCircle2, Sparkles } from 'lucide-react';
import { useSettings, type Gender, type FitnessGoal, type ExperienceLevel, type WorkoutStyle } from '@/hooks/useSettings';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const genderOptions: { id: Gender; label: string; emoji: string }[] = [
  { id: 'male', label: 'MALE', emoji: '♂' },
  { id: 'female', label: 'FEMALE', emoji: '♀' },
  { id: 'other', label: 'OTHER', emoji: '⚧' },
];

const goalOptions: { id: FitnessGoal; label: string; emoji: string; desc: string }[] = [
  { id: 'lose-weight', label: 'WEIGHT LOSS', emoji: '🔥', desc: 'Burn fat & get lean' },
  { id: 'build-muscle', label: 'MUSCLE GAIN', emoji: '💪', desc: 'Build mass & strength' },
  { id: 'stay-fit', label: 'GENERAL FITNESS', emoji: '🏃', desc: 'Stay healthy & active' },
  { id: 'gain-weight', label: 'STRENGTH TRAINING', emoji: '🏋️', desc: 'Increase raw power' },
  { id: 'improve-endurance', label: 'ENDURANCE', emoji: '🫀', desc: 'Boost stamina & cardio' },
];

const experienceOptions: { id: ExperienceLevel; label: string; emoji: string; desc: string }[] = [
  { id: 'beginner', label: 'BEGINNER', emoji: '🌱', desc: 'New to fitness, < 6 months' },
  { id: 'intermediate', label: 'INTERMEDIATE', emoji: '⚡', desc: '6 months - 2 years experience' },
  { id: 'advanced', label: 'ADVANCED', emoji: '🔥', desc: '2+ years consistent training' },
];

const workoutStyleOptions: { id: WorkoutStyle; label: string; emoji: string }[] = [
  { id: 'gym', label: 'GYM WORKOUTS', emoji: '🏋️' },
  { id: 'home', label: 'HOME WORKOUTS', emoji: '🏠' },
  { id: 'yoga', label: 'YOGA', emoji: '🧘' },
  { id: 'crossfit', label: 'CROSSFIT', emoji: '💥' },
];

const TOTAL_STEPS = 5;

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }),
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<WorkoutStyle[]>([]);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const settings = useSettings();
  const { setMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const nextStep = () => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); };
  const prevStep = () => { setDirection(-1); setStep(s => Math.max(s - 1, 1)); };

  const toggleStyle = (s: WorkoutStyle) => {
    setSelectedStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedGoal;
      case 2: return !!age && !!height && !!weight;
      case 3: return !!selectedExperience;
      case 4: return selectedStyles.length > 0;
      case 5: return true;
      default: return false;
    }
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return 0;
    return w / (h * h);
  };

  const calculateBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (!w || !h || !a) return 0;
    if (selectedGender === 'female') return 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    return 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
  };

  const getDailyCalories = () => {
    const bmr = calculateBMR();
    const multipliers: Record<FitnessGoal, number> = {
      'lose-weight': 1.3,
      'build-muscle': 1.7,
      'stay-fit': 1.55,
      'gain-weight': 1.8,
      'improve-endurance': 1.6,
    };
    return Math.round(bmr * (multipliers[selectedGoal || 'stay-fit'] || 1.55));
  };

  const handleComplete = () => {
    if (selectedGender) settings.setGender(selectedGender);
    if (selectedGoal) settings.setFitnessGoal(selectedGoal);
    if (selectedExperience) settings.setExperienceLevel(selectedExperience);
    settings.setPreferredWorkoutStyles(selectedStyles);
    settings.setAge(age);
    settings.setHeight(height);
    settings.setWeight(weight);
    settings.setBodyFatPercentage(bodyFat);
    settings.setOnboardingComplete(true);
    // Save auth ID so we know this user completed onboarding
    if (user?.id) settings.setLastAuthId(user.id);
    // Add initial weight entry
    if (weight) {
      settings.addWeightEntry({ date: new Date().toISOString().split('T')[0], weight: parseFloat(weight) });
    }
    if (selectedGender === 'female') setMode('pink');
    navigate('/');
  };

  return (
    <div className="min-h-screen pixel-grid flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-lg"
        style={{ perspective: 1000 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-display text-4xl tracking-widest"
          >
            <span className="text-strivo-red">S</span>TRIVO
          </motion.h1>
          <p className="text-sm text-muted-foreground mt-2">Let's build your fitness profile</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-foreground/10"
              initial={false}
            >
              <motion.div
                className="h-full bg-strivo-red rounded-full"
                initial={{ width: 0 }}
                animate={{ width: step > i ? '100%' : step === i + 1 ? '50%' : '0%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mb-4 font-display tracking-wider">
          STEP {step} OF {TOTAL_STEPS}
        </p>

        {/* Card */}
        <div className="glass-card relative overflow-hidden min-h-[380px]">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Fitness Goal */}
            {step === 1 && (
              <motion.div key="s1" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-strivo-red" />
                  <h2 className="font-display text-lg tracking-wider">YOUR FITNESS GOAL</h2>
                </div>
                <div className="space-y-2">
                  {goalOptions.map(g => (
                    <motion.button
                      key={g.id}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`w-full py-3 px-4 text-left border-2 transition-all flex items-center gap-3 rounded-2xl ${
                        selectedGoal === g.id
                          ? 'border-strivo-red bg-strivo-red/10 shadow-[0_0_20px_hsl(var(--strivo-red)/0.2)]'
                          : 'border-foreground/15 hover:border-foreground/30'
                      }`}
                    >
                      <span className="text-2xl">{g.emoji}</span>
                      <div>
                        <p className="font-display text-sm tracking-wider">{g.label}</p>
                        <p className="text-xs text-muted-foreground">{g.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Personal Info */}
            {step === 2 && (
              <motion.div key="s2" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-strivo-red" />
                  <h2 className="font-display text-lg tracking-wider">PERSONAL INFO</h2>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-xs font-display tracking-wider text-muted-foreground">GENDER</label>
                  <div className="flex gap-2 mt-1">
                    {genderOptions.map(g => (
                      <motion.button
                        key={g.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedGender(g.id)}
                        className={`flex-1 py-3 font-display tracking-wider border-2 transition-all rounded-2xl ${
                          selectedGender === g.id ? 'border-strivo-red bg-strivo-red/10' : 'border-foreground/15 hover:border-foreground/30'
                        }`}
                      >
                        <span className="text-lg">{g.emoji}</span>
                        <p className="text-xs mt-1">{g.label}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-display tracking-wider text-muted-foreground">AGE</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className="terminal-input w-full mt-1 text-sm py-2" />
                  </div>
                  <div>
                    <label className="text-xs font-display tracking-wider text-muted-foreground">HEIGHT (cm)</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" className="terminal-input w-full mt-1 text-sm py-2" />
                  </div>
                  <div>
                    <label className="text-xs font-display tracking-wider text-muted-foreground">WEIGHT (kg)</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" className="terminal-input w-full mt-1 text-sm py-2" />
                  </div>
                  <div>
                    <label className="text-xs font-display tracking-wider text-muted-foreground">BODY FAT % <span className="text-muted-foreground/50">(optional)</span></label>
                    <input type="number" value={bodyFat} onChange={e => setBodyFat(e.target.value)} placeholder="15" className="terminal-input w-full mt-1 text-sm py-2" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Experience Level */}
            {step === 3 && (
              <motion.div key="s3" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-strivo-red" />
                  <h2 className="font-display text-lg tracking-wider">EXPERIENCE LEVEL</h2>
                </div>
                <div className="space-y-3">
                  {experienceOptions.map(e => (
                    <motion.button
                      key={e.id}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedExperience(e.id)}
                      className={`w-full py-4 px-4 text-left border-2 transition-all flex items-center gap-4 rounded-2xl ${
                        selectedExperience === e.id
                          ? 'border-strivo-red bg-strivo-red/10 shadow-[0_0_20px_hsl(var(--strivo-red)/0.2)]'
                          : 'border-foreground/15 hover:border-foreground/30'
                      }`}
                    >
                      <span className="text-3xl">{e.emoji}</span>
                      <div>
                        <p className="font-display tracking-wider">{e.label}</p>
                        <p className="text-xs text-muted-foreground">{e.desc}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Workout Style */}
            {step === 4 && (
              <motion.div key="s4" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Dumbbell className="w-5 h-5 text-strivo-red" />
                  <h2 className="font-display text-lg tracking-wider">WORKOUT STYLE</h2>
                </div>
                <p className="text-xs text-muted-foreground">Select one or more</p>
                <div className="grid grid-cols-2 gap-3">
                  {workoutStyleOptions.map(s => (
                    <motion.button
                      key={s.id}
                      whileHover={{ scale: 1.05, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleStyle(s.id)}
                      className={`py-6 px-4 border-2 transition-all text-center rounded-2xl ${
                        selectedStyles.includes(s.id)
                          ? 'border-strivo-red bg-strivo-red/10 shadow-[0_0_20px_hsl(var(--strivo-red)/0.2)]'
                          : 'border-foreground/15 hover:border-foreground/30'
                      }`}
                      style={{ perspective: 800 }}
                    >
                      <span className="text-4xl block mb-2">{s.emoji}</span>
                      <p className="font-display text-xs tracking-wider">{s.label}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation / Baseline */}
            {step === 5 && (
              <motion.div key="s5" custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-strivo-red" />
                  <h2 className="font-display text-lg tracking-wider">YOUR FITNESS BASELINE</h2>
                </div>

                <div className="space-y-3">
                  {/* BMI */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border border-foreground/15 p-3 flex items-center justify-between rounded-2xl"
                  >
                    <span className="text-xs font-display tracking-wider text-muted-foreground">BMI</span>
                    <span className="font-display text-xl text-strivo-red">{calculateBMI().toFixed(1)}</span>
                  </motion.div>

                  {/* BMR */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="border border-foreground/15 p-3 flex items-center justify-between rounded-2xl"
                  >
                    <span className="text-xs font-display tracking-wider text-muted-foreground">BMR</span>
                    <span className="font-display text-xl">{Math.round(calculateBMR())} <span className="text-xs text-muted-foreground">kcal/day</span></span>
                  </motion.div>

                  {/* Daily Calories */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="border border-foreground/15 p-3 flex items-center justify-between rounded-2xl"
                  >
                    <span className="text-xs font-display tracking-wider text-muted-foreground">DAILY TARGET</span>
                    <span className="font-display text-xl text-strivo-red">{getDailyCalories()} <span className="text-xs text-muted-foreground">kcal</span></span>
                  </motion.div>

                  {/* Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="border border-strivo-red/30 bg-strivo-red/5 p-3 space-y-1 rounded-2xl"
                  >
                    <p className="text-xs text-muted-foreground">
                      <span className="text-foreground font-display">{selectedGender?.toUpperCase() || 'N/A'}</span> • {age}yr • {height}cm • {weight}kg
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Goal: <span className="text-strivo-red font-display">{goalOptions.find(g => g.id === selectedGoal)?.label}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Level: <span className="text-foreground font-display">{selectedExperience?.toUpperCase()}</span> • {selectedStyles.map(s => workoutStyleOptions.find(ws => ws.id === s)?.label).join(', ')}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-2 mt-6">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevStep}
                className="terminal-button-outline flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> BACK
              </motion.button>
            )}
            {step < TOTAL_STEPS ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                disabled={!canProceed()}
                className="terminal-button flex-1 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                NEXT <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="terminal-button flex-1 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> LET'S GO
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
