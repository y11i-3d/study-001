import { useUniformAtoms } from "@/scripts/atom/useUniformAtoms";
import { atom, useStore } from "jotai";
import { useMemo } from "react";
import type { Uniforms } from "./useUniforms";

export const useAtoms = (uniforms: Uniforms) => {
  const store = useStore();
  const uniformAtoms = useUniformAtoms(uniforms);

  const additionalAtoms = useMemo(() => {
    return {
      rendererLabel: atom(""),
      sides: atom(store.get(uniformAtoms.uCurrentSides)),
      mode: atom(store.get(uniformAtoms.uMode)),
      lineVisible: atom(true),
      isPaused: atom(false),
    };
  }, [uniformAtoms.uCurrentSides, uniformAtoms.uMode, store]);

  return useMemo(
    () => ({ ...uniformAtoms, ...additionalAtoms }),
    [uniformAtoms, additionalAtoms],
  );
};

export type Atoms = ReturnType<typeof useAtoms>;
