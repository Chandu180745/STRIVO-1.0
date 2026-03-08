import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { bodyParts, getWorkoutsByBodyPart } from '@/lib/workouts';

export const WorkoutInfo = () => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const getBodyPartIcon = (part: string) => {
    const icons: Record<string, string> = {
      chest: '💪',
      back: '🔙',
      shoulders: '🏋️',
      arms: '💪',
      legs: '🦵',
      core: '🎯',
      cardio: '🏃',
      flexibility: '🧘',
    };
    return icons[part] || '◎';
  };

  const getDifficultyColor = (d?: string) => {
    if (d === 'beginner') return 'text-green-400 border-green-400/30';
    if (d === 'intermediate') return 'text-yellow-400 border-yellow-400/30';
    if (d === 'advanced') return 'text-red-400 border-red-400/30';
    return 'text-muted-foreground border-foreground/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h3 className="font-display text-lg tracking-wider mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-strivo-red rounded-full" />
        WORKOUT GUIDE
      </h3>

      <div className="space-y-2">
        {bodyParts.map((part) => {
          const exercises = getWorkoutsByBodyPart(part);
          return (
            <div key={part} className="border border-foreground/20 rounded-2xl overflow-hidden">
              <button
                onClick={() => setSelectedPart(selectedPart === part ? null : part)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <span className="font-display tracking-wider uppercase flex items-center gap-3 text-sm">
                  <span className="text-xl">{getBodyPartIcon(part)}</span>
                  {part}
                  <span className="text-[10px] text-muted-foreground">({exercises.length})</span>
                </span>
                <motion.div
                  animate={{ rotate: selectedPart === part ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {selectedPart === part && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 space-y-2">
                      {exercises.map((workout) => (
                        <div
                          key={workout.id}
                          className="p-2 bg-muted/30 border-l-2 border-strivo-red rounded-xl"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-display text-sm tracking-wider">
                                {workout.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {workout.description}
                              </p>
                            </div>
                            <div className="text-right font-mono text-xs space-y-1">
                              <p>{workout.sets} SETS</p>
                              <p className="text-muted-foreground">{workout.reps}</p>
                              {workout.difficulty && (
                                <span className={`text-[9px] font-display px-1.5 py-0.5 border rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                                  {workout.difficulty.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
