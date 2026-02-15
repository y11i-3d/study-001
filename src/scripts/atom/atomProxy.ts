import type { WritableAtom } from "jotai";
import type { Store } from "jotai/vanilla/store";

export const atomProxy = (
  atom: WritableAtom<number, [number], void>,
  store: Store,
) => ({
  get value() {
    return store.get(atom);
  },
  set value(v: number) {
    store.set(atom, v);
  },
});
