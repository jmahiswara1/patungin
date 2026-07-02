import { create } from "zustand";

export interface DraftItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  participants: string[];
}

interface DraftState {
  items: DraftItem[];
  discount: number;
  shipping: number;
  shippingSplit: "equal" | "proportional";
  addItem: (item: Omit<DraftItem, "id">) => void;
  updateItem: (id: string, data: Partial<DraftItem>) => void;
  removeItem: (id: string) => void;
  setDiscount: (discount: number) => void;
  setShipping: (shipping: number) => void;
  setShippingSplit: (split: "equal" | "proportional") => void;
  reset: () => void;
}

const initialState = {
  items: [] as DraftItem[],
  discount: 0,
  shipping: 0,
  shippingSplit: "equal" as const,
};

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export const useDraftStore = create<DraftState>((set) => ({
  ...initialState,

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, { ...item, id: generateId() }],
    })),

  updateItem: (id, data) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  setDiscount: (discount) => set({ discount }),
  setShipping: (shipping) => set({ shipping }),
  setShippingSplit: (shippingSplit) => set({ shippingSplit }),

  reset: () => set(initialState),
}));
