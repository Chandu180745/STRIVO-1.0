import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Scale, Zap } from 'lucide-react';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

interface CalorieResult {
  bmr: number;
  maintenance: number;
  cutting: number;
  bulking: number;
}

interface BodyFatResult {
  bodyFat: number;
  leanMass: number;
  fatMass: number;
  category: string;
}

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: 'SEDENTARY',
  light: 'LIGHT (1-3 DAYS)',
  moderate: 'MODERATE (3-5 DAYS)',
  active: 'ACTIVE (6-7 DAYS)',
  very_active: 'ATHLETE',
};

export const CalorieCalculator = () => {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<CalorieResult | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);
    
    const bmr = gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    
    const maintenance = bmr * activityMultipliers[activity];
    setResult({
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      cutting: Math.round(maintenance - 500),
      bulking: Math.round(maintenance + 500),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card scanline">
      <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-strivo-red" />
        CALORIE NEEDS ESTIMATOR
      </h3>

      <form onSubmit={calculate} className="space-y-3">
        <div className="flex gap-2">
          {(['male', 'female'] as Gender[]).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 py-2 text-xs font-display tracking-wider border-2 transition-colors rounded-full ${
                gender === g ? 'bg-foreground text-background border-foreground' : 'border-foreground/30'
              }`}
            >
              {g.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="AGE" required className="terminal-input text-sm py-2" />
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="CM" required className="terminal-input text-sm py-2" />
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="KG" required className="terminal-input text-sm py-2" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {(Object.keys(activityLabels) as ActivityLevel[]).map(level => (
            <button
              key={level}
              type="button"
              onClick={() => setActivity(level)}
              className={`py-1 px-2 text-[10px] font-display tracking-wider border transition-colors ${
                activity === level ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/20 hover:border-foreground/40'
              }`}
            >
              {activityLabels[level]}
            </button>
          ))}
        </div>

        <button type="submit" className="terminal-button w-full text-sm py-2">CALCULATE</button>
      </form>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 grid grid-cols-2 gap-2">
          <div className="p-3 border border-foreground/20 text-center rounded-2xl">
            <p className="text-[10px] font-display text-muted-foreground">BMR</p>
            <p className="font-display text-xl">{result.bmr}</p>
            <p className="text-[10px] text-muted-foreground">kcal/day</p>
          </div>
          <div className="p-3 border border-foreground/20 text-center rounded-2xl">
            <p className="text-[10px] font-display text-muted-foreground">MAINTAIN</p>
            <p className="font-display text-xl">{result.maintenance}</p>
            <p className="text-[10px] text-muted-foreground">kcal/day</p>
          </div>
          <div className="p-3 border border-green-500/30 text-center rounded-2xl">
            <p className="text-[10px] font-display text-green-400">CUT (-500)</p>
            <p className="font-display text-xl text-green-400">{result.cutting}</p>
            <p className="text-[10px] text-muted-foreground">kcal/day</p>
          </div>
          <div className="p-3 border border-yellow-500/30 text-center rounded-2xl">
            <p className="text-[10px] font-display text-yellow-400">BULK (+500)</p>
            <p className="font-display text-xl text-yellow-400">{result.bulking}</p>
            <p className="text-[10px] text-muted-foreground">kcal/day</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const BodyFatCalculator = () => {
  const [gender, setGender] = useState<Gender>('male');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [hip, setHip] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<BodyFatResult | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    const wt = parseFloat(weight);
    
    let bodyFat: number;
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      const hp = parseFloat(hip);
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
    }
    
    bodyFat = Math.max(2, Math.min(60, bodyFat));
    const fatMass = (bodyFat / 100) * wt;
    const leanMass = wt - fatMass;
    
    let category = '';
    if (gender === 'male') {
      if (bodyFat < 6) category = 'ESSENTIAL';
      else if (bodyFat < 14) category = 'ATHLETIC';
      else if (bodyFat < 18) category = 'FITNESS';
      else if (bodyFat < 25) category = 'AVERAGE';
      else category = 'OBESE';
    } else {
      if (bodyFat < 14) category = 'ESSENTIAL';
      else if (bodyFat < 21) category = 'ATHLETIC';
      else if (bodyFat < 25) category = 'FITNESS';
      else if (bodyFat < 32) category = 'AVERAGE';
      else category = 'OBESE';
    }

    setResult({ bodyFat: Math.round(bodyFat * 10) / 10, leanMass: Math.round(leanMass * 10) / 10, fatMass: Math.round(fatMass * 10) / 10, category });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card scanline">
      <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
        <Scale className="w-5 h-5 text-strivo-red" />
        BODY FAT ESTIMATOR
      </h3>

      <form onSubmit={calculate} className="space-y-3">
        <div className="flex gap-2">
          {(['male', 'female'] as Gender[]).map(g => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 py-2 text-xs font-display tracking-wider border-2 transition-colors rounded-full ${
                gender === g ? 'bg-foreground text-background border-foreground' : 'border-foreground/30'
              }`}
            >
              {g.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="HEIGHT (cm)" required className="terminal-input text-sm py-2" />
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="WEIGHT (kg)" required className="terminal-input text-sm py-2" />
          <input type="number" value={waist} onChange={e => setWaist(e.target.value)} placeholder="WAIST (cm)" required className="terminal-input text-sm py-2" />
          <input type="number" value={neck} onChange={e => setNeck(e.target.value)} placeholder="NECK (cm)" required className="terminal-input text-sm py-2" />
          {gender === 'female' && (
            <input type="number" value={hip} onChange={e => setHip(e.target.value)} placeholder="HIP (cm)" required className="terminal-input text-sm py-2 col-span-2" />
          )}
        </div>

        <button type="submit" className="terminal-button w-full text-sm py-2">ESTIMATE</button>
      </form>

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
          <div className="text-center p-4 border border-foreground/20 rounded-2xl">
            <p className="text-[10px] font-display text-muted-foreground">BODY FAT %</p>
            <p className="font-display text-4xl">{result.bodyFat}%</p>
            <p className={`font-display text-sm tracking-wider mt-1 ${
              result.category === 'OBESE' ? 'text-red-400' : result.category === 'ATHLETIC' ? 'text-green-400' : ''
            }`}>{result.category}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 border border-foreground/20 text-center rounded-2xl">
              <p className="text-[10px] font-display text-muted-foreground">LEAN MASS</p>
              <p className="font-display text-lg">{result.leanMass} kg</p>
            </div>
            <div className="p-2 border border-foreground/20 text-center rounded-2xl">
              <p className="text-[10px] font-display text-muted-foreground">FAT MASS</p>
              <p className="font-display text-lg">{result.fatMass} kg</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const OneRepMaxCalculator = () => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const r = parseFloat(reps);
    // Epley formula
    const orm = w * (1 + r / 30);
    setResult(Math.round(orm * 10) / 10);
  };

  const percentages = [100, 95, 90, 85, 80, 75, 70, 65];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card scanline">
      <h3 className="font-display text-sm tracking-wider mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-strivo-red" />
        1RM CALCULATOR
      </h3>

      <form onSubmit={calculate} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="WEIGHT (kg)" required className="terminal-input text-sm py-2" />
          <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="REPS" required className="terminal-input text-sm py-2" />
        </div>
        <button type="submit" className="terminal-button w-full text-sm py-2">CALCULATE 1RM</button>
      </form>

      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
          <div className="text-center p-3 border border-strivo-red/30 mb-3 rounded-2xl">
            <p className="text-[10px] font-display text-muted-foreground">ESTIMATED 1RM</p>
            <p className="font-display text-3xl text-strivo-red">{result} kg</p>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {percentages.map(pct => (
              <div key={pct} className="p-1.5 border border-foreground/10 text-center rounded-2xl">
                <p className="text-[9px] font-display text-muted-foreground">{pct}%</p>
                <p className="font-display text-xs">{Math.round(result * pct / 100)} kg</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
