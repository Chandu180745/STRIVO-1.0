import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch, Smartphone, CheckCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const wearables = [
  { id: 'google-fit', name: 'GOOGLE FIT', icon: '🏃', color: 'text-green-400', description: 'Steps, heart rate, workouts' },
  { id: 'apple-health', name: 'APPLE HEALTH', icon: '🍎', color: 'text-sky-400', description: 'Activity, sleep, vitals' },
  { id: 'fitbit', name: 'FITBIT', icon: '⌚', color: 'text-teal-400', description: 'Steps, sleep, heart rate' },
  { id: 'garmin', name: 'GARMIN', icon: '🧭', color: 'text-yellow-400', description: 'GPS, VO2 max, training load' },
];

export const WearableIntegration = () => {
  const [connected, setConnected] = useState<string[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);

  const handleConnect = async (id: string) => {
    if (connected.includes(id)) {
      setConnected(prev => prev.filter(c => c !== id));
      toast.success(`Disconnected from ${wearables.find(w => w.id === id)?.name}`);
      return;
    }

    setSyncing(id);
    // Simulate connection
    await new Promise(r => setTimeout(r, 1500));
    setConnected(prev => [...prev, id]);
    setSyncing(null);
    toast.success(`Connected to ${wearables.find(w => w.id === id)?.name}! Syncing data...`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card card-3d space-y-3">
      <div className="flex items-center gap-2">
        <Watch className="w-4 h-4 text-strivo-red" />
        <h3 className="font-display text-sm tracking-wider">WEARABLE INTEGRATION</h3>
      </div>

      <p className="text-[10px] text-muted-foreground">Connect your fitness devices to sync health data automatically.</p>

      <div className="space-y-2">
        {wearables.map(w => {
          const isConnected = connected.includes(w.id);
          const isSyncing = syncing === w.id;
          return (
            <motion.div
              key={w.id}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between p-3 border-2 transition-all cursor-pointer rounded-2xl ${
                isConnected ? 'border-green-400/40 bg-green-400/5' : 'border-foreground/10 hover:border-foreground/30'
              }`}
              onClick={() => handleConnect(w.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{w.icon}</span>
                <div>
                  <p className="font-display text-xs tracking-wider">{w.name}</p>
                  <p className="text-[9px] text-muted-foreground">{w.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSyncing && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-foreground/30 border-t-strivo-red rounded-full"
                  />
                )}
                {isConnected && !isSyncing && (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                )}
                {!isConnected && !isSyncing && (
                  <span className="text-[9px] font-display text-muted-foreground">CONNECT</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {connected.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-foreground/10 pt-2">
          <div className="flex items-center gap-1 text-[10px] text-green-400 font-display">
            <Smartphone className="w-3 h-3" />
            {connected.length} DEVICE{connected.length > 1 ? 'S' : ''} CONNECTED
          </div>
          <p className="text-[9px] text-muted-foreground mt-1">Data syncs automatically every 15 minutes</p>
        </motion.div>
      )}
    </motion.div>
  );
};
