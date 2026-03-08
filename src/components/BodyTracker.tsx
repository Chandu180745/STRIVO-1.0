import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Plus, TrendingUp, Scale } from 'lucide-react';
import { useSettings, type BodyMeasurement } from '@/hooks/useSettings';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

export const BodyTracker = () => {
  const settings = useSettings();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ chest: '', waist: '', arms: '', thighs: '', shoulders: '' });
  const [weightInput, setWeightInput] = useState('');

  const handleAddMeasurement = () => {
    const m: BodyMeasurement = {
      date: new Date().toISOString().split('T')[0],
      chest: parseFloat(form.chest) || 0,
      waist: parseFloat(form.waist) || 0,
      arms: parseFloat(form.arms) || 0,
      thighs: parseFloat(form.thighs) || 0,
      shoulders: parseFloat(form.shoulders) || 0,
    };
    settings.addBodyMeasurement(m);
    setForm({ chest: '', waist: '', arms: '', thighs: '', shoulders: '' });
    setShowForm(false);
  };

  const handleAddWeight = () => {
    const w = parseFloat(weightInput);
    if (w > 0) {
      settings.addWeightEntry({ date: new Date().toISOString().split('T')[0], weight: w });
      setWeightInput('');
    }
  };

  const chartStyle = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    fontFamily: 'Orbitron',
    fontSize: 10,
  };

  return (
    <div className="space-y-4">
      {/* Weight History */}
      <motion.div whileHover={{ scale: 1.01 }} className="glass-card card-3d">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-strivo-red" />
            <span className="text-xs font-display tracking-wider">WEIGHT HISTORY</span>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              placeholder="kg"
              className="terminal-input text-xs py-1 px-2 w-20"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddWeight}
              className="p-1.5 border border-strivo-red/40 text-strivo-red hover:bg-strivo-red/10 rounded-full"
            >
              <Plus className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        {settings.weightHistory.length > 1 ? (
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={settings.weightHistory.slice(-14)}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--strivo-red))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--strivo-red))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} stroke="currentColor" tickFormatter={d => d.slice(5)} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} stroke="currentColor" width={30} />
                <Tooltip contentStyle={chartStyle} formatter={(v: number) => [`${v} kg`, 'Weight']} />
                <Area type="monotone" dataKey="weight" stroke="hsl(var(--strivo-red))" strokeWidth={2} fill="url(#wGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">Log at least 2 entries to see the chart</p>
        )}
      </motion.div>

      {/* Body Measurements */}
      <motion.div whileHover={{ scale: 1.01 }} className="glass-card card-3d">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-strivo-red" />
            <span className="text-xs font-display tracking-wider">BODY MEASUREMENTS</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowForm(!showForm)}
            className="p-1.5 border border-strivo-red/40 text-strivo-red hover:bg-strivo-red/10 rounded-full"
          >
            <Plus className="w-3 h-3" />
          </motion.button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 mb-4 border-b border-foreground/10 pb-4"
          >
            <div className="grid grid-cols-3 gap-2">
              {(['chest', 'waist', 'arms', 'thighs', 'shoulders'] as const).map(key => (
                <div key={key}>
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground uppercase">{key} (cm)</label>
                  <input
                    type="number"
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="terminal-input w-full mt-0.5 text-xs py-1"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleAddMeasurement} className="terminal-button w-full text-xs py-2">SAVE MEASUREMENT</button>
          </motion.div>
        )}

        {settings.bodyMeasurements.length > 0 ? (
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={settings.bodyMeasurements.slice(-10)}>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} stroke="currentColor" tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} stroke="currentColor" width={30} />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="chest" stroke="hsl(var(--strivo-red))" strokeWidth={1.5} dot={{ r: 2 }} name="Chest" />
                <Line type="monotone" dataKey="waist" stroke="hsl(205 80% 45%)" strokeWidth={1.5} dot={{ r: 2 }} name="Waist" />
                <Line type="monotone" dataKey="arms" stroke="hsl(45 100% 50%)" strokeWidth={1.5} dot={{ r: 2 }} name="Arms" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">No measurements recorded yet</p>
        )}

        {/* Latest measurement */}
        {settings.bodyMeasurements.length > 0 && (
          <div className="grid grid-cols-5 gap-1 mt-3">
            {(['chest', 'waist', 'arms', 'thighs', 'shoulders'] as const).map(key => {
              const latest = settings.bodyMeasurements[settings.bodyMeasurements.length - 1];
              return (
                <div key={key} className="text-center border border-foreground/10 py-1 rounded-2xl">
                  <p className="text-[8px] font-display tracking-wider text-muted-foreground uppercase">{key}</p>
                  <p className="text-xs font-display">{latest[key]}</p>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};
