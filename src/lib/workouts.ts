export interface Workout {
  id: string;
  name: string;
  bodyPart: string;
  description: string;
  sets: string;
  reps: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export const workouts: Workout[] = [
  // Chest
  { id: 'w1', name: 'PUSH-UPS', bodyPart: 'chest', description: 'Classic chest builder', sets: '3', reps: '15-20', difficulty: 'beginner' },
  { id: 'w2', name: 'BENCH PRESS', bodyPart: 'chest', description: 'Barbell chest press', sets: '4', reps: '8-12', difficulty: 'intermediate' },
  { id: 'w3', name: 'DUMBBELL FLYES', bodyPart: 'chest', description: 'Chest isolation', sets: '3', reps: '12-15', difficulty: 'intermediate' },
  { id: 'w19', name: 'INCLINE PRESS', bodyPart: 'chest', description: 'Upper chest focus', sets: '4', reps: '8-10', difficulty: 'intermediate' },
  { id: 'w20', name: 'CABLE CROSSOVER', bodyPart: 'chest', description: 'Constant tension flyes', sets: '3', reps: '12-15', difficulty: 'advanced' },
  { id: 'w21', name: 'DIAMOND PUSH-UPS', bodyPart: 'chest', description: 'Inner chest + triceps', sets: '3', reps: '10-15', difficulty: 'intermediate' },

  // Back
  { id: 'w4', name: 'PULL-UPS', bodyPart: 'back', description: 'Lat dominance', sets: '3', reps: '8-12', difficulty: 'intermediate' },
  { id: 'w5', name: 'BENT ROWS', bodyPart: 'back', description: 'Upper back thickness', sets: '4', reps: '10-12', difficulty: 'intermediate' },
  { id: 'w6', name: 'DEADLIFTS', bodyPart: 'back', description: 'Full posterior chain', sets: '4', reps: '6-8', difficulty: 'advanced' },
  { id: 'w22', name: 'LAT PULLDOWN', bodyPart: 'back', description: 'Machine lat builder', sets: '3', reps: '10-12', difficulty: 'beginner' },
  { id: 'w23', name: 'T-BAR ROW', bodyPart: 'back', description: 'Mid-back thickness', sets: '4', reps: '8-10', difficulty: 'intermediate' },
  { id: 'w24', name: 'SEATED CABLE ROW', bodyPart: 'back', description: 'Controlled back work', sets: '3', reps: '12-15', difficulty: 'beginner' },

  // Shoulders
  { id: 'w7', name: 'OVERHEAD PRESS', bodyPart: 'shoulders', description: 'Shoulder mass builder', sets: '4', reps: '8-10', difficulty: 'intermediate' },
  { id: 'w8', name: 'LATERAL RAISES', bodyPart: 'shoulders', description: 'Side delt isolation', sets: '3', reps: '12-15', difficulty: 'beginner' },
  { id: 'w9', name: 'FACE PULLS', bodyPart: 'shoulders', description: 'Rear delt health', sets: '3', reps: '15-20', difficulty: 'beginner' },
  { id: 'w25', name: 'ARNOLD PRESS', bodyPart: 'shoulders', description: 'Rotational press', sets: '3', reps: '10-12', difficulty: 'intermediate' },
  { id: 'w26', name: 'UPRIGHT ROW', bodyPart: 'shoulders', description: 'Trap and delt builder', sets: '3', reps: '10-12', difficulty: 'intermediate' },
  { id: 'w27', name: 'REVERSE FLYES', bodyPart: 'shoulders', description: 'Rear delt isolation', sets: '3', reps: '12-15', difficulty: 'beginner' },

  // Arms
  { id: 'w10', name: 'BICEP CURLS', bodyPart: 'arms', description: 'Arm flexor builder', sets: '3', reps: '10-12', difficulty: 'beginner' },
  { id: 'w11', name: 'TRICEP DIPS', bodyPart: 'arms', description: 'Tricep mass', sets: '3', reps: '10-15', difficulty: 'intermediate' },
  { id: 'w12', name: 'HAMMER CURLS', bodyPart: 'arms', description: 'Brachialis focus', sets: '3', reps: '10-12', difficulty: 'beginner' },
  { id: 'w28', name: 'SKULL CRUSHERS', bodyPart: 'arms', description: 'Tricep long head', sets: '3', reps: '10-12', difficulty: 'intermediate' },
  { id: 'w29', name: 'PREACHER CURLS', bodyPart: 'arms', description: 'Peak bicep contraction', sets: '3', reps: '10-12', difficulty: 'intermediate' },
  { id: 'w30', name: 'CABLE PUSHDOWN', bodyPart: 'arms', description: 'Tricep isolation', sets: '3', reps: '12-15', difficulty: 'beginner' },
  { id: 'w31', name: 'CONCENTRATION CURLS', bodyPart: 'arms', description: 'Strict bicep isolation', sets: '3', reps: '10-12', difficulty: 'beginner' },

  // Legs
  { id: 'w13', name: 'SQUATS', bodyPart: 'legs', description: 'King of leg exercises', sets: '4', reps: '8-12', difficulty: 'intermediate' },
  { id: 'w14', name: 'LUNGES', bodyPart: 'legs', description: 'Unilateral leg work', sets: '3', reps: '12 each', difficulty: 'beginner' },
  { id: 'w15', name: 'CALF RAISES', bodyPart: 'legs', description: 'Lower leg builder', sets: '4', reps: '15-20', difficulty: 'beginner' },
  { id: 'w32', name: 'LEG PRESS', bodyPart: 'legs', description: 'Heavy quad builder', sets: '4', reps: '10-12', difficulty: 'beginner' },
  { id: 'w33', name: 'ROMANIAN DEADLIFT', bodyPart: 'legs', description: 'Hamstring dominant', sets: '4', reps: '8-10', difficulty: 'intermediate' },
  { id: 'w34', name: 'BULGARIAN SPLIT SQUAT', bodyPart: 'legs', description: 'Single leg strength', sets: '3', reps: '10 each', difficulty: 'advanced' },
  { id: 'w35', name: 'LEG EXTENSION', bodyPart: 'legs', description: 'Quad isolation', sets: '3', reps: '12-15', difficulty: 'beginner' },
  { id: 'w36', name: 'LEG CURL', bodyPart: 'legs', description: 'Hamstring isolation', sets: '3', reps: '12-15', difficulty: 'beginner' },

  // Core
  { id: 'w16', name: 'PLANKS', bodyPart: 'core', description: 'Core stability', sets: '3', reps: '60s', difficulty: 'beginner' },
  { id: 'w17', name: 'CRUNCHES', bodyPart: 'core', description: 'Upper ab focus', sets: '3', reps: '20-25', difficulty: 'beginner' },
  { id: 'w18', name: 'LEG RAISES', bodyPart: 'core', description: 'Lower ab builder', sets: '3', reps: '12-15', difficulty: 'intermediate' },
  { id: 'w37', name: 'RUSSIAN TWISTS', bodyPart: 'core', description: 'Oblique power', sets: '3', reps: '20 each', difficulty: 'intermediate' },
  { id: 'w38', name: 'MOUNTAIN CLIMBERS', bodyPart: 'core', description: 'Dynamic core + cardio', sets: '3', reps: '30s', difficulty: 'beginner' },
  { id: 'w39', name: 'HANGING LEG RAISES', bodyPart: 'core', description: 'Advanced lower abs', sets: '3', reps: '10-12', difficulty: 'advanced' },
  { id: 'w40', name: 'AB WHEEL ROLLOUT', bodyPart: 'core', description: 'Full core engagement', sets: '3', reps: '8-10', difficulty: 'advanced' },

  // Cardio
  { id: 'w41', name: 'BURPEES', bodyPart: 'cardio', description: 'Full body fat burner', sets: '3', reps: '10-15', difficulty: 'intermediate' },
  { id: 'w42', name: 'JUMP ROPE', bodyPart: 'cardio', description: 'Coordination + cardio', sets: '3', reps: '60s', difficulty: 'beginner' },
  { id: 'w43', name: 'BOX JUMPS', bodyPart: 'cardio', description: 'Explosive power', sets: '3', reps: '10-12', difficulty: 'intermediate' },
  { id: 'w44', name: 'SPRINT INTERVALS', bodyPart: 'cardio', description: '20s sprint / 40s rest', sets: '8', reps: '20s', difficulty: 'advanced' },
  { id: 'w45', name: 'BATTLE ROPES', bodyPart: 'cardio', description: 'Upper body cardio', sets: '3', reps: '30s', difficulty: 'intermediate' },

  // Flexibility
  { id: 'w46', name: 'SUN SALUTATION', bodyPart: 'flexibility', description: 'Yoga flow sequence', sets: '3', reps: '5 rounds', difficulty: 'beginner' },
  { id: 'w47', name: 'PIGEON POSE', bodyPart: 'flexibility', description: 'Deep hip opener', sets: '1', reps: '60s each', difficulty: 'beginner' },
  { id: 'w48', name: 'FOAM ROLLING', bodyPart: 'flexibility', description: 'Myofascial release', sets: '1', reps: '30s per area', difficulty: 'beginner' },
  { id: 'w49', name: 'DYNAMIC STRETCHING', bodyPart: 'flexibility', description: 'Pre-workout mobility', sets: '1', reps: '10 each', difficulty: 'beginner' },
];

export const bodyParts = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'flexibility'];

export const getWorkoutsByBodyPart = (part: string) => workouts.filter(w => w.bodyPart === part);
