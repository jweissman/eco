type ReproduceOptions = {
  growthRate: number, cap?: number
}
export function worldbuilding({ add, remove, count }: { add: Function; remove: Function; count: Function; }) {
  const random = (min: number, max: number) => {
    return min + Math.floor(Math.random() * (max - min));
  };

  const reproduce = (element: string, options: ReproduceOptions) => {
    const { growthRate, cap } = options;
    const initialPop = count(element);
    // const netGrowth = growth || 0;
    const growth = Math.floor(growthRate * initialPop);
    if (growth <= 0) {
      if (random(0,10) < 1) { add(1, element)}
    }
    if (cap && growth + initialPop > cap) {
      remove(initialPop - cap, element)
    } else {
      add(growth, element);
    }
  };

  return {
    randomInt: random,
    reproduce
  };
}
