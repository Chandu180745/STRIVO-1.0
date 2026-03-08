import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ScanBarcode, Loader2, X, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSettings, type MealCategory } from '@/hooks/useSettings';

interface FoodResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  serving?: string;
  confidence?: number;
}

export const FoodScanner = () => {
  const [mode, setMode] = useState<'idle' | 'barcode' | 'image'>('idle');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('snack');
  const { addMealLog } = useSettings();

  const handleBarcodeScan = async () => {
    if (!barcodeInput.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('food-recognition', {
        body: { image: barcodeInput, type: 'barcode' },
      });
      if (error) throw error;
      setResult(data as FoodResult);
    } catch (e) {
      toast.error('Failed to scan barcode. Try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageRecognition = async () => {
    if (!foodDescription.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('food-recognition', {
        body: { image: foodDescription, type: 'food' },
      });
      if (error) throw error;
      setResult(data as FoodResult);
    } catch (e) {
      toast.error('Failed to recognize food. Try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToMealLog = () => {
    if (!result) return;
    const today = new Date().toISOString().split('T')[0];
    addMealLog({
      id: crypto.randomUUID(),
      date: today,
      category: selectedCategory,
      name: result.name,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
    });
    toast.success(`${result.name} added to ${selectedCategory}!`);
    setResult(null);
    setMode('idle');
    setBarcodeInput('');
    setFoodDescription('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card card-3d space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-strivo-red" />
        <h3 className="font-display text-sm tracking-wider">AI FOOD SCANNER</h3>
      </div>

      {mode === 'idle' && (
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setMode('barcode')}
            className="flex flex-col items-center gap-2 py-4 border-2 border-foreground/10 hover:border-strivo-red/40 transition-colors rounded-2xl"
          >
            <ScanBarcode className="w-6 h-6 text-strivo-red" />
            <span className="text-[10px] font-display tracking-wider">BARCODE SCAN</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setMode('image')}
            className="flex flex-col items-center gap-2 py-4 border-2 border-foreground/10 hover:border-strivo-red/40 transition-colors rounded-2xl"
          >
            <Camera className="w-6 h-6 text-strivo-red" />
            <span className="text-[10px] font-display tracking-wider">FOOD AI</span>
          </motion.button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {mode === 'barcode' && (
          <motion.div key="barcode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-display text-muted-foreground">ENTER BARCODE NUMBER</p>
              <button onClick={() => { setMode('idle'); setResult(null); }}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                placeholder="e.g. 8901234567890"
                className="terminal-input flex-1 text-xs py-2"
                onKeyDown={e => e.key === 'Enter' && handleBarcodeScan()}
              />
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleBarcodeScan} disabled={isLoading} className="terminal-button text-xs py-2 px-3">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SCAN'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'image' && (
          <motion.div key="image" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-display text-muted-foreground">DESCRIBE YOUR FOOD</p>
              <button onClick={() => { setMode('idle'); setResult(null); }}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <textarea
              value={foodDescription}
              onChange={e => setFoodDescription(e.target.value)}
              placeholder="e.g. A plate of chicken biryani with raita and salad..."
              className="terminal-input w-full text-xs py-2 min-h-[60px] resize-none"
            />
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleImageRecognition} disabled={isLoading} className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> ANALYZING...</> : <><Sparkles className="w-4 h-4" /> ANALYZE WITH AI</>}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border-2 border-strivo-red/30 bg-strivo-red/5 p-3 space-y-2 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-sm tracking-wider">{result.name}</p>
              {result.confidence && (
                <span className="text-[9px] font-display text-muted-foreground">{result.confidence}% CONFIDENT</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'CAL', value: result.calories, unit: 'kcal' },
                { label: 'PROTEIN', value: result.protein, unit: 'g' },
                { label: 'CARBS', value: result.carbs, unit: 'g' },
                { label: 'FAT', value: result.fat, unit: 'g' },
              ].map(({ label, value, unit }) => (
                <div key={label} className="text-center border border-foreground/10 py-1.5 rounded-2xl">
                  <p className="text-[8px] text-muted-foreground font-display">{label}</p>
                  <p className="font-display text-xs">{value}{unit}</p>
                </div>
              ))}
            </div>
            {result.serving && <p className="text-[9px] text-muted-foreground">Serving: {result.serving}</p>}

            {/* Category selector + add */}
            <div className="flex gap-1">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealCategory[]).map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`flex-1 py-1.5 text-[8px] font-display tracking-wider border transition-all rounded-full ${
                    selectedCategory === cat ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/20'
                  }`}>
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleAddToMealLog} className="terminal-button w-full text-xs py-2">
              ADD TO MEAL LOG
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
