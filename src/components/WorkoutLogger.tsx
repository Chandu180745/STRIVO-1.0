import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, Trash2, Check } from 'lucide-react';
import { useFitnessData } from '@/hooks/useFitnessData';
import { toast } from 'sonner';

interface ExerciseLog {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export const WorkoutLogger = () => {
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [saved, setSaved] = useState(false);
  const { addActiveMinutes, addCalories } = useFitnessData();

  const addExercise = () => {
    if (!name || !sets || !reps) return;
    setExercises(prev => [...prev, {
      name: name.toUpperCase(),
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseFloat(weight) || 0,
    }]);
    setName(''); setSets(''); setReps(''); setWeight('');
  };

  const removeExercise = (idx: number) => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const saveWorkout = () => {
    if (exercises.length === 0) return;
    const totalSets = exercises.reduce((s, e) => s + e.sets, 0);
    const estMinutes = totalSets * 2;
    const estCalories = totalSets * 8;
    addActiveMinutes(estMinutes);
    addCalories(estCalories);
    setSaved(true);
    toast.success(`Workout logged! ${estMinutes} min, ~${estCalories} kcal burned`);
    setTimeout(() => { setExercises([]); setSaved(false); }, 2000);
  };

  const presets = ['BENCH PRESS', 'SQUATS', 'DEADLIFT', 'PULL-UPS', 'SHOULDER PRESS', 'BICEP CURLS'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card scanline">
      <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
        <Dumbbell className="w-5 h-5 text-strivo-red" />
        WORKOUT LOGGER
      </h3>

      {/* Quick presets */}
      <div className="flex gap-1 flex-wrap mb-3">
        {presets.map(p => (
          <button key={p} onClick={() => setName(p)}
            className="px-2 py-1 text-[9px] font-display border border-foreground/20 hover:border-foreground/50 transition-colors rounded-full">
            {p}
          </button>
        ))}
      </div>

      {/* Add exercise form */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="EXERCISE" className="terminal-input text-xs py-1.5 px-2 col-span-4" />
        <input type="number" value={sets} onChange={e => setSets(e.target.value)}
          placeholder="SETS" className="terminal-input text-xs py-1.5 px-2" />
        <input type="number" value={reps} onChange={e => setReps(e.target.value)}
          placeholder="REPS" className="terminal-input text-xs py-1.5 px-2" />
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
          placeholder="KG" className="terminal-input text-xs py-1.5 px-2" />
        <button onClick={addExercise} className="terminal-button text-xs py-1.5 px-2 flex items-center justify-center">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Exercise list */}
      <AnimatePresence>
        {exercises.map((ex, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between py-2 px-3 border-b border-foreground/10 text-xs font-display">
            <span className="flex-1">{ex.name}</span>
            <span className="text-muted-foreground">{ex.sets}×{ex.reps} @ {ex.weight}kg</span>
            <button onClick={() => removeExercise(i)} className="ml-2 text-muted-foreground hover:text-strivo-red">
              <Trash2 className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {exercises.length > 0 && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={saveWorkout}
          className={`terminal-button w-full mt-3 text-xs py-2 flex items-center justify-center gap-2 ${saved ? 'bg-green-600 border-green-600' : ''}`}>
          {saved ? <><Check className="w-4 h-4" /> SAVED!</> : 'LOG WORKOUT'}
        </motion.button>
      )}

      {exercises.length === 0 && (
        <p className="text-[10px] text-muted-foreground text-center py-3 font-display">ADD EXERCISES TO LOG YOUR WORKOUT</p>
      )}
    </motion.div>
  );
};
