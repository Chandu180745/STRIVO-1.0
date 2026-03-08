import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, User, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

const navItems = [
  { path: '/', icon: Home },
  { path: '/workout', icon: Dumbbell },
  { path: '/health', icon: Heart },
  { path: '/shop', icon: ShoppingBag },
  { path: '/profile', icon: User },
];

export const BottomNav = () => {
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.nav initial={{ y: 100 }} animate={{ y: 0 }}
      className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="glass-panel rounded-full p-1.5 flex items-center gap-1 border-2 border-foreground/20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const showBadge = item.path === '/shop' && cartCount > 0;
          return (
            <Link key={item.path} to={item.path} className="relative">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
                  isActive ? 'bg-foreground text-background' : 'text-foreground/60'
                }`}>
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              {showBadge && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-strivo-red text-white text-[9px] font-display rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};
