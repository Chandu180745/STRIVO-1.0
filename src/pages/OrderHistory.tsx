import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  items: any[];
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  placed: { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-500' },
  confirmed: { icon: <Package className="w-4 h-4" />, color: 'text-blue-500' },
  shipped: { icon: <Truck className="w-4 h-4" />, color: 'text-purple-500' },
  delivered: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-500' },
  cancelled: { icon: <XCircle className="w-4 h-4" />, color: 'text-strivo-red' },
};

const OrderHistory = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      setOrders((data as Order[]) || []);
      setLoading(false);
    };
    fetchOrders();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen pb-24 pixel-grid">
      <div className="container py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl tracking-wider">ORDERS</h1>
          <p className="text-muted-foreground text-sm">Your order history & tracking</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 font-display tracking-wider text-muted-foreground">LOADING...</div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="font-display text-xl tracking-wider mb-2">NO ORDERS YET</p>
            <p className="text-muted-foreground text-sm">Your orders will appear here after checkout.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const cfg = statusConfig[order.status] || statusConfig.placed;
              const items = Array.isArray(order.items) ? order.items : [];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-xs text-muted-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className={`flex items-center gap-1 font-display text-xs tracking-wider ${cfg.color}`}>
                      {cfg.icon}
                      {order.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    {items.map((item: any, j: number) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-display">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-foreground/10">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="font-display text-lg">₹{Number(order.total_amount).toLocaleString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
