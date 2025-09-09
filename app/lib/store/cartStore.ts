// app/lib/store/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// export interface CartItem {
//   $id: string;
//   title: string;
//   description: string;
//   price: string;
//   supplier: string;
//   imageUrl?: string;
//   serviceType: string;
//   quantity: number;
//   features?: string[];
// }

export interface CartItem {
  $id: string;
  title: string;
  description: string;
  price: string;
  supplier: string;
  imageUrl?: string;
  serviceType: string;
  quantity: number;
  features?: string[];
  rating: number; // Add required property
  reviews: number; // Add required property
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemById: (id: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find(item => item.$id === newItem.$id);

        if (existingItem) {
          // If item exists, increment quantity
          set({
            items: items.map(item =>
              item.$id === newItem.$id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // If new item, add with quantity 1
          set({
            items: [...items, { ...newItem, quantity: 1 }],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.$id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map(item =>
            item.$id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], isOpen: false });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.price.toString().replace(/[^\d.-]/g, ''));
          return total + (price * item.quantity);
        }, 0);
      },

      getItemById: (id) => {
        return get().items.find(item => item.$id === id);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);