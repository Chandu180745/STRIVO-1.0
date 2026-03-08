import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { products } from '@/lib/products';
import { toast } from 'sonner';

type Goal = 'weight_loss' | 'bulking' | 'cutting' | 'endurance' | 'general';

const goalLabels: Record<Goal, string> = {
  weight_loss: 'WEIGHT LOSS',
  bulking: 'BULKING',
  cutting: 'CUTTING',
  endurance: 'ENDURANCE',
  general: 'GENERAL FITNESS',
};

interface Rec {
  name: string;
  id: string;
  reason: string;
}

export const AIRecommendations = () => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [recs, setRecs] = useState<Rec[]>([]);
  const [alsoBought, setAlsoBought] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCart();

  const fetchRecs = async (selectedGoal: Goal) => {
    setGoal(selectedGoal);
    setLoading(true);
    setRecs([]);
    setAlsoBought([]);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-fitness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          type: 'recommendation',
          context: goalLabels[selectedGoal],
          messages: [{ role: 'user', content: `Recommend products for my goal: ${goalLabels[selectedGoal]}` }],
        }),
      });

      if (!resp.ok) throw new Error('Failed to get recommendations');
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || '';

      try {
        const parsed = JSON.parse(content);
        setRecs(parsed.recommendations || []);
        setAlsoBought(parsed.alsoBought || []);
      } catch {
        // Try extracting JSON from markdown
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setRecs(parsed.recommendations || []);
          setAlsoBought(parsed.alsoBought || []);
        }
      }
    } catch (e) {
      toast.error('Failed to get recommendations');
    }
    setLoading(false);
  };

  const handleAddProduct = (name: string) => {
    const found = products.find(p => p.name.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
    if (found) {
      addItem({ id: found.id, name: found.name, price: found.price, image: found.image, category: found.category });
      toast.success(`${found.name} added to cart`);
    } else {
      toast.info(`Search for "${name}" in the shop`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="mt-6 p-5 border-2 border-foreground/10 bg-card rounded-2xl">
      <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-strivo-red" />
        AI PRODUCT RECOMMENDATIONS
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Select your fitness goal for personalized suggestions</p>

      <div className="flex gap-2 flex-wrap mb-4">
        {(Object.keys(goalLabels) as Goal[]).map(g => (
          <button key={g} onClick={() => fetchRecs(g)}
            className={`px-3 py-1.5 text-[10px] font-display border-2 transition-colors rounded-full ${
              goal === g ? 'bg-strivo-red text-white border-strivo-red' : 'border-foreground/30 hover:border-foreground'
            }`}>{goalLabels[g]}</button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="font-display text-xs tracking-wider">AI ANALYZING...</span>
        </div>
      )}

      <AnimatePresence>
        {recs.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-[10px] font-display text-muted-foreground">RECOMMENDED FOR {goal ? goalLabels[goal] : ''}</p>
            <div className="grid gap-2">
              {recs.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 border border-foreground/10 hover:border-foreground/30 transition-colors rounded-2xl">
                  <div className="flex-1">
                    <p className="font-display text-xs">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.reason}</p>
                  </div>
                  <button onClick={() => handleAddProduct(r.name)}
                    className="p-1.5 border border-foreground/30 hover:bg-foreground hover:text-background transition-colors rounded-full">
                    <ShoppingCart className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>

            {alsoBought.length > 0 && (
              <>
                <p className="text-[10px] font-display text-muted-foreground mt-4">PEOPLE ALSO BOUGHT</p>
                <div className="flex gap-2 flex-wrap">
                  {alsoBought.map((a, i) => (
                    <button key={i} onClick={() => handleAddProduct(a.name)}
                      className="px-3 py-1.5 text-[10px] font-display border border-foreground/20 hover:border-strivo-red transition-colors rounded-full">
                      {a.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
