import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: 'equipment' | 'supplements' | 'diet';
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponApplied: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      couponApplied: false,
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },
      applyCoupon: (code) => {
        const coupons: Record<string, number> = {
          'NEW': 5,
          'FIT10': 10,
          'STRIVO15': 15,
          'BULK20': 20,
          'PROTEIN5': 5,
          'SUMMER': 12,
          'GAINS': 8,
          'FIRST25': 25,
        };
        const discount = coupons[code.toUpperCase()];
        if (discount) {
          set({ couponCode: code.toUpperCase(), couponApplied: true });
          return true;
        }
        return false;
      },
      removeCoupon: () => {
        set({ couponCode: '', couponApplied: false });
      },
      clearCart: () => {
        set({ items: [], couponCode: '', couponApplied: false });
      },
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getDiscount: () => {
        const subtotal = get().getSubtotal();
        if (!get().couponApplied) return 0;
        const coupons: Record<string, number> = {
          'NEW': 5, 'FIT10': 10, 'STRIVO15': 15, 'BULK20': 20,
          'PROTEIN5': 5, 'SUMMER': 12, 'GAINS': 8, 'FIRST25': 25,
        };
        const pct = coupons[get().couponCode] || 5;
        return subtotal * (pct / 100);
      },
      getTotal: () => {
        return get().getSubtotal() - get().getDiscount();
      },
    }),
    {
      name: 'strivo-cart',
    }
  )
);
