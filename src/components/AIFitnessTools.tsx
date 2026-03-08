import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Utensils, ShieldAlert, Loader2, Sparkles, Dumbbell, Apple, Map, Calculator, Mic, Heart, Scale, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useFitnessData } from '@/hooks/useFitnessData';
import { toast } from 'sonner';

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-fitness`;

type AITab = 'coach' | 'meals' | 'injury' | 'workout-plan' | 'diet-plan' | 'transformation' | 'macro-calc' | 'voice' | 'motivation' | 'bulk-cut' | 'calorie-predict';

const tabs: { id: AITab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'coach', label: 'AI COACH', icon: <Brain className="w-3.5 h-3.5" />, desc: 'Real-time Q&A' },
  { id: 'workout-plan', label: 'WORKOUT PLAN', icon: <Dumbbell className="w-3.5 h-3.5" />, desc: 'Personalized plans' },
  { id: 'diet-plan', label: 'DIET PLAN', icon: <Apple className="w-3.5 h-3.5" />, desc: 'Weekly diet' },
  { id: 'meals', label: 'MEAL GEN', icon: <Utensils className="w-3.5 h-3.5" />, desc: 'Daily meals' },
  { id: 'macro-calc', label: 'MACRO CALC', icon: <Calculator className="w-3.5 h-3.5" />, desc: 'AI macros' },
  { id: 'transformation', label: 'TRANSFORM', icon: <Map className="w-3.5 h-3.5" />, desc: 'Body roadmap' },
  { id: 'bulk-cut', label: 'BULK/CUT', icon: <Scale className="w-3.5 h-3.5" />, desc: 'Strategy sim' },
  { id: 'calorie-predict', label: 'WHAT IF?', icon: <HelpCircle className="w-3.5 h-3.5" />, desc: 'Calorie predict' },
  { id: 'voice', label: 'VOICE COACH', icon: <Mic className="w-3.5 h-3.5" />, desc: 'Voice trainer' },
  { id: 'motivation', label: 'MOTIVATE', icon: <Heart className="w-3.5 h-3.5" />, desc: 'Emotional support' },
  { id: 'injury', label: 'INJURY', icon: <ShieldAlert className="w-3.5 h-3.5" />, desc: 'Prevention' },
];

export const AIFitnessTools = () => {
  const [tab, setTab] = useState<AITab>('coach');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showAllTabs, setShowAllTabs] = useState(false);

  const { fitnessGoal, experienceLevel, weight, age, height, totalWorkoutsLogged, currentStreak, bodyFatPercentage } = useSettings();
  const { logs } = useFitnessData();

  const setInput = (key: string, val: string) => setInputs(p => ({ ...p, [key]: val }));
  const getInput = (key: string, def = '') => inputs[key] ?? def;

  const callAI = async (type: string, messages: any[]) => {
    setLoading(true);
    try {
      const resp = await fetch(AI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages, type }),
      });
      if (!resp.ok) {
        if (resp.status === 429) throw new Error('Rate limited. Try again shortly.');
        if (resp.status === 402) throw new Error('AI credits exhausted.');
        throw new Error('AI service error');
      }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || 'No response generated.';
      // Try parse JSON
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) return { parsed: JSON.parse(jsonMatch[0]), raw: content };
      } catch {}
      return { raw: content };
    } catch (e: any) {
      toast.error(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const userContext = `User: ${weight || 70}kg, ${height || 170}cm, ${age || 25}yo, body fat: ${bodyFatPercentage || 'unknown'}%, goal: ${fitnessGoal || 'general fitness'}, level: ${experienceLevel || 'beginner'}, ${totalWorkoutsLogged} workouts logged, ${currentStreak} day streak`;

  const handleAction = async (type: AITab) => {
    let messages: any[] = [];
    switch (type) {
      case 'coach':
        if (!getInput('coach').trim()) return;
        messages = [{ role: 'user', content: `Context: ${userContext}\n\nQuestion: ${getInput('coach')}` }];
        break;
      case 'workout-plan':
        messages = [{ role: 'user', content: `${userContext}. Equipment: ${getInput('equipment', 'full gym')}. Days available: ${getInput('days', '5')}. Generate my personalized workout plan.` }];
        break;
      case 'diet-plan':
        messages = [{ role: 'user', content: `${userContext}. Diet preference: ${getInput('dietPref', 'balanced')}. Budget: ${getInput('budget', 'moderate')}. Generate my weekly diet plan.` }];
        break;
      case 'meals':
        messages = [{ role: 'user', content: `Generate a ${getInput('mealDiet', 'balanced')} meal plan for ${getInput('mealCal', '2000')} calories. ${userContext}` }];
        break;
      case 'macro-calc':
        messages = [{ role: 'user', content: `${userContext}. Activity level: ${getInput('activity', 'moderate')}. Calculate my precise macro targets.` }];
        break;
      case 'transformation':
        messages = [{ role: 'user', content: `${userContext}. Target: ${getInput('target', 'lean muscular build')}. Create my 12-week body transformation roadmap.` }];
        break;
      case 'bulk-cut':
        messages = [{ role: 'user', content: `${userContext}. Should I bulk, cut, or recomp? Simulate both strategies and recommend.` }];
        break;
      case 'calorie-predict':
        if (!getInput('food').trim()) return;
        messages = [{ role: 'user', content: `What if I eat: ${getInput('food')}? My goal is ${fitnessGoal}. Predict calories and impact.` }];
        break;
      case 'voice':
        messages = [{ role: 'user', content: `I'm doing ${getInput('voiceExercise', 'squats')} right now. Give me coaching cues! Set ${getInput('voiceSet', '2')} of ${getInput('voiceSets', '3')}.` }];
        break;
      case 'motivation':
        messages = [{ role: 'user', content: `${userContext}. I'm feeling: ${getInput('mood', 'unmotivated')}. ${getInput('motivationNote', 'I want to give up today.')}` }];
        break;
      case 'injury': {
        const recentDays = logs.slice(-7);
        const totalActive = recentDays.reduce((s, l) => s + l.activeMinutes, 0);
        messages = [{ role: 'user', content: `Last 7 days: ${recentDays.length} active days, ${totalActive} total active minutes. ${userContext}` }];
        break;
      }
    }
    const aiType = type === 'coach' ? 'chatbot' : type === 'meals' ? 'meal-generator' : type === 'injury' ? 'injury-prevention' : type;
    const result = await callAI(aiType, messages);
    if (result) setResults(p => ({ ...p, [type]: result }));
  };

  const visibleTabs = showAllTabs ? tabs : tabs.slice(0, 5);

  const renderResult = (type: AITab) => {
    const r = results[type];
    if (!r) return null;

    // Special renderers for JSON results
    if (r.parsed) {
      if (type === 'meals' && r.parsed.meals) {
        return (
          <div className="space-y-2">
            {r.parsed.meals.map((m: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="p-2.5 border border-foreground/10 rounded-2xl bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="font-display text-[10px] tracking-wider text-accent">{m.category?.toUpperCase()}</span>
                  <span className="text-[9px] text-muted-foreground">{m.calories} kcal</span>
                </div>
                <p className="text-xs font-medium mt-0.5">{m.name}</p>
                <div className="flex gap-2 mt-1 text-[8px] text-muted-foreground font-display">
                  <span>P: {m.protein}g</span><span>C: {m.carbs}g</span><span>F: {m.fat}g</span>
                </div>
              </motion.div>
            ))}
          </div>
        );
      }
      if (type === 'macro-calc' && r.parsed.macros) {
        const d = r.parsed;
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 border border-foreground/10 rounded-2xl bg-muted/20 text-center">
                <p className="text-[9px] font-display text-muted-foreground">TDEE</p>
                <p className="font-display text-lg">{d.tdee}</p>
              </div>
              <div className="p-2.5 border border-foreground/10 rounded-2xl bg-muted/20 text-center">
                <p className="text-[9px] font-display text-muted-foreground">TARGET</p>
                <p className="font-display text-lg">{d.target_calories}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['protein', 'carbs', 'fat'].map(m => (
                <div key={m} className="p-2 border border-foreground/10 rounded-xl bg-muted/20 text-center">
                  <p className="text-[9px] font-display text-muted-foreground">{m.toUpperCase()}</p>
                  <p className="font-display text-sm">{d.macros[m]?.grams}g</p>
                  <p className="text-[8px] text-muted-foreground">{d.macros[m]?.percentage}%</p>
                </div>
              ))}
            </div>
            {d.explanation && <p className="text-xs text-muted-foreground">{d.explanation}</p>}
          </div>
        );
      }
      if (type === 'calorie-predict' && r.parsed.calories) {
        const d = r.parsed;
        const verdictColor = d.verdict === 'GOOD' ? 'text-green-400' : d.verdict === 'LIMIT' ? 'text-red-400' : 'text-yellow-400';
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm">{d.food}</span>
              <span className={`font-display text-xs ${verdictColor} px-2 py-0.5 border rounded-full`}>{d.verdict}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[['CAL', d.calories], ['P', `${d.protein}g`], ['C', `${d.carbs}g`], ['F', `${d.fat}g`]].map(([l, v]) => (
                <div key={l as string} className="p-1.5 border border-foreground/10 rounded-xl bg-muted/20">
                  <p className="text-[8px] font-display text-muted-foreground">{l}</p>
                  <p className="font-display text-xs">{v}</p>
                </div>
              ))}
            </div>
            {d.explanation && <p className="text-[10px] text-muted-foreground">{d.explanation}</p>}
            {d.healthierAlternative && <p className="text-[10px] text-accent">💡 Try: {d.healthierAlternative}</p>}
          </div>
        );
      }
      if (type === 'bulk-cut' && r.parsed.recommendation) {
        const d = r.parsed;
        return (
          <div className="space-y-2">
            <div className="text-center p-3 border border-foreground/10 rounded-2xl bg-muted/20">
              <p className="text-[9px] font-display text-muted-foreground">RECOMMENDATION</p>
              <p className="font-display text-2xl text-accent">{d.recommendation}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{d.duration} • {d.calorieAdjustment}</p>
            </div>
            <p className="text-xs text-muted-foreground">{d.reasoning}</p>
            {d.warnings?.map((w: string, i: number) => (
              <p key={i} className="text-[10px] text-yellow-400">⚠ {w}</p>
            ))}
          </div>
        );
      }
      if (type === 'transformation' && r.parsed.phases) {
        return (
          <div className="space-y-2">
            {r.parsed.phases.map((p: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="p-2.5 border border-foreground/10 rounded-2xl bg-muted/20">
                <div className="flex justify-between">
                  <span className="font-display text-[10px] text-accent">WEEKS {p.weeks}</span>
                  <span className="text-[9px] text-muted-foreground">{p.title}</span>
                </div>
                <p className="text-[10px] mt-1"><strong>Focus:</strong> {p.focus}</p>
                <p className="text-[10px] text-muted-foreground">{p.expectedProgress}</p>
              </motion.div>
            ))}
          </div>
        );
      }
      if (type === 'workout-plan' && r.parsed.plan) {
        return (
          <div className="space-y-2">
            {r.parsed.plan.map((d: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="p-2.5 border border-foreground/10 rounded-2xl bg-muted/20">
                <div className="flex justify-between items-center">
                  <span className="font-display text-[10px] text-accent">{d.day?.toUpperCase()}</span>
                  <span className="text-[9px] text-muted-foreground">{d.duration}</span>
                </div>
                <p className="text-xs font-medium">{d.focus}</p>
                {d.exercises?.slice(0, 4).map((ex: any, j: number) => (
                  <p key={j} className="text-[9px] text-muted-foreground">• {ex.name} — {ex.sets}×{ex.reps}</p>
                ))}
              </motion.div>
            ))}
          </div>
        );
      }
      if (type === 'diet-plan' && r.parsed.dietPlan) {
        return (
          <div className="space-y-2">
            {r.parsed.dailyTargets && (
              <div className="grid grid-cols-4 gap-1 text-center">
                {[['CAL', r.parsed.dailyTargets.calories], ['P', `${r.parsed.dailyTargets.protein}g`], ['C', `${r.parsed.dailyTargets.carbs}g`], ['F', `${r.parsed.dailyTargets.fat}g`]].map(([l, v]) => (
                  <div key={l as string} className="p-1.5 border border-foreground/10 rounded-xl bg-muted/20">
                    <p className="text-[8px] font-display text-muted-foreground">{l}</p>
                    <p className="font-display text-xs">{v}</p>
                  </div>
                ))}
              </div>
            )}
            {r.parsed.dietPlan.slice(0, 3).map((d: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-2.5 border border-foreground/10 rounded-2xl bg-muted/20">
                <div className="flex justify-between">
                  <span className="font-display text-[10px] text-accent">{d.day?.toUpperCase()}</span>
                  <span className="text-[9px] text-muted-foreground">{d.totalCalories} kcal</span>
                </div>
                {d.meals?.slice(0, 3).map((m: any, j: number) => (
                  <p key={j} className="text-[9px] text-muted-foreground">• {m.time} — {m.name} ({m.calories} cal)</p>
                ))}
              </motion.div>
            ))}
          </div>
        );
      }
    }

    // Fallback: raw text
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="p-3 border border-foreground/10 bg-muted/30 rounded-2xl text-xs whitespace-pre-wrap">
        {r.raw}
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
      <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" /> STRIVO AI TOOLS
      </h3>

      {/* Tab grid */}
      <div className="flex flex-wrap gap-1 mb-3">
        {visibleTabs.map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.95 }} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1 px-2 py-1.5 font-display text-[8px] tracking-wider border rounded-full transition-all ${
              tab === t.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 text-muted-foreground'
            }`}>{t.icon}{t.label}</motion.button>
        ))}
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAllTabs(!showAllTabs)}
          className="flex items-center gap-1 px-2 py-1.5 font-display text-[8px] tracking-wider border border-foreground/20 rounded-full text-muted-foreground">
          {showAllTabs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showAllTabs ? 'LESS' : `+${tabs.length - 5}`}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
          
          {/* AI Coach */}
          {tab === 'coach' && (
            <>
              <div className="flex gap-2">
                <input type="text" value={getInput('coach')} onChange={e => setInput('coach', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAction('coach')}
                  placeholder="Ask anything about fitness..."
                  className="flex-1 bg-transparent border border-foreground/20 px-3 py-2 text-xs focus:outline-none focus:border-foreground/50 rounded-full" />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleAction('coach')} disabled={loading}
                  className="terminal-button text-[9px] px-3 py-2 flex items-center gap-1">
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />} ASK
                </motion.button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {['Suggest a workout', 'Diet tips for cutting', 'Best supplements', 'How to fix posture'].map(q => (
                  <button key={q} onClick={() => setInput('coach', q)}
                    className="text-[8px] font-display tracking-wider px-2 py-1 border border-foreground/10 rounded-full text-muted-foreground hover:text-foreground transition-all">{q}</button>
                ))}
              </div>
            </>
          )}

          {/* Workout Plan */}
          {tab === 'workout-plan' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground">EQUIPMENT</label>
                  <select value={getInput('equipment', 'full gym')} onChange={e => setInput('equipment', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1">
                    <option value="full gym">Full Gym</option>
                    <option value="home">Home Only</option>
                    <option value="dumbbells only">Dumbbells Only</option>
                    <option value="bodyweight">Bodyweight</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground">DAYS/WEEK</label>
                  <select value={getInput('days', '5')} onChange={e => setInput('days', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1">
                    {['3', '4', '5', '6'].map(d => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('workout-plan')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Dumbbell className="w-4 h-4" />} GENERATE PLAN
              </motion.button>
            </div>
          )}

          {/* Diet Plan */}
          {tab === 'diet-plan' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground">DIET TYPE</label>
                  <select value={getInput('dietPref', 'balanced')} onChange={e => setInput('dietPref', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1">
                    {['balanced', 'high-protein', 'keto', 'vegan', 'vegetarian', 'paleo'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground">BUDGET</label>
                  <select value={getInput('budget', 'moderate')} onChange={e => setInput('budget', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1">
                    {['low', 'moderate', 'high'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('diet-plan')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Apple className="w-4 h-4" />} GENERATE DIET PLAN
              </motion.button>
            </div>
          )}

          {/* Meal Generator */}
          {tab === 'meals' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground">CALORIES</label>
                  <input type="number" value={getInput('mealCal', '2000')} onChange={e => setInput('mealCal', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1" />
                </div>
                <div>
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground">DIET</label>
                  <select value={getInput('mealDiet', 'balanced')} onChange={e => setInput('mealDiet', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1">
                    {['balanced', 'high-protein', 'keto', 'vegan', 'vegetarian'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('meals')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Utensils className="w-4 h-4" />} GENERATE MEALS
              </motion.button>
            </div>
          )}

          {/* Macro Calculator */}
          {tab === 'macro-calc' && (
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-display tracking-wider text-muted-foreground">ACTIVITY LEVEL</label>
                <select value={getInput('activity', 'moderate')} onChange={e => setInput('activity', e.target.value)}
                  className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1">
                  {['sedentary', 'lightly active', 'moderate', 'very active', 'extremely active'].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('macro-calc')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />} CALCULATE MACROS
              </motion.button>
            </div>
          )}

          {/* Body Transformation */}
          {tab === 'transformation' && (
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-display tracking-wider text-muted-foreground">TARGET PHYSIQUE</label>
                <input type="text" value={getInput('target', 'lean muscular build')} onChange={e => setInput('target', e.target.value)}
                  className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1"
                  placeholder="e.g., lean & muscular, athletic, shredded..." />
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('transformation')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />} CREATE ROADMAP
              </motion.button>
            </div>
          )}

          {/* Bulk/Cut */}
          {tab === 'bulk-cut' && (
            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground">AI will analyze your stats ({weight || '?'}kg, {bodyFatPercentage || '?'}% BF) and recommend whether to bulk, cut, or recomp.</p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('bulk-cut')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />} SIMULATE STRATEGY
              </motion.button>
            </div>
          )}

          {/* Calorie Prediction */}
          {tab === 'calorie-predict' && (
            <div className="space-y-2">
              <input type="text" value={getInput('food')} onChange={e => setInput('food', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAction('calorie-predict')}
                placeholder="e.g., 2 samosas with chutney, a plate of biryani..."
                className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full" />
              <div className="flex gap-1.5 flex-wrap">
                {['Pizza slice', 'Chicken biryani', 'Protein shake', 'Dosa with sambar'].map(f => (
                  <button key={f} onClick={() => setInput('food', f)}
                    className="text-[8px] font-display px-2 py-1 border border-foreground/10 rounded-full text-muted-foreground hover:text-foreground transition-all">{f}</button>
                ))}
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('calorie-predict')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />} PREDICT
              </motion.button>
            </div>
          )}

          {/* Voice Coach */}
          {tab === 'voice' && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground">EXERCISE</label>
                  <input type="text" value={getInput('voiceExercise', 'squats')} onChange={e => setInput('voiceExercise', e.target.value)}
                    className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1" />
                </div>
                <div>
                  <label className="text-[9px] font-display tracking-wider text-muted-foreground">SET</label>
                  <input type="text" value={`${getInput('voiceSet', '2')}/${getInput('voiceSets', '3')}`}
                    onChange={e => {
                      const [s, t] = e.target.value.split('/');
                      setInput('voiceSet', s || '1');
                      setInput('voiceSets', t || '3');
                    }}
                    className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1" placeholder="2/3" />
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('voice')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />} GET COACHING CUE
              </motion.button>
            </div>
          )}

          {/* Motivation */}
          {tab === 'motivation' && (
            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-display tracking-wider text-muted-foreground">HOW ARE YOU FEELING?</label>
                <select value={getInput('mood', 'unmotivated')} onChange={e => setInput('mood', e.target.value)}
                  className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-full mt-1">
                  {['unmotivated', 'tired', 'stressed', 'frustrated', 'lazy', 'overwhelmed', 'doubtful'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <textarea value={getInput('motivationNote')} onChange={e => setInput('motivationNote', e.target.value)}
                placeholder="Tell me what's on your mind..."
                className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-xs rounded-2xl h-16 resize-none" />
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('motivation')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />} GET SUPPORT
              </motion.button>
            </div>
          )}

          {/* Injury Prevention */}
          {tab === 'injury' && (
            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground">AI analyzes your recent training data to detect overtraining risks and muscle imbalances.</p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAction('injury')} disabled={loading}
                className="terminal-button w-full text-xs py-2 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />} ANALYZE TRAINING
              </motion.button>
            </div>
          )}

          {/* Result */}
          {renderResult(tab)}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
