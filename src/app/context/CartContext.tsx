import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. UPDATE INTERFACE: Add 'stock' so the cart remembers the limit
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number; // <--- NEW: The maximum available stock for this item
}

interface CartState {
  items: CartItem[];
  // Update addItem to accept 'stock' in the data payload
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (data) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === data.id);

        if (existingItem) {
          // CHECK STOCK: Can we add 1 more?
          if (existingItem.quantity >= existingItem.stock) {
            alert(`Sorry, only ${existingItem.stock} items in stock!`);
            return; // STOP execution
          }

          set({
            items: items.map((item) =>
              item.id === data.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // CHECK STOCK: Is there at least 1?
          if (data.stock < 1) {
            alert("Item is out of stock!");
            return;
          }

          // Add new item with quantity 1
          set({ items: [...items, { ...data, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const { items } = get();
        const item = items.find((i) => i.id === id);

        if (!item) return;

        // CHECK STOCK: Don't allow setting quantity higher than stock
        if (quantity > item.stock) {
          alert(`Sorry, you cannot add more than ${item.stock} items.`);
          return;
        }

        if (quantity <= 0) {
          set({ items: items.filter((item) => item.id !== id) });
        } else {
          set({
            items: items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
