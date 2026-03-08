import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // product IDs
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearAll: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => set((s) => ({ items: s.items.includes(id) ? s.items : [...s.items, id] })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i !== id) })),
      toggleItem: (id) => {
        const { items } = get();
        set({ items: items.includes(id) ? items.filter((i) => i !== id) : [...items, id] });
      },
      isInWishlist: (id) => get().items.includes(id),
      clearAll: () => set({ items: [] }),
    }),
    { name: 'strivo-wishlist' }
  )
);
