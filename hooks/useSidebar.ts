import { create } from "zustand";

interface SidebarStore {
  isOpen: boolean;
  toggleSidebar: (isOpen: boolean) => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: true,
  toggleSidebar: (isOpen: boolean) => set({ isOpen: !isOpen }),
}));
