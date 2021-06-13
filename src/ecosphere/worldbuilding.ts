type ReproduceOptions = {
  growthRate: number, cap?: number
}

export function worldbuilding({ add, remove, count }: { add: Function; remove: Function; count: Function; }) {

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
    // randomInt: random,
    reproduce
  };
}
