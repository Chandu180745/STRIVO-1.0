import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Footprints, Heart, Wind } from 'lucide-react';

interface HealthStats {
  steps: number;
  heartRate: number;
  o2Level: number;
  calories: number;
}

export const HealthStats = () => {
  const [stats, setStats] = useState<HealthStats>({
    steps: 0,
    heartRate: 72,
    o2Level: 98,
    calories: 0,
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Simulate smartwatch data updates
    if (connected) {
      const interval = setInterval(() => {
        setStats((prev) => ({
          steps: prev.steps + Math.floor(Math.random() * 5),
          heartRate: 68 + Math.floor(Math.random() * 20),
          o2Level: 96 + Math.floor(Math.random() * 4),
          calories: prev.calories + Math.floor(Math.random() * 2),
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [connected]);

  const handleConnect = () => {
    setConnected(true);
    setStats({
      steps: 4283,
      heartRate: 72,
      o2Level: 98,
      calories: 187,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg tracking-wider flex items-center gap-2">
          <Activity className="w-5 h-5 text-strivo-red" />
          SMARTWATCH DATA
        </h3>
        {!connected ? (
          <button
            onClick={handleConnect}
            className="text-xs terminal-button-outline py-1 px-3"
          >
            CONNECT
          </button>
        ) : (
          <span className="text-xs font-display text-strivo-red flex items-center gap-1">
            <span className="w-2 h-2 bg-strivo-red rounded-full animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {connected ? (
        <div className="grid grid-cols-2 gap-4">
          <StatBox
            icon={<Footprints className="w-5 h-5" />}
            label="STEPS"
            value={stats.steps.toLocaleString()}
            unit="today"
          />
          <StatBox
            icon={<Heart className="w-5 h-5 text-strivo-red" />}
            label="HEART RATE"
            value={stats.heartRate.toString()}
            unit="bpm"
            isAlert={stats.heartRate > 100}
          />
          <StatBox
            icon={<Wind className="w-5 h-5" />}
            label="O2 LEVEL"
            value={stats.o2Level.toString()}
            unit="%"
            isAlert={stats.o2Level < 95}
          />
          <StatBox
            icon={<Activity className="w-5 h-5" />}
            label="CALORIES"
            value={stats.calories.toString()}
            unit="kcal"
          />
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground font-display tracking-wider">
          <p className="text-sm">NO DEVICE CONNECTED</p>
          <p className="text-xs mt-2">CONNECT SMARTWATCH TO SYNC DATA</p>
        </div>
      )}
    </motion.div>
  );
};

const StatBox = ({
  icon,
  label,
  value,
  unit,
  isAlert = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  isAlert?: boolean;
}) => (
  <div className={`p-3 border border-foreground/20 rounded-2xl ${isAlert ? 'border-strivo-red/50 bg-strivo-red/5' : ''}`}>
    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
      {icon}
      <span className="font-display text-xs tracking-wider">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className={`font-display text-2xl ${isAlert ? 'alert-text' : ''}`}>{value}</span>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
  </div>
);
