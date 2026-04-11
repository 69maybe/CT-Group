import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  unit: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items || [];
        const existingItem = items.find(
          (i) => i.productId === item.productId
        );
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { ...item, id: `${item.productId}-${Date.now()}` },
            ],
          });
        }
      },
      
      removeItem: (id) => {
        set({ items: (get().items || []).filter((i) => i.id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: (get().items || []).map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getSubtotal: () => {
        const items = get().items || [];
        return items.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
          0
        );
      },
      
      getItemCount: () => {
        const items = get().items || [];
        return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      },
    }),
    {
      name: 'greenlife-cart',
    }
  )
);
