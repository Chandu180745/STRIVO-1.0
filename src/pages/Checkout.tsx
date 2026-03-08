import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, Tag, X, Check, Loader2, Trophy } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useSettings } from '@/hooks/useSettings';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, updateQuantity, removeItem, applyCoupon, removeCoupon, couponApplied, couponCode, getSubtotal, getDiscount, getTotal, clearCart } = useCart();
  const { addRewardPoints, rewardPoints } = useSettings();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [stage, setStage] = useState<'cart' | 'processing' | 'success'>('cart');
  const [dots, setDots] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);

  useEffect(() => {
    if (stage === 'processing') {
      const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 300);
      const pointsEarned = Math.floor(getTotal() * 0.01);
      const timeout = setTimeout(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('orders').insert({
            user_id: user.id,
            total_amount: getTotal(),
            items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
            status: 'placed',
          });
        }
        addRewardPoints(pointsEarned);
        setEarnedPoints(pointsEarned);
        setStage('success');
        clearCart();
        toast.success('Order placed successfully!');
      }, 3000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  }, [stage]);

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) { setCouponError(''); setCouponInput(''); }
    else setCouponError('INVALID COUPON CODE');
  };

  if (items.length === 0 && stage !== 'success') {
    return (
      <div className="min-h-screen pb-24 pixel-grid flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card text-center max-w-md mx-auto">
          <p className="font-display text-2xl tracking-wider mb-4">CART EMPTY</p>
          <button onClick={() => navigate('/shop')} className="terminal-button">GO TO SHOP</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pixel-grid">
      <div className="container py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-display text-sm tracking-wider">BACK TO SHOP</span>
          </button>
          <h1 className="font-display text-4xl tracking-wider">CHECKOUT</h1>
          {rewardPoints > 0 && (
            <p className="text-xs font-display text-yellow-500 mt-1 flex items-center gap-1"><Trophy className="w-3 h-3" /> {rewardPoints} reward points available</p>
          )}
        </motion.div>

        {stage === 'cart' && (
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card flex gap-4">
                <div className="w-16 h-16 bg-muted flex items-center justify-center font-display text-2xl shrink-0">
                  {item.category === 'supplements' ? '◎' : item.category === 'diet' ? '🍽' : '⬡'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm tracking-wider truncate">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 border border-foreground/30 hover:bg-muted"><Minus className="w-3 h-3" /></button>
                    <span className="font-display w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 border border-foreground/30 hover:bg-muted"><Plus className="w-3 h-3" /></button>
                    <button onClick={() => removeItem(item.id)} className="p-1 ml-auto text-strivo-red hover:bg-strivo-red/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="font-display text-sm shrink-0">₹{(item.price * item.quantity).toLocaleString()}</p>
              </motion.div>
            ))}

            {/* Coupon */}
            <div className="glass-card space-y-3">
              {couponApplied ? (
                <div className="flex items-center justify-between p-2 bg-accent/20 border border-accent/30 rounded-xl">
                  <span className="font-display text-sm flex items-center gap-2"><Tag className="w-4 h-4 text-accent" />{couponCode} APPLIED</span>
                  <button onClick={removeCoupon} className="text-accent"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <>
                  <div className="flex gap-1.5">
                    <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="COUPON CODE" className="terminal-input flex-1 min-w-0 text-xs py-2" />
                    <button onClick={handleApplyCoupon} className="terminal-button-outline text-[10px] px-3 py-2 shrink-0 whitespace-nowrap">APPLY</button>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-display tracking-wider text-muted-foreground">AVAILABLE COUPONS</p>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { code: 'NEW', desc: '5%' },
                        { code: 'FIT10', desc: '10%' },
                        { code: 'STRIVO15', desc: '15%' },
                        { code: 'BULK20', desc: '20%' },
                        { code: 'SUMMER', desc: '12%' },
                        { code: 'GAINS', desc: '8%' },
                        { code: 'FIRST25', desc: '25%' },
                        { code: 'PROTEIN5', desc: '5%' },
                      ].map(c => (
                        <motion.button key={c.code} whileTap={{ scale: 0.95 }}
                          onClick={() => { setCouponInput(c.code); }}
                          className="border border-foreground/15 rounded-lg px-1.5 py-1 text-center transition-all hover:border-foreground/40 bg-muted/20">
                          <span className="font-display text-[8px] tracking-wider block truncate">{c.code}</span>
                          <span className="text-[7px] text-muted-foreground">{c.desc}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {couponError && <p className="text-xs alert-text font-display">{couponError}</p>}
            </div>

            {/* Totals */}
            <div className="glass-card space-y-3 font-display tracking-wider">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">SUBTOTAL</span><span>₹{getSubtotal().toLocaleString()}</span></div>
              {couponApplied && <div className="flex justify-between text-sm text-strivo-red"><span>DISCOUNT</span><span>-₹{getDiscount().toLocaleString()}</span></div>}
              <div className="flex justify-between text-lg border-t border-foreground/20 pt-3"><span>TOTAL</span><span>₹{getTotal().toLocaleString()}</span></div>
              <div className="flex justify-between text-xs text-yellow-500">
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> REWARD POINTS</span>
                <span>+{Math.floor(getTotal() * 0.01)} pts</span>
              </div>
            </div>

            {/* Payment */}
            <div className="glass-card space-y-4">
              <h3 className="font-display tracking-wider">PAYMENT DETAILS</h3>
              <input type="text" placeholder="CARD NUMBER" className="terminal-input w-full" defaultValue="4242 4242 4242 4242" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="MM/YY" className="terminal-input" defaultValue="12/28" />
                <input type="text" placeholder="CVV" className="terminal-input" defaultValue="123" />
              </div>
              <input type="text" placeholder="NAME ON CARD" className="terminal-input w-full" defaultValue="STRIVO USER" />
              <button onClick={() => setStage('processing')} className="terminal-button w-full">PAY ₹{getTotal().toLocaleString()}</button>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card py-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <p className="font-display text-xl tracking-widest">PROCESSING{dots}</p>
            <div className="mt-4 font-mono text-sm text-muted-foreground">
              <p>&gt; CONNECTING TO PAYMENT GATEWAY</p>
              <p>&gt; VALIDATING CARD DATA</p>
              <p className="blink">&gt; PROCESSING TRANSACTION_</p>
            </div>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card py-12 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 border-4 border-strivo-red rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-strivo-red" />
            </motion.div>
            <p className="font-display text-2xl tracking-widest mb-2">ORDER PLACED</p>
            <p className="text-muted-foreground">Track it in your profile!</p>
            {earnedPoints > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-display text-sm text-yellow-500">+{earnedPoints} REWARD POINTS EARNED</span>
              </motion.div>
            )}
            <div className="mt-6 font-mono text-xs text-muted-foreground">
              <p>TXN_ID: {crypto.randomUUID().slice(0, 8).toUpperCase()}</p>
              <p>TIMESTAMP: {new Date().toISOString()}</p>
            </div>
            <button onClick={() => navigate('/shop')} className="terminal-button mt-6">CONTINUE SHOPPING</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
