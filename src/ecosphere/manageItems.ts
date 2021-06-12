import { Inventory } from "./Inventory";
import { Manager } from "./Manager";
import { ManageItems, Substance } from "./types";

export function manageItems(inventory: Inventory, manager: Manager, elements: Substance[]): ManageItems {
  const { add, remove, zero, count } = inventory;
  const list = () => elements
  return {
    create: (name: string) => {
      if (manager.has(name)) {
        const element: Substance = manager.lookup(name);
        return element;
      }
      const elementIds: number[] = elements.map(({ id }) => id);
      const id = Math.max(0, ...elementIds) + 1;
      const theElement = { id, name };
      elements.push(theElement);
      return theElement;
    },
    list, add, remove, zero, count, //store,
    lookup: manager.lookup,
    lookupById: manager.lookupById,
    // stored: inventory.storage,
    table: () => { return inventory.report },
  };
}
