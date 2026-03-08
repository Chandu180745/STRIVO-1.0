import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

export const WorkoutTimer = () => {
  const [seconds, setSeconds] = useState(60);
  const [initialSeconds, setInitialSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      setIsComplete(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(false);
    setIsComplete(false);
  }, [initialSeconds]);

  const adjustTime = (delta: number) => {
    const newTime = Math.max(10, initialSeconds + delta);
    setInitialSeconds(newTime);
    if (!isRunning) {
      setSeconds(newTime);
    }
  };

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <h3 className="font-display text-lg tracking-wider mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-strivo-red rounded-full" />
        WORKOUT TIMER
      </h3>

      <div className="relative">
        {/* Progress ring */}
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isComplete ? 'hsl(var(--strivo-red))' : 'currentColor'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
              className={isComplete ? '' : 'text-foreground'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-display text-4xl tracking-wider ${isComplete ? 'alert-text blink' : ''}`}>
              {formatTime(seconds)}
            </span>
          </div>
        </div>

        {/* Time adjustment */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => adjustTime(-10)}
            disabled={isRunning}
            className="p-2 border border-foreground/30 rounded hover:bg-foreground/10 disabled:opacity-50 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-display text-sm tracking-wider text-muted-foreground">
            {Math.floor(initialSeconds / 60)}:{(initialSeconds % 60).toString().padStart(2, '0')} SET
          </span>
          <button
            onClick={() => adjustTime(10)}
            disabled={isRunning}
            className="p-2 border border-foreground/30 rounded hover:bg-foreground/10 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="terminal-button flex items-center gap-2"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button
            onClick={reset}
            className="terminal-button-outline p-3"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
