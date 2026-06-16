import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState, Product } from '../types/index';

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product: Product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),

      removeItem: (productId: number) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId: number, quantity: number) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== productId)
              : state.items.map((item) =>
                  item.id === productId ? { ...item, quantity } : item
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'intercommerce-cart' }
  )
);
