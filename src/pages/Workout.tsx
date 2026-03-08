import { useState, useMemo, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Search, Filter, ChevronRight, X, Play, Clock, Flame, Target, Zap, Calendar, Plus, Trash2, Check, Timer, Award, TrendingUp, Swords, Users, Trophy } from 'lucide-react';
import { WorkoutDemo } from '@/components/WorkoutDemo';
import { exercises, muscleGroups, preBuiltPlans, getExerciseById, type Exercise } from '@/lib/exerciseLibrary';
import { useSettings } from '@/hooks/useSettings';
import { useFitnessData } from '@/hooks/useFitnessData';
import { toast } from 'sonner';

const Progress = lazy(() => import('@/pages/Progress'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const Community = lazy(() => import('@/pages/Community'));
const Achievements = lazy(() => import('@/pages/Achievements'));

type Tab = 'library' | 'plans' | 'log' | 'analytics' | 'progress' | 'challenges' | 'community' | 'achievements';

const diffBadgeColor: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const Workout = () => {
  const [tab, setTab] = useState<Tab>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Live exercise state
  const [liveMode, setLiveMode] = useState(false);
  const [liveSet, setLiveSet] = useState(1);
  const [liveTotalSets, setLiveTotalSets] = useState(3);
  const [liveReps, setLiveReps] = useState(12);
  const [liveCountdown, setLiveCountdown] = useState(0);
  const [livePhase, setLivePhase] = useState<'ready' | 'exercise' | 'rest' | 'done'>('ready');
  const [liveTimerRunning, setLiveTimerRunning] = useState(false);
  const [liveRestTime] = useState(10);

  // Workout logging state
  const [logExercises, setLogExercises] = useState<{ exerciseId: string; sets: { reps: number; weight: number }[] }[]>([]);
  const [restTimer, setRestTimer] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutStart, setWorkoutStart] = useState<number | null>(null);

  const settings = useSettings();
  const { addActiveMinutes, addCalories } = useFitnessData();

  // Filtered exercises
  const filtered = useMemo(() => {
    return exercises.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMuscle = filterMuscle === 'all' || e.muscleGroup === filterMuscle;
      const matchDiff = filterDifficulty === 'all' || e.difficulty === filterDifficulty;
      const matchLoc = filterLocation === 'all' ||
        (filterLocation === 'home' && e.isHome) ||
        (filterLocation === 'gym' && e.isGym);
      return matchSearch && matchMuscle && matchDiff && matchLoc;
    });
  }, [searchQuery, filterMuscle, filterDifficulty, filterLocation]);

  // Rest timer
  const startRest = (seconds: number) => {
    setRestTimer(seconds);
    setRestRunning(true);
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setRestRunning(false);
          toast.success('Rest complete! Go again! 💪');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Live exercise countdown
  useEffect(() => {
    if (!liveTimerRunning || liveCountdown <= 0) return;
    const interval = setInterval(() => {
      setLiveCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setLiveTimerRunning(false);
          if (livePhase === 'exercise') {
            if (liveSet < liveTotalSets) {
              setLivePhase('rest');
              setLiveCountdown(liveRestTime);
              setTimeout(() => setLiveTimerRunning(true), 100);
            } else {
              setLivePhase('done');
              settings.recordActivity();
              settings.addXP(50);
              settings.incrementWorkouts();
              toast.success('Exercise complete! 🎉 +50 XP');
            }
          } else if (livePhase === 'rest') {
            setLiveSet(prev => prev + 1);
            setLivePhase('exercise');
            setLiveCountdown(liveReps * 3); // ~3s per rep
            setTimeout(() => setLiveTimerRunning(true), 100);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [liveTimerRunning, liveCountdown, livePhase, liveSet, liveTotalSets, liveReps, liveRestTime]);

  const startLiveExercise = useCallback(() => {
    setLiveMode(true);
    setLiveSet(1);
    setLivePhase('exercise');
    setLiveCountdown(liveReps * 3);
    setLiveTimerRunning(true);
  }, [liveReps]);

  const resetLive = useCallback(() => {
    setLiveMode(false);
    setLiveSet(1);
    setLivePhase('ready');
    setLiveCountdown(0);
    setLiveTimerRunning(false);
  }, []);

  // 1RM Calculator
  const calculate1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  };

  // Start workout
  const startWorkout = () => {
    setWorkoutActive(true);
    setWorkoutStart(Date.now());
    setLogExercises([]);
    toast.success('Workout started! Let\'s go! 🔥');
  };

  // Add exercise to log
  const addExerciseToLog = (exerciseId: string) => {
    setLogExercises(prev => [...prev, { exerciseId, sets: [{ reps: 0, weight: 0 }] }]);
  };

  // Add set to exercise
  const addSet = (exerciseIndex: number) => {
    setLogExercises(prev => {
      const updated = [...prev];
      updated[exerciseIndex].sets.push({ reps: 0, weight: 0 });
      return updated;
    });
  };

  // Update set
  const updateSet = (exIdx: number, setIdx: number, field: 'reps' | 'weight', value: number) => {
    setLogExercises(prev => {
      const updated = [...prev];
      updated[exIdx].sets[setIdx][field] = value;
      return updated;
    });
  };

  // Remove exercise from log
  const removeFromLog = (idx: number) => {
    setLogExercises(prev => prev.filter((_, i) => i !== idx));
  };

  // Finish workout
  const finishWorkout = () => {
    if (!workoutStart) return;
    const durationMin = Math.round((Date.now() - workoutStart) / 60000);
    const totalSets = logExercises.reduce((s, e) => s + e.sets.filter(s => s.reps > 0).length, 0);
    const totalVolume = logExercises.reduce((v, e) =>
      v + e.sets.reduce((sv, s) => sv + s.reps * s.weight, 0), 0);
    const estCalories = totalSets * 8 + durationMin * 5;

    addActiveMinutes(durationMin);
    addCalories(estCalories);
    settings.recordActivity();

    toast.success(`Workout complete! ${durationMin}min, ${totalSets} sets, ${totalVolume}kg volume, ~${estCalories}kcal`);
    setWorkoutActive(false);
    setWorkoutStart(null);
    setLogExercises([]);
  };

  const containerV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };
  const itemV = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } },
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'library', label: 'LIBRARY', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'plans', label: 'PLANS', icon: <Calendar className="w-4 h-4" /> },
    { id: 'log', label: 'LOG', icon: <Play className="w-4 h-4" /> },
    { id: 'analytics', label: 'ANALYTICS', icon: <Zap className="w-4 h-4" /> },
    { id: 'progress', label: 'PROGRESS', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'challenges', label: 'CHALLENGES', icon: <Swords className="w-4 h-4" /> },
    { id: 'community', label: 'COMMUNITY', icon: <Users className="w-4 h-4" /> },
    { id: 'achievements', label: 'BADGES', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pb-24 pixel-grid">
      <div className="container py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-4xl tracking-wider flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-strivo-red" /> WORKOUT
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {exercises.length} exercises • {preBuiltPlans.length} programs
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-display text-xs tracking-wider border-2 transition-all whitespace-nowrap touch-press rounded-full ${
                tab === t.id ? 'bg-strivo-red text-white border-strivo-red shadow-[0_0_20px_hsl(var(--strivo-red)/0.3)]' : 'border-foreground/15 hover:border-foreground/30'
              }`}
            >
              {t.icon} {t.label}
            </motion.button>
          ))}
        </motion.div>

        {/* EXERCISE LIBRARY TAB */}
        {tab === 'library' && (
          <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-4">
            {/* Search */}
            <motion.div variants={itemV} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search exercises..."
                  className="terminal-input w-full pl-10 py-2 text-sm"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 border-2 transition-all rounded-full ${showFilters ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/15'}`}
              >
                <Filter className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card space-y-3">
                    <div>
                      <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1.5">MUSCLE GROUP</p>
                      <div className="flex gap-1 flex-wrap">
                        <FilterChip label="ALL" active={filterMuscle === 'all'} onClick={() => setFilterMuscle('all')} />
                        {muscleGroups.map(mg => (
                          <FilterChip key={mg} label={mg.toUpperCase()} active={filterMuscle === mg} onClick={() => setFilterMuscle(mg)} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1.5">DIFFICULTY</p>
                      <div className="flex gap-1">
                        <FilterChip label="ALL" active={filterDifficulty === 'all'} onClick={() => setFilterDifficulty('all')} />
                        <FilterChip label="BEGINNER" active={filterDifficulty === 'beginner'} onClick={() => setFilterDifficulty('beginner')} />
                        <FilterChip label="INTERMEDIATE" active={filterDifficulty === 'intermediate'} onClick={() => setFilterDifficulty('intermediate')} />
                        <FilterChip label="ADVANCED" active={filterDifficulty === 'advanced'} onClick={() => setFilterDifficulty('advanced')} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1.5">LOCATION</p>
                      <div className="flex gap-1">
                        <FilterChip label="ALL" active={filterLocation === 'all'} onClick={() => setFilterLocation('all')} />
                        <FilterChip label="HOME" active={filterLocation === 'home'} onClick={() => setFilterLocation('home')} />
                        <FilterChip label="GYM" active={filterLocation === 'gym'} onClick={() => setFilterLocation('gym')} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results count */}
            <motion.p variants={itemV} className="text-xs text-muted-foreground font-display">
              {filtered.length} EXERCISES FOUND
            </motion.p>

            {/* Exercise Grid */}
            <div className="grid md:grid-cols-2 gap-2">
              {filtered.map((ex, i) => (
                <motion.button
                  key={ex.id}
                  variants={itemV}
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedExercise(ex)}
                  className="glass-card card-3d text-left flex items-center gap-3 group w-full"
                  style={{ perspective: 800 }}
                >
                  <div className="w-10 h-10 rounded bg-strivo-red/10 flex items-center justify-center border border-strivo-red/20 shrink-0">
                    <Dumbbell className="w-5 h-5 text-strivo-red" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm tracking-wider truncate">{ex.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-muted-foreground capitalize">{ex.muscleGroup}</span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-display border rounded-full ${diffBadgeColor[ex.difficulty]}`}>
                        {ex.difficulty.toUpperCase()}
                      </span>
                      {ex.isHome && <span className="text-[8px] text-muted-foreground">🏠</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PLANS TAB */}
        {tab === 'plans' && (
          <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-4">
            <motion.p variants={itemV} className="text-xs text-muted-foreground font-display">
              PRE-BUILT PROGRAMS FOR EVERY GOAL
            </motion.p>
            {preBuiltPlans.map(plan => (
              <motion.div key={plan.id} variants={itemV}>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                  className="glass-card card-3d w-full text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-strivo-red/10 flex items-center justify-center border border-strivo-red/20">
                        <Target className="w-5 h-5 text-strivo-red" />
                      </div>
                      <div>
                        <p className="font-display tracking-wider">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.description}</p>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: selectedPlan === plan.id ? 90 : 0 }}>
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                  <div className="flex gap-2 text-[10px] font-display tracking-wider">
                    <span className={`px-2 py-0.5 border ${diffBadgeColor[plan.difficulty]}`}>{plan.difficulty.toUpperCase()}</span>
                    <span className="px-2 py-0.5 border border-foreground/20">{plan.duration}</span>
                    <span className="px-2 py-0.5 border border-foreground/20">{plan.frequency}</span>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {selectedPlan === plan.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-2 space-y-2 border-l-2 border-strivo-red/30 pl-4">
                        {plan.days.map((day, di) => (
                          <div key={di} className="glass-card">
                            <p className="font-display text-xs tracking-wider text-strivo-red mb-2">{day.name}</p>
                            <div className="space-y-1">
                              {day.exercises.map(eid => {
                                const ex = getExerciseById(eid);
                                if (!ex) return null;
                                return (
                                  <div key={eid} className="flex items-center gap-2 py-1 text-xs">
                                    <Dumbbell className="w-3 h-3 text-muted-foreground" />
                                    <span className="font-display tracking-wider">{ex.name}</span>
                                    <span className="text-muted-foreground ml-auto capitalize text-[9px]">{ex.muscleGroup}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* WORKOUT LOG TAB */}
        {tab === 'log' && (
          <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-4">
            {!workoutActive ? (
              <motion.div variants={itemV} className="text-center py-12">
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                  style={{ perspective: 800 }}
                >
                  <button onClick={startWorkout} className="glass-card card-3d glass-glow px-8 py-6">
                    <Play className="w-12 h-12 text-strivo-red mx-auto mb-3" />
                    <p className="font-display text-xl tracking-wider">START WORKOUT</p>
                    <p className="text-xs text-muted-foreground mt-1">Begin tracking your session</p>
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <>
                {/* Active workout header */}
                <motion.div variants={itemV} className="glass-card border-l-4 border-strivo-red flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-strivo-red rounded-full animate-pulse" />
                    <div>
                      <p className="font-display text-sm tracking-wider">WORKOUT IN PROGRESS</p>
                      <p className="text-xs text-muted-foreground">
                        {workoutStart && `${Math.floor((Date.now() - workoutStart) / 60000)} min`} • {logExercises.length} exercises
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={finishWorkout}
                    className="terminal-button text-xs py-2 px-4"
                  >
                    <Check className="w-4 h-4 inline mr-1" /> FINISH
                  </motion.button>
                </motion.div>

                {/* Rest timer */}
                {restRunning && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card text-center glass-glow"
                  >
                    <Timer className="w-6 h-6 text-strivo-red mx-auto mb-1" />
                    <p className="font-display text-4xl text-strivo-red">{restTimer}s</p>
                    <p className="text-xs text-muted-foreground font-display">REST</p>
                  </motion.div>
                )}

                {/* Add exercise */}
                <motion.div variants={itemV}>
                  <p className="text-xs font-display tracking-wider text-muted-foreground mb-2">ADD EXERCISE</p>
                  <div className="flex gap-1 flex-wrap">
                    {muscleGroups.map(mg => (
                      <motion.button
                        key={mg}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const exs = exercises.filter(e => e.muscleGroup === mg);
                          if (exs.length > 0) addExerciseToLog(exs[0].id);
                        }}
                        className="px-2 py-1.5 text-[9px] font-display border border-foreground/15 hover:border-strivo-red/40 hover:bg-strivo-red/5 transition-all capitalize touch-press"
                      >
                        + {mg}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Logged exercises */}
                {logExercises.map((logEx, exIdx) => {
                  const ex = getExerciseById(logEx.exerciseId);
                  if (!ex) return null;
                  return (
                    <motion.div
                      key={exIdx}
                      variants={itemV}
                      className="glass-card card-3d"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-4 h-4 text-strivo-red" />
                          <span className="font-display text-sm tracking-wider">{ex.name}</span>
                        </div>
                        <button onClick={() => removeFromLog(exIdx)} className="p-1 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Sets */}
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-4 gap-2 text-[9px] font-display tracking-wider text-muted-foreground">
                          <span>SET</span><span>REPS</span><span>WEIGHT</span><span>1RM</span>
                        </div>
                        {logEx.sets.map((set, setIdx) => (
                          <div key={setIdx} className="grid grid-cols-4 gap-2 items-center">
                            <span className="text-xs font-display text-muted-foreground">{setIdx + 1}</span>
                            <input
                              type="number"
                              value={set.reps || ''}
                              onChange={e => updateSet(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="terminal-input text-xs py-1.5 px-2"
                            />
                            <input
                              type="number"
                              value={set.weight || ''}
                              onChange={e => updateSet(exIdx, setIdx, 'weight', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="terminal-input text-xs py-1.5 px-2"
                            />
                            <span className="text-xs font-display text-muted-foreground">
                              {set.reps > 0 && set.weight > 0 ? `${calculate1RM(set.weight, set.reps)}kg` : '-'}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-2">
                        <motion.button whileTap={{ scale: 0.95 }} onClick={() => addSet(exIdx)}
                          className="text-[10px] font-display px-2 py-1 border border-foreground/20 hover:border-strivo-red/40 touch-press">
                          + SET
                        </motion.button>
                        {!restRunning && (
                          <div className="flex gap-1">
                            {[30, 60, 90, 120].map(s => (
                              <motion.button key={s} whileTap={{ scale: 0.9 }} onClick={() => startRest(s)}
                                className="text-[10px] font-display px-2 py-1 border border-foreground/20 hover:bg-strivo-red/10 touch-press">
                                {s}s
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {logExercises.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="font-display text-sm">TAP A MUSCLE GROUP TO ADD EXERCISES</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {tab === 'analytics' && (
          <motion.div variants={containerV} initial="hidden" animate="visible" className="space-y-4">
            {/* 1RM Calculator */}
            <motion.div variants={itemV} className="glass-card card-3d">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-strivo-red" />
                <span className="font-display tracking-wider">1RM CALCULATOR</span>
              </div>
              <OneRMCalculator />
            </motion.div>

            {/* Volume Summary */}
            <motion.div variants={itemV} className="glass-card card-3d">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-strivo-red" />
                <span className="font-display tracking-wider">TRAINING STATS</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <StatBox label="CURRENT STREAK" value={`${settings.currentStreak}`} unit="days" />
                <StatBox label="LONGEST STREAK" value={`${settings.longestStreak}`} unit="days" />
                <StatBox label="REWARD POINTS" value={`${settings.rewardPoints}`} unit="pts" />
                <StatBox label="BADGES EARNED" value={`${settings.badges.length}`} unit="badges" />
              </div>
            </motion.div>

            {/* Training Tips */}
            <motion.div variants={itemV} className="glass-card card-3d border-l-4 border-strivo-red">
              <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-2">💡 TRAINING TIP</p>
              <p className="text-sm font-display tracking-wider">
                {settings.fitnessGoal === 'build-muscle'
                  ? 'For muscle growth, aim for 10-20 sets per muscle group per week with 8-12 reps.'
                  : settings.fitnessGoal === 'lose-weight'
                  ? 'Combine resistance training with 20-30min cardio 3-4x per week for optimal fat loss.'
                  : 'Progressive overload is key — increase weight, reps, or sets each week.'}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* PROGRESS TAB */}
        {tab === 'progress' && (
          <Suspense fallback={<div className="text-center py-12 font-display text-sm tracking-wider text-muted-foreground">LOADING...</div>}>
            <Progress />
          </Suspense>
        )}

        {/* CHALLENGES TAB */}
        {tab === 'challenges' && (
          <Suspense fallback={<div className="text-center py-12 font-display text-sm tracking-wider text-muted-foreground">LOADING...</div>}>
            <Challenges />
          </Suspense>
        )}

        {/* COMMUNITY TAB */}
        {tab === 'community' && (
          <Suspense fallback={<div className="text-center py-12 font-display text-sm tracking-wider text-muted-foreground">LOADING...</div>}>
            <Community />
          </Suspense>
        )}

        {/* ACHIEVEMENTS TAB */}
        {tab === 'achievements' && (
          <Suspense fallback={<div className="text-center py-12 font-display text-sm tracking-wider text-muted-foreground">LOADING...</div>}>
            <Achievements />
          </Suspense>
        )}

        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
              onClick={() => { setSelectedExercise(null); resetLive(); }}
            >
              <motion.div
                initial={{ y: 100, scale: 0.95, rotateX: 5 }}
                animate={{ y: 0, scale: 1, rotateX: 0 }}
                exit={{ y: 100, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto border-2 border-foreground/20"
                style={{ perspective: 1000 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg tracking-wider">{selectedExercise.name}</h3>
                  <button onClick={() => { setSelectedExercise(null); resetLive(); }} className="p-1"><X className="w-5 h-5" /></button>
                </div>

                {/* Animated Demo */}
                <div className="mb-4">
                  <WorkoutDemo exerciseName={selectedExercise.name} muscleGroup={selectedExercise.muscleGroup} />
                </div>

                {/* Live Exercise Mode */}
                <div className="mb-4 glass-card border border-strivo-red/20 bg-strivo-red/5">
                  {!liveMode ? (
                    <div className="space-y-3">
                      <p className="text-[10px] font-display tracking-wider text-strivo-red flex items-center gap-1">
                        <Play className="w-3 h-3" /> LIVE EXERCISE MODE
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-display text-muted-foreground">SETS</label>
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => setLiveTotalSets(Math.max(1, liveTotalSets - 1))} className="p-1 border border-foreground/20 rounded-full hover:bg-muted"><span className="text-xs">-</span></button>
                            <span className="font-display text-xl w-8 text-center">{liveTotalSets}</span>
                            <button onClick={() => setLiveTotalSets(Math.min(10, liveTotalSets + 1))} className="p-1 border border-foreground/20 rounded-full hover:bg-muted"><span className="text-xs">+</span></button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] font-display text-muted-foreground">REPS</label>
                          <div className="flex items-center gap-2 mt-1">
                            <button onClick={() => setLiveReps(Math.max(1, liveReps - 1))} className="p-1 border border-foreground/20 rounded-full hover:bg-muted"><span className="text-xs">-</span></button>
                            <span className="font-display text-xl w-8 text-center">{liveReps}</span>
                            <button onClick={() => setLiveReps(Math.min(50, liveReps + 1))} className="p-1 border border-foreground/20 rounded-full hover:bg-muted"><span className="text-xs">+</span></button>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startLiveExercise}
                        className="w-full terminal-button text-xs py-2.5 flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" /> START LIVE EXERCISE
                      </motion.button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      {/* Phase indicator */}
                      <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: liveTotalSets }).map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full transition-all ${
                            i < liveSet - 1 ? 'bg-green-400' : i === liveSet - 1 ? 'bg-strivo-red animate-pulse w-3 h-3' : 'bg-foreground/20'
                          }`} />
                        ))}
                      </div>

                      {livePhase === 'exercise' && (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                          <p className="text-[10px] font-display tracking-wider text-strivo-red">SET {liveSet} OF {liveTotalSets}</p>
                          <motion.p
                            key={liveCountdown}
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="font-display text-6xl text-strivo-red my-2"
                          >
                            {liveCountdown}
                          </motion.p>
                          <p className="text-xs text-muted-foreground font-display">🏋️ GO GO GO!</p>
                        </motion.div>
                      )}

                      {livePhase === 'rest' && (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                          <p className="text-[10px] font-display tracking-wider text-green-400">REST BREAK</p>
                          <motion.p
                            key={liveCountdown}
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="font-display text-6xl text-green-400 my-2"
                          >
                            {liveCountdown}
                          </motion.p>
                          <p className="text-xs text-muted-foreground font-display">😤 Breathe... Next set coming</p>
                        </motion.div>
                      )}

                      {livePhase === 'done' && (
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="py-4">
                          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: 2, duration: 0.3 }}>
                            <Trophy className="w-12 h-12 mx-auto text-yellow-400 mb-2" />
                          </motion.div>
                          <p className="font-display text-xl tracking-wider">COMPLETE! 🔥</p>
                          <p className="text-xs text-muted-foreground mt-1">{liveTotalSets} sets × {liveReps} reps</p>
                          <p className="text-[10px] text-strivo-red font-display mt-1">+50 XP EARNED</p>
                        </motion.div>
                      )}

                      <div className="flex gap-2 justify-center">
                        {liveTimerRunning ? (
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setLiveTimerRunning(false)}
                            className="px-4 py-2 text-xs font-display border border-foreground/20 rounded-full hover:bg-muted">
                            ⏸ PAUSE
                          </motion.button>
                        ) : livePhase !== 'done' ? (
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setLiveTimerRunning(true)}
                            className="px-4 py-2 text-xs font-display border border-strivo-red/40 text-strivo-red rounded-full hover:bg-strivo-red/10">
                            ▶ RESUME
                          </motion.button>
                        ) : null}
                        <motion.button whileTap={{ scale: 0.95 }} onClick={resetLive}
                          className="px-4 py-2 text-xs font-display border border-foreground/20 rounded-full hover:bg-muted">
                          ✕ STOP
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className={`px-2 py-1 text-[10px] font-display border rounded-full ${diffBadgeColor[selectedExercise.difficulty]}`}>
                    {selectedExercise.difficulty.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 text-[10px] font-display border border-foreground/20 capitalize rounded-full">{selectedExercise.muscleGroup}</span>
                  <span className="px-2 py-1 text-[10px] font-display border border-foreground/20 rounded-full">{selectedExercise.equipment}</span>
                  {selectedExercise.isHome && <span className="px-2 py-1 text-[10px] font-display border border-foreground/20 rounded-full">🏠 Home</span>}
                  {selectedExercise.isGym && <span className="px-2 py-1 text-[10px] font-display border border-foreground/20 rounded-full">🏋️ Gym</span>}
                </div>

                {/* Secondary muscles */}
                {selectedExercise.secondaryMuscles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-1">SECONDARY MUSCLES</p>
                    <div className="flex gap-1">
                      {selectedExercise.secondaryMuscles.map(m => (
                        <span key={m} className="px-2 py-0.5 text-[9px] font-display border border-foreground/10 capitalize rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="mb-4">
                  <p className="text-[10px] font-display tracking-wider text-strivo-red mb-2">📋 INSTRUCTIONS</p>
                  <div className="space-y-1.5">
                    {selectedExercise.instructions.map((inst, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="font-display text-strivo-red text-xs mt-0.5">{i + 1}.</span>
                        <span>{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mistakes */}
                <div className="mb-4">
                  <p className="text-[10px] font-display tracking-wider text-destructive mb-2">⚠️ COMMON MISTAKES</p>
                  <div className="space-y-1">
                    {selectedExercise.mistakes.map((m, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {m}</p>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="mb-4">
                  <p className="text-[10px] font-display tracking-wider text-strivo-red mb-2">💡 TIPS</p>
                  <div className="space-y-1">
                    {selectedExercise.tips.map((t, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {t}</p>
                    ))}
                  </div>
                </div>

                {/* Add to workout */}
                {workoutActive && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addExerciseToLog(selectedExercise.id);
                      setSelectedExercise(null);
                      resetLive();
                      setTab('log');
                      toast.success(`${selectedExercise.name} added to workout`);
                    }}
                    className="terminal-button w-full text-sm"
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> ADD TO WORKOUT
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Sub-components
const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-2 py-1 text-[9px] font-display tracking-wider border transition-all touch-press rounded-full ${
      active ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/15 hover:border-foreground/30'
    }`}
  >
    {label}
  </motion.button>
);

const StatBox = ({ label, value, unit }: { label: string; value: string; unit: string }) => (
  <div className="border border-foreground/10 p-3 text-center rounded-2xl">
    <p className="font-display text-2xl">{value}</p>
    <p className="text-[9px] font-display tracking-wider text-muted-foreground">{unit}</p>
    <p className="text-[8px] text-muted-foreground mt-1">{label}</p>
  </div>
);

const OneRMCalculator = () => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps) || 0;
  const oneRM = w > 0 && r > 0 ? Math.round(w * (1 + r / 30)) : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-display tracking-wider text-muted-foreground">WEIGHT (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="100" className="terminal-input w-full mt-1 text-sm py-2" />
        </div>
        <div>
          <label className="text-[10px] font-display tracking-wider text-muted-foreground">REPS</label>
          <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="5" className="terminal-input w-full mt-1 text-sm py-2" />
        </div>
      </div>
      {oneRM > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-3 border border-strivo-red/30 bg-strivo-red/5 rounded-2xl">
          <p className="text-[10px] font-display tracking-wider text-muted-foreground">ESTIMATED 1RM</p>
          <p className="font-display text-3xl text-strivo-red">{oneRM} kg</p>
          <div className="flex justify-center gap-3 mt-2 text-[9px] text-muted-foreground font-display">
            <span>95%: {Math.round(oneRM * 0.95)}kg</span>
            <span>90%: {Math.round(oneRM * 0.9)}kg</span>
            <span>85%: {Math.round(oneRM * 0.85)}kg</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Workout;
