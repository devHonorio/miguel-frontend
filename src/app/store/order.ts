import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CupUpdateType } from "../(private)/admin/cups/schema";
import { AdditionalType } from "../(private)/admin/additional/hooks/schema";

interface OrderStore {
  cups: CupStore[];
  addCup: (cup: CupStore) => void;
  removeCup: (id: string) => void;
}

interface CupStore extends Pick<CupUpdateType, "size" | "price" | "id"> {
  additional: Pick<AdditionalType, "id" | "name">[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      cups: [],
      addCup: (cup: CupStore) =>
        set((state) => ({ cups: [...state.cups, cup] })),
      removeCup(id) {
        return set((state) => ({
          cups: state.cups.filter((cup) => cup.id !== id),
        }));
      },
    }),
    { name: "order" },
  ),
);
