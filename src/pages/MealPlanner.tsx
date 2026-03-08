import { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ChevronLeft, ChevronRight, Flame, Droplets, Leaf, Drumstick } from 'lucide-react';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  isVeg: boolean;
  isIndian: boolean;
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

type DietFilter = 'all' | 'veg' | 'non-veg';
type CuisineFilter = 'all' | 'indian' | 'international';

const weeklyPlans: DayPlan[] = [
  {
    day: 'MONDAY',
    meals: [
      { name: 'Overnight Oats with Berries', calories: 350, protein: 15, type: 'breakfast', isVeg: true, isIndian: false },
      { name: 'Grilled Chicken Quinoa Bowl', calories: 550, protein: 42, type: 'lunch', isVeg: false, isIndian: false },
      { name: 'Protein Energy Balls', calories: 200, protein: 12, type: 'snack', isVeg: true, isIndian: false },
      { name: 'Salmon with Sweet Potato', calories: 600, protein: 38, type: 'dinner', isVeg: false, isIndian: false },
      // Indian options
      { name: 'Poha with Peanuts & Curry Leaves', calories: 320, protein: 10, type: 'breakfast', isVeg: true, isIndian: true },
      { name: 'Chicken Biryani with Raita', calories: 580, protein: 40, type: 'lunch', isVeg: false, isIndian: true },
      { name: 'Chana Chaat', calories: 220, protein: 14, type: 'snack', isVeg: true, isIndian: true },
      { name: 'Palak Paneer with Roti', calories: 520, protein: 28, type: 'dinner', isVeg: true, isIndian: true },
    ],
  },
  {
    day: 'TUESDAY',
    meals: [
      { name: 'Acai Bowl with Granola', calories: 400, protein: 10, type: 'breakfast', isVeg: true, isIndian: false },
      { name: 'Turkey Avocado Wrap', calories: 480, protein: 35, type: 'lunch', isVeg: false, isIndian: false },
      { name: 'Greek Yogurt Parfait', calories: 250, protein: 18, type: 'snack', isVeg: true, isIndian: false },
      { name: 'Lean Beef Stir-Fry', calories: 520, protein: 40, type: 'dinner', isVeg: false, isIndian: false },
      { name: 'Upma with Vegetables', calories: 300, protein: 8, type: 'breakfast', isVeg: true, isIndian: true },
      { name: 'Rajma Chawal', calories: 480, protein: 22, type: 'lunch', isVeg: true, isIndian: true },
      { name: 'Sprouts Salad', calories: 180, protein: 16, type: 'snack', isVeg: true, isIndian: true },
      { name: 'Egg Curry with Rice', calories: 500, protein: 32, type: 'dinner', isVeg: false, isIndian: true },
    ],
  },
  {
    day: 'WEDNESDAY',
    meals: [
      { name: 'Chocolate Milk with Cookie Crumble', calories: 380, protein: 20, type: 'breakfast', isVeg: true, isIndian: false },
      { name: 'Chickpea Buddha Bowl', calories: 450, protein: 22, type: 'lunch', isVeg: true, isIndian: false },
      { name: 'Dragon Fruit Smoothie', calories: 220, protein: 8, type: 'snack', isVeg: true, isIndian: false },
      { name: 'Baked Cod with Veggies', calories: 480, protein: 36, type: 'dinner', isVeg: false, isIndian: false },
      { name: 'Idli Sambar', calories: 280, protein: 12, type: 'breakfast', isVeg: true, isIndian: true },
      { name: 'Chole Bhature', calories: 550, protein: 18, type: 'lunch', isVeg: true, isIndian: true },
      { name: 'Masala Peanuts', calories: 200, protein: 10, type: 'snack', isVeg: true, isIndian: true },
      { name: 'Fish Curry with Rice', calories: 520, protein: 36, type: 'dinner', isVeg: false, isIndian: true },
    ],
  },
  {
    day: 'THURSDAY',
    meals: [
      { name: 'Avocado Toast with Eggs', calories: 420, protein: 22, type: 'breakfast', isVeg: false, isIndian: false },
      { name: 'Grilled Fish Tacos', calories: 500, protein: 32, type: 'lunch', isVeg: false, isIndian: false },
      { name: 'Chia Pudding', calories: 180, protein: 6, type: 'snack', isVeg: true, isIndian: false },
      { name: 'Chicken Tikka with Rice', calories: 580, protein: 44, type: 'dinner', isVeg: false, isIndian: false },
      { name: 'Dosa with Chutney', calories: 350, protein: 8, type: 'breakfast', isVeg: true, isIndian: true },
      { name: 'Dal Tadka with Jeera Rice', calories: 450, protein: 20, type: 'lunch', isVeg: true, isIndian: true },
      { name: 'Roasted Makhana', calories: 150, protein: 6, type: 'snack', isVeg: true, isIndian: true },
      { name: 'Butter Chicken with Naan', calories: 620, protein: 42, type: 'dinner', isVeg: false, isIndian: true },
    ],
  },
  {
    day: 'FRIDAY',
    meals: [
      { name: 'PB & Banana Smoothie', calories: 400, protein: 25, type: 'breakfast', isVeg: true, isIndian: false },
      { name: 'Quinoa Veggie Bowl', calories: 420, protein: 18, type: 'lunch', isVeg: true, isIndian: false },
      { name: 'Trail Mix & Green Juice', calories: 280, protein: 10, type: 'snack', isVeg: true, isIndian: false },
      { name: 'Paneer Tikka with Roti', calories: 550, protein: 30, type: 'dinner', isVeg: true, isIndian: false },
      { name: 'Paratha with Curd', calories: 380, protein: 12, type: 'breakfast', isVeg: true, isIndian: true },
      { name: 'Chicken Keema with Pav', calories: 520, protein: 38, type: 'lunch', isVeg: false, isIndian: true },
      { name: 'Samosa (Baked)', calories: 240, protein: 6, type: 'snack', isVeg: true, isIndian: true },
      { name: 'Paneer Bhurji with Roti', calories: 480, protein: 28, type: 'dinner', isVeg: true, isIndian: true },
    ],
  },
  {
    day: 'SATURDAY',
    meals: [
      { name: 'Masala Omelette with Toast', calories: 380, protein: 28, type: 'breakfast', isVeg: false, isIndian: false },
      { name: 'Grilled Chicken Caesar', calories: 520, protein: 40, type: 'lunch', isVeg: false, isIndian: false },
      { name: 'Whey Protein Shake', calories: 200, protein: 30, type: 'snack', isVeg: true, isIndian: false },
      { name: 'Dal Makhani with Rice', calories: 500, protein: 20, type: 'dinner', isVeg: true, isIndian: false },
      { name: 'Aloo Paratha with Curd', calories: 420, protein: 10, type: 'breakfast', isVeg: true, isIndian: true },
      { name: 'Mutton Rogan Josh with Rice', calories: 600, protein: 44, type: 'lunch', isVeg: false, isIndian: true },
      { name: 'Dhokla', calories: 180, protein: 8, type: 'snack', isVeg: true, isIndian: true },
      { name: 'Kadhi Pakora with Rice', calories: 460, protein: 16, type: 'dinner', isVeg: true, isIndian: true },
    ],
  },
  {
    day: 'SUNDAY',
    meals: [
      { name: 'Pancakes with Maple & Fruit', calories: 450, protein: 12, type: 'breakfast', isVeg: true, isIndian: false },
      { name: 'Biryani with Raita', calories: 600, protein: 30, type: 'lunch', isVeg: false, isIndian: false },
      { name: 'Fruit Bowl with Honey', calories: 200, protein: 4, type: 'snack', isVeg: true, isIndian: false },
      { name: 'Grilled Prawns with Salad', calories: 480, protein: 38, type: 'dinner', isVeg: false, isIndian: false },
      { name: 'Puri Bhaji', calories: 400, protein: 8, type: 'breakfast', isVeg: true, isIndian: true },
      { name: 'Hyderabadi Biryani', calories: 620, protein: 34, type: 'lunch', isVeg: false, isIndian: true },
      { name: 'Lassi', calories: 200, protein: 8, type: 'snack', isVeg: true, isIndian: true },
      { name: 'Mixed Veg Curry with Chapati', calories: 440, protein: 14, type: 'dinner', isVeg: true, isIndian: true },
    ],
  },
];

const mealTypeLabels: Record<string, string> = {
  breakfast: '🌅 BREAKFAST',
  lunch: '☀️ LUNCH',
  snack: '🍎 SNACK',
  dinner: '🌙 DINNER',
};

const MealPlanner = () => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');
  const [cuisineFilter, setCuisineFilter] = useState<CuisineFilter>('all');

  const plan = weeklyPlans[currentDay];

  const filteredMeals = plan.meals.filter(meal => {
    if (dietFilter === 'veg' && !meal.isVeg) return false;
    if (dietFilter === 'non-veg' && meal.isVeg) return false;
    if (cuisineFilter === 'indian' && !meal.isIndian) return false;
    if (cuisineFilter === 'international' && meal.isIndian) return false;
    return true;
  });

  // Deduplicate by meal type (show one per type based on filters)
  const displayMeals = (['breakfast', 'lunch', 'snack', 'dinner'] as const).map(type => {
    const candidates = filteredMeals.filter(m => m.type === type);
    return candidates[0] || null;
  }).filter(Boolean) as Meal[];

  const totalCal = displayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = displayMeals.reduce((s, m) => s + m.protein, 0);

  const prev = () => setCurrentDay(d => (d - 1 + 7) % 7);
  const next = () => setCurrentDay(d => (d + 1) % 7);

  return (
    <div className="min-h-screen pb-24 pixel-grid">
      <div className="container py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-4xl tracking-wider">MEAL PLAN</h1>
          <p className="text-muted-foreground text-sm">Pre-built weekly nutrition guide</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-4 flex-wrap">
          <div className="flex gap-1.5">
            {([
              { id: 'all' as DietFilter, label: 'ALL', icon: null },
              { id: 'veg' as DietFilter, label: 'VEG', icon: Leaf },
              { id: 'non-veg' as DietFilter, label: 'NON-VEG', icon: Drumstick },
            ]).map(f => (
              <button key={f.id} onClick={() => setDietFilter(f.id)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-display tracking-wider border transition-colors ${
                  dietFilter === f.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/30 hover:border-foreground/60'
                }`}>
                {f.icon && <f.icon className="w-3 h-3" />}
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            {([
              { id: 'all' as CuisineFilter, label: '🌍 ALL' },
              { id: 'indian' as CuisineFilter, label: '🇮🇳 INDIAN' },
              { id: 'international' as CuisineFilter, label: '🌐 INTL' },
            ]).map(f => (
              <button key={f.id} onClick={() => setCuisineFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-display tracking-wider border transition-colors ${
                  cuisineFilter === f.id ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/30 hover:border-foreground/60'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Day Selector */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-6">
          <button onClick={prev} className="p-2 border border-foreground/20 hover:bg-muted transition-colors rounded-full"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex gap-2 overflow-x-auto px-2">
            {weeklyPlans.map((d, i) => (
              <button key={d.day} onClick={() => setCurrentDay(i)}
                className={`px-3 py-2 text-xs font-display tracking-wider transition-all whitespace-nowrap rounded-full ${
                  i === currentDay ? 'bg-strivo-red text-white' : 'border border-foreground/20 hover:border-foreground/40'
                }`}>{d.day.slice(0, 3)}</button>
            ))}
          </div>
          <button onClick={next} className="p-2 border border-foreground/20 hover:bg-muted transition-colors rounded-full"><ChevronRight className="w-5 h-5" /></button>
        </motion.div>

        {/* Day Summary */}
        <motion.div key={`${currentDay}-${dietFilter}-${cuisineFilter}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card mb-6">
          <h2 className="font-display text-2xl tracking-wider mb-3">{plan.day}</h2>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-strivo-red" />
              <span className="font-display text-lg">{totalCal}</span>
              <span className="text-xs text-muted-foreground">KCAL</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              <span className="font-display text-lg">{totalProtein}g</span>
              <span className="text-xs text-muted-foreground">PROTEIN</span>
            </div>
          </div>
        </motion.div>

        {/* Meals */}
        <div className="space-y-3">
          {displayMeals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-display tracking-wider">
              NO MEALS MATCH YOUR FILTERS
            </div>
          ) : displayMeals.map((meal, i) => (
            <motion.div key={meal.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-display tracking-wider text-muted-foreground">{mealTypeLabels[meal.type]}</span>
                <div className="flex gap-1">
                  {meal.isVeg && <span className="text-[9px] px-1.5 py-0.5 border border-green-500/30 text-green-400 font-display">VEG</span>}
                  {!meal.isVeg && <span className="text-[9px] px-1.5 py-0.5 border border-red-500/30 text-red-400 font-display">NON-VEG</span>}
                  {meal.isIndian && <span className="text-[9px] px-1.5 py-0.5 border border-orange-500/30 text-orange-400 font-display">🇮🇳</span>}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-display tracking-wider text-sm">{meal.name.toUpperCase()}</p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{meal.calories} kcal</span>
                  <span>{meal.protein}g protein</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
