import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { generateId } from "@/lib/theme";

interface AuthState {
  userId: string | null;
  userName: string | null;
  isGuest: boolean;
  isLoading: boolean;
  init: () => Promise<void>;
  setGuest: (name: string) => Promise<void>;
  setUser: (id: string, name: string) => void;
  logout: () => Promise<void>;
}

const GUEST_ID_KEY = "patungin_guest_id";
const GUEST_NAME_KEY = "patungin_guest_name";

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  userName: null,
  isGuest: false,
  isLoading: true,

  init: async () => {
    try {
      const guestId = await SecureStore.getItemAsync(GUEST_ID_KEY);
      const guestName = await SecureStore.getItemAsync(GUEST_NAME_KEY);

      if (guestId) {
        set({ userId: guestId, userName: guestName || "Guest", isGuest: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setGuest: async (name: string) => {
    const id = generateId();
    await SecureStore.setItemAsync(GUEST_ID_KEY, id);
    await SecureStore.setItemAsync(GUEST_NAME_KEY, name);
    set({ userId: id, userName: name, isGuest: true });
  },

  setUser: (id: string, name: string) => {
    set({ userId: id, userName: name, isGuest: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(GUEST_ID_KEY);
    await SecureStore.deleteItemAsync(GUEST_NAME_KEY);
    set({ userId: null, userName: null, isGuest: false });
  },
}));
