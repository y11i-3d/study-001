import { atom, useStore } from "jotai";
import { useEffect, useMemo } from "react";
import type { UniformNode } from "three/webgpu";

type UniformAtoms<T extends Record<string, UniformNode<unknown, unknown>>> = {
  [K in keyof T]: T[K] extends UniformNode<unknown, infer V>
    ? ReturnType<typeof atom<V>>
    : never;
};

export const useUniformAtoms = <
  T extends Record<string, UniformNode<unknown, unknown>>,
>(
  uniforms: T,
): UniformAtoms<T> => {
  const store = useStore();

  const atoms = useMemo(() => {
    return Object.fromEntries(
      Object.entries(uniforms).map(([key, node]) => [key, atom(node.value)]),
    ) as UniformAtoms<T>;
  }, [uniforms]);

  useEffect(() => {
    const unsubs = Object.entries(uniforms).map(([key, node]) => {
      const a = (atoms as Record<string, ReturnType<typeof atom>>)[key];
      return store.sub(a, () => {
        node.value = store.get(a);
      });
    });
    return () => unsubs.forEach((unsub) => unsub());
  }, [atoms, uniforms, store]);

  return atoms;
};
