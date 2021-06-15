import { ManageStocks } from "./types";

type ReproduceOptions = {
  growthRate: number, cap?: number
}

export function worldbuilding(manager: ManageStocks) {
  const { add, remove, count }: { add: Function; remove: Function; count: Function; } = manager;

  // todo might just have this on Population itself...?
  const reproduce = (element: string, options: ReproduceOptions) => {
    const { growthRate, cap } = options;
    const initialPop = count(element);
    const growth = Math.floor(growthRate * initialPop);
    if (cap && growth + initialPop > cap) {
      remove(initialPop - cap, element)
    } else {
      add(growth, element);
    }
  };

  return {
    reproduce
  };
}
