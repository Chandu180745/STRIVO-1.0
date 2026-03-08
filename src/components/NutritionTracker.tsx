import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Plus, X, Search, Flame, Apple, Beef, Droplets, TrendingUp, Trash2 } from 'lucide-react';
import { useSettings, type MealCategory, type MealLogEntry } from '@/hooks/useSettings';

// Mock food database (~80 items)
const foodDatabase = [
  // Breakfast items
  { name: 'Oatmeal with Berries', calories: 310, protein: 12, carbs: 52, fat: 7, category: 'breakfast' as const },
  { name: 'Scrambled Eggs (3)', calories: 280, protein: 21, carbs: 2, fat: 20, category: 'breakfast' as const },
  { name: 'Greek Yogurt Parfait', calories: 250, protein: 18, carbs: 30, fat: 8, category: 'breakfast' as const },
  { name: 'Avocado Toast', calories: 320, protein: 10, carbs: 28, fat: 20, category: 'breakfast' as const },
  { name: 'Protein Pancakes', calories: 350, protein: 28, carbs: 38, fat: 8, category: 'breakfast' as const },
  { name: 'Smoothie Bowl', calories: 380, protein: 14, carbs: 58, fat: 10, category: 'breakfast' as const },
  { name: 'Idli Sambar', calories: 280, protein: 12, carbs: 48, fat: 4, category: 'breakfast' as const },
  { name: 'Poha', calories: 250, protein: 6, carbs: 42, fat: 8, category: 'breakfast' as const },
  { name: 'Upma', calories: 220, protein: 6, carbs: 36, fat: 7, category: 'breakfast' as const },
  { name: 'Dosa with Chutney', calories: 300, protein: 8, carbs: 44, fat: 10, category: 'breakfast' as const },
  { name: 'Paratha with Curd', calories: 380, protein: 12, carbs: 42, fat: 18, category: 'breakfast' as const },
  { name: 'Banana Shake', calories: 220, protein: 8, carbs: 38, fat: 4, category: 'breakfast' as const },
  // Lunch items
  { name: 'Grilled Chicken Breast', calories: 280, protein: 42, carbs: 0, fat: 12, category: 'lunch' as const },
  { name: 'Chicken Biryani', calories: 520, protein: 32, carbs: 62, fat: 14, category: 'lunch' as const },
  { name: 'Quinoa Salad Bowl', calories: 380, protein: 14, carbs: 52, fat: 12, category: 'lunch' as const },
  { name: 'Rajma Chawal', calories: 420, protein: 18, carbs: 64, fat: 8, category: 'lunch' as const },
  { name: 'Dal Tadka with Rice', calories: 400, protein: 16, carbs: 62, fat: 8, category: 'lunch' as const },
  { name: 'Chole Bhature', calories: 550, protein: 18, carbs: 68, fat: 22, category: 'lunch' as const },
  { name: 'Turkey Wrap', calories: 380, protein: 28, carbs: 34, fat: 14, category: 'lunch' as const },
  { name: 'Paneer Tikka', calories: 320, protein: 22, carbs: 8, fat: 22, category: 'lunch' as const },
  { name: 'Fish Curry with Rice', calories: 480, protein: 34, carbs: 52, fat: 14, category: 'lunch' as const },
  { name: 'Grilled Salmon', calories: 360, protein: 38, carbs: 0, fat: 22, category: 'lunch' as const },
  { name: 'Buddha Bowl', calories: 420, protein: 16, carbs: 58, fat: 14, category: 'lunch' as const },
  { name: 'Chicken Caesar Salad', calories: 380, protein: 32, carbs: 12, fat: 24, category: 'lunch' as const },
  // Dinner items
  { name: 'Palak Paneer with Roti', calories: 440, protein: 22, carbs: 38, fat: 22, category: 'dinner' as const },
  { name: 'Grilled Steak', calories: 480, protein: 44, carbs: 0, fat: 32, category: 'dinner' as const },
  { name: 'Butter Chicken with Naan', calories: 580, protein: 36, carbs: 44, fat: 28, category: 'dinner' as const },
  { name: 'Baked Cod with Veggies', calories: 320, protein: 32, carbs: 18, fat: 12, category: 'dinner' as const },
  { name: 'Egg Curry with Rice', calories: 420, protein: 22, carbs: 48, fat: 16, category: 'dinner' as const },
  { name: 'Mixed Veg Curry', calories: 340, protein: 10, carbs: 42, fat: 14, category: 'dinner' as const },
  { name: 'Tandoori Chicken', calories: 280, protein: 38, carbs: 4, fat: 12, category: 'dinner' as const },
  { name: 'Pasta Primavera', calories: 420, protein: 14, carbs: 62, fat: 12, category: 'dinner' as const },
  { name: 'Kadhi Pakora with Rice', calories: 460, protein: 14, carbs: 58, fat: 18, category: 'dinner' as const },
  { name: 'Shrimp Stir Fry', calories: 340, protein: 30, carbs: 22, fat: 14, category: 'dinner' as const },
  // Snacks
  { name: 'Protein Bar', calories: 220, protein: 20, carbs: 24, fat: 8, category: 'snack' as const },
  { name: 'Mixed Nuts (30g)', calories: 180, protein: 6, carbs: 6, fat: 16, category: 'snack' as const },
  { name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, category: 'snack' as const },
  { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, category: 'snack' as const },
  { name: 'Whey Protein Shake', calories: 150, protein: 30, carbs: 4, fat: 2, category: 'snack' as const },
  { name: 'Chana Chaat', calories: 200, protein: 10, carbs: 28, fat: 6, category: 'snack' as const },
  { name: 'Roasted Makhana', calories: 120, protein: 4, carbs: 18, fat: 4, category: 'snack' as const },
  { name: 'Dhokla', calories: 160, protein: 6, carbs: 24, fat: 4, category: 'snack' as const },
  { name: 'Sprouts Salad', calories: 140, protein: 12, carbs: 18, fat: 2, category: 'snack' as const },
  { name: 'Energy Balls (2)', calories: 180, protein: 8, carbs: 22, fat: 8, category: 'snack' as const },
  { name: 'Boiled Eggs (2)', calories: 156, protein: 12, carbs: 1, fat: 10, category: 'snack' as const },
  { name: 'Peanut Butter Toast', calories: 260, protein: 10, carbs: 28, fat: 14, category: 'snack' as const },
  { name: 'Lassi', calories: 180, protein: 6, carbs: 28, fat: 4, category: 'snack' as const },
  { name: 'Dark Chocolate (20g)', calories: 110, protein: 2, carbs: 10, fat: 8, category: 'snack' as const },
  { name: 'Rice Cake with Hummus', calories: 130, protein: 4, carbs: 20, fat: 4, category: 'snack' as const },
  { name: 'Cottage Cheese (100g)', calories: 100, protein: 12, carbs: 4, fat: 4, category: 'snack' as const },
];

const categoryConfig: Record<MealCategory, { label: string; emoji: string; color: string }> = {
  breakfast: { label: 'BREAKFAST', emoji: '🌅', color: 'hsl(45 100% 50%)' },
  lunch: { label: 'LUNCH', emoji: '☀️', color: 'hsl(25 100% 50%)' },
  dinner: { label: 'DINNER', emoji: '🌙', color: 'hsl(270 70% 50%)' },
  snack: { label: 'SNACK', emoji: '🍎', color: 'hsl(140 60% 45%)' },
};

export const NutritionTracker = () => {
  const { mealLogs, addMealLog, removeMealLog } = useSettings();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [customMode, setCustomMode] = useState(false);
  const [customMeal, setCustomMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = mealLogs.filter(m => m.date === today);

  const todayTotals = useMemo(() => {
    return todayMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [todayMeals]);

  const filteredFoods = foodDatabase.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddFood = (food: typeof foodDatabase[0]) => {
    addMealLog({
      id: crypto.randomUUID(),
      date: today,
      category: selectedCategory,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    });
    setShowAddModal(false);
    setSearchQuery('');
  };

  const handleAddCustom = () => {
    if (!customMeal.name || !customMeal.calories) return;
    addMealLog({
      id: crypto.randomUUID(),
      date: today,
      category: selectedCategory,
      name: customMeal.name,
      calories: parseInt(customMeal.calories) || 0,
      protein: parseInt(customMeal.protein) || 0,
      carbs: parseInt(customMeal.carbs) || 0,
      fat: parseInt(customMeal.fat) || 0,
    });
    setCustomMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setCustomMode(false);
    setShowAddModal(false);
  };

  // Weekly nutrition insight
  const last7Days = useMemo(() => {
    const days: { date: string; calories: number; protein: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayMeals = mealLogs.filter(m => m.date === dateStr);
      days.push({
        date: dateStr,
        calories: dayMeals.reduce((s, m) => s + m.calories, 0),
        protein: dayMeals.reduce((s, m) => s + m.protein, 0),
      });
    }
    return days;
  }, [mealLogs]);

  const avgCalories = Math.round(last7Days.reduce((s, d) => s + d.calories, 0) / 7);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-strivo-red" />
          NUTRITION TRACKER
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="terminal-button text-xs py-2 px-3 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> LOG MEAL
        </motion.button>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'CALORIES', value: todayTotals.calories, unit: 'kcal', icon: Flame, color: 'text-strivo-red' },
          { label: 'PROTEIN', value: todayTotals.protein, unit: 'g', icon: Beef, color: 'text-strivo-red' },
          { label: 'CARBS', value: todayTotals.carbs, unit: 'g', icon: Apple, color: 'text-sky-400' },
          { label: 'FATS', value: todayTotals.fat, unit: 'g', icon: Droplets, color: 'text-yellow-400' },
        ].map(({ label, value, unit, icon: Icon, color }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.04, rotateY: 4 }}
            className="glass-card text-center card-3d p-3"
            style={{ perspective: 800 }}
          >
            <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
            <p className="font-display text-lg">{value}</p>
            <p className="text-[8px] text-muted-foreground font-display">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Today's Meals by Category */}
      {(['breakfast', 'lunch', 'dinner', 'snack'] as MealCategory[]).map(cat => {
        const catMeals = todayMeals.filter(m => m.category === cat);
        if (catMeals.length === 0) return null;
        const cfg = categoryConfig[cat];
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card card-3d"
          >
            <p className="text-[10px] font-display tracking-wider text-muted-foreground mb-2">
              {cfg.emoji} {cfg.label}
            </p>
            <div className="space-y-1.5">
              {catMeals.map(meal => (
                <div key={meal.id} className="flex items-center justify-between py-1 border-b border-foreground/5 last:border-0">
                  <span className="text-sm font-display tracking-wider">{meal.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{meal.calories}kcal</span>
                    <span className="text-xs text-muted-foreground">{meal.protein}g P</span>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeMealLog(meal.id)} className="p-1 hover:text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {todayMeals.length === 0 && (
        <div className="glass-card text-center py-8">
          <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-display text-sm tracking-wider text-muted-foreground">NO MEALS LOGGED TODAY</p>
          <p className="text-xs text-muted-foreground mt-1">Tap "LOG MEAL" to start tracking</p>
        </div>
      )}

      {/* Weekly Insight */}
      <motion.div whileHover={{ scale: 1.01 }} className="glass-card card-3d">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-strivo-red" />
          <span className="text-xs font-display tracking-wider">7-DAY NUTRITION INSIGHT</span>
        </div>
        <div className="flex gap-1 items-end h-16 mb-2">
          {last7Days.map((d, i) => {
            const maxCal = Math.max(...last7Days.map(x => x.calories), 1);
            const h = (d.calories / maxCal) * 100;
            return (
              <motion.div
                key={d.date}
                className="flex-1 rounded-t"
                style={{ backgroundColor: d.calories > 0 ? 'hsl(var(--strivo-red))' : 'hsl(var(--foreground)/0.1)' }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(h, 4)}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                title={`${d.date}: ${d.calories} kcal`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[8px] text-muted-foreground font-display">
          {last7Days.map(d => (
            <span key={d.date}>{new Date(d.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'narrow' })}</span>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Avg: <span className="text-foreground font-display">{avgCalories} kcal/day</span>
          {avgCalories > 0 && avgCalories < 1500 && ' • ⚠️ Consider eating more'}
          {avgCalories > 3000 && ' • ⚠️ High calorie intake'}
        </p>
      </motion.div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 100, scale: 0.95, rotateX: 5 }}
              animate={{ y: 0, scale: 1, rotateX: 0 }}
              exit={{ y: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="glass-card w-full max-w-md max-h-[80vh] overflow-y-auto border-2 border-foreground/20"
              style={{ perspective: 1000 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display tracking-wider">LOG MEAL</h3>
                <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-1 mb-4">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-1 py-2 text-[10px] font-display tracking-wider border transition-all rounded-full ${
                      selectedCategory === cat
                        ? 'bg-strivo-red text-white border-strivo-red'
                        : 'border-foreground/20 hover:border-foreground/40'
                    }`}
                  >
                    {categoryConfig[cat].emoji} {categoryConfig[cat].label}
                  </button>
                ))}
              </div>

              {/* Toggle custom/search */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setCustomMode(false)}
                  className={`flex-1 py-2 text-xs font-display border rounded-full ${!customMode ? 'bg-foreground text-background' : 'border-foreground/20'}`}
                >
                  SEARCH FOOD
                </button>
                <button
                  onClick={() => setCustomMode(true)}
                  className={`flex-1 py-2 text-xs font-display border rounded-full ${customMode ? 'bg-foreground text-background' : 'border-foreground/20'}`}
                >
                  CUSTOM ENTRY
                </button>
              </div>

              {!customMode ? (
                <>
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search foods..."
                      className="terminal-input w-full pl-10 py-2 text-sm"
                      autoFocus
                    />
                  </div>

                  {/* Food List */}
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {filteredFoods.map((food, i) => (
                      <motion.button
                        key={food.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => handleAddFood(food)}
                        className="w-full text-left py-2.5 px-3 border border-foreground/10 hover:border-strivo-red/40 hover:bg-strivo-red/5 transition-all rounded-2xl"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-display tracking-wider">{food.name}</span>
                          <span className="text-xs text-strivo-red font-display">{food.calories} kcal</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-muted-foreground mt-0.5">
                          <span>P: {food.protein}g</span>
                          <span>C: {food.carbs}g</span>
                          <span>F: {food.fat}g</span>
                        </div>
                      </motion.button>
                    ))}
                    {filteredFoods.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-4">No foods found</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <input type="text" value={customMeal.name} onChange={e => setCustomMeal(p => ({ ...p, name: e.target.value }))} placeholder="Food name" className="terminal-input w-full py-2 text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={customMeal.calories} onChange={e => setCustomMeal(p => ({ ...p, calories: e.target.value }))} placeholder="Calories" className="terminal-input w-full py-2 text-sm" />
                    <input type="number" value={customMeal.protein} onChange={e => setCustomMeal(p => ({ ...p, protein: e.target.value }))} placeholder="Protein (g)" className="terminal-input w-full py-2 text-sm" />
                    <input type="number" value={customMeal.carbs} onChange={e => setCustomMeal(p => ({ ...p, carbs: e.target.value }))} placeholder="Carbs (g)" className="terminal-input w-full py-2 text-sm" />
                    <input type="number" value={customMeal.fat} onChange={e => setCustomMeal(p => ({ ...p, fat: e.target.value }))} placeholder="Fat (g)" className="terminal-input w-full py-2 text-sm" />
                  </div>
                  <button onClick={handleAddCustom} disabled={!customMeal.name || !customMeal.calories} className="terminal-button w-full disabled:opacity-40">
                    ADD CUSTOM MEAL
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
