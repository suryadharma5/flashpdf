"use client";

import { create } from "zustand";

interface AuthLabelStore {
  label: string;
  sublabel: string;
  setLabel: (label: string) => void;
  setSubLabel: (label: string) => void;
}

export const useAuthLabel = create<AuthLabelStore>((set) => ({
  label: "",
  sublabel: "",
  setLabel: (newLabel) => set({ label: newLabel }),
  setSubLabel: (newSubLabel) => set({ sublabel: newSubLabel }),
}));
