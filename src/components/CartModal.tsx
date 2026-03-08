import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Tag, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartModal = ({ isOpen, onClose, onCheckout }: CartModalProps) => {
  const { items, updateQuantity, removeItem, applyCoupon, removeCoupon, couponApplied, couponCode, getSubtotal, getDiscount, getTotal } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('INVALID COUPON CODE');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l-2 border-foreground/20 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-foreground/20">
              <h2 className="font-display text-xl tracking-wider">CART [{items.length}]</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="font-display text-muted-foreground tracking-wider">CART EMPTY</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border border-foreground/20 rounded-2xl">
                      <div className="w-16 h-16 bg-muted flex items-center justify-center font-display text-2xl rounded-xl">
                        {item.category === 'supplements' ? '◎' : '⬡'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display text-sm tracking-wider">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-foreground/30 hover:bg-muted rounded-full"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-display w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-foreground/30 hover:bg-muted rounded-full"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 ml-auto text-strivo-red hover:bg-strivo-red/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-foreground/20 p-4 space-y-4">
                {/* Coupon */}
                <div className="space-y-2">
                  {couponApplied ? (
                    <div className="flex items-center justify-between p-2 bg-strivo-red/10 border border-strivo-red/30 rounded-full">
                      <span className="font-display text-sm flex items-center gap-2">
                        <Tag className="w-4 h-4 text-strivo-red" />
                        {couponCode} (-5%)
                      </span>
                      <button onClick={removeCoupon} className="text-strivo-red">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="COUPON CODE"
                        className="terminal-input flex-1 text-sm py-2"
                      />
                      <button onClick={handleApplyCoupon} className="terminal-button-outline text-sm py-2">
                        APPLY
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs alert-text font-display">{couponError}</p>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 font-display text-sm tracking-wider">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SUBTOTAL</span>
                    <span>₹{getSubtotal().toLocaleString()}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-strivo-red">
                      <span>DISCOUNT</span>
                      <span>-₹{getDiscount().toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg border-t border-foreground/20 pt-2">
                    <span>TOTAL</span>
                    <span>₹{getTotal().toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={onCheckout} className="terminal-button w-full">
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
