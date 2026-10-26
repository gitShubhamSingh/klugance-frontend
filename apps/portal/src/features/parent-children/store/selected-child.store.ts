import { create } from "zustand";

type SelectedChildState = {
  /** student_profile_id the parent last picked, shared across parent pages. */
  childId: string | null;
  setChildId: (childId: string) => void;
};

export const useSelectedChildStore = create<SelectedChildState>((set) => ({
  childId: null,
  setChildId: (childId) => set({ childId }),
}));
