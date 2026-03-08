import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { items, getTotal, clearCart } = useCart();
  const [stage, setStage] = useState<'form' | 'processing' | 'success'>('form');
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (stage === 'processing') {
      const interval = setInterval(() => {
        setDots((d) => (d.length >= 3 ? '' : d + '.'));
      }, 300);

      const timeout = setTimeout(async () => {
        // Save order to database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('orders').insert({
            user_id: user.id,
            total_amount: getTotal(),
            items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
            status: 'placed',
          });
        }
        setStage('success');
        clearCart();
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [stage, clearCart, getTotal, items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStage('processing');
  };

  const handleClose = () => {
    setStage('form');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border-2 border-foreground/20 z-50">
            <div className="flex items-center justify-between p-4 border-b border-foreground/20">
              <h2 className="font-display text-xl tracking-wider">{stage === 'success' ? 'ORDER COMPLETE' : 'CHECKOUT'}</h2>
              <button onClick={handleClose} className="p-2 hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6">
              {stage === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid-pattern p-4 border border-foreground/20">
                    <p className="font-display text-sm text-muted-foreground mb-2">PAYMENT AMOUNT</p>
                    <p className="font-display text-3xl">₹{getTotal().toLocaleString()}</p>
                  </div>
                  <input type="text" placeholder="CARD NUMBER" required className="terminal-input w-full" defaultValue="4242 4242 4242 4242" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" required className="terminal-input" defaultValue="12/28" />
                    <input type="text" placeholder="CVV" required className="terminal-input" defaultValue="123" />
                  </div>
                  <input type="text" placeholder="NAME ON CARD" required className="terminal-input w-full" defaultValue="STRIVO USER" />
                  <button type="submit" className="terminal-button w-full">PAY NOW</button>
                </form>
              )}

              {stage === 'processing' && (
                <div className="py-12 text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
                  <p className="font-display text-xl tracking-widest">PROCESSING{dots}</p>
                  <div className="mt-4 font-mono text-sm text-muted-foreground">
                    <p>&gt; CONNECTING TO PAYMENT GATEWAY</p>
                    <p>&gt; VALIDATING CARD DATA</p>
                    <p className="blink">&gt; PROCESSING TRANSACTION_</p>
                  </div>
                </div>
              )}

              {stage === 'success' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-20 h-20 mx-auto mb-6 border-4 border-strivo-red rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-strivo-red" />
                  </motion.div>
                  <p className="font-display text-2xl tracking-widest mb-2">SUCCESS</p>
                  <p className="text-muted-foreground">Order confirmed. Track it in your profile!</p>
                  <div className="mt-6 font-mono text-xs text-muted-foreground">
                    <p>TXN_ID: {crypto.randomUUID().slice(0, 8).toUpperCase()}</p>
                    <p>TIMESTAMP: {new Date().toISOString()}</p>
                  </div>
                  <button onClick={handleClose} className="terminal-button mt-6">CONTINUE SHOPPING</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
