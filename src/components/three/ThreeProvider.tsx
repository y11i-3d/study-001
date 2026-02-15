import { createContext, useContext, useMemo } from "react";
import { type Atoms, useAtoms } from "./hooks/useAtoms";
import { type Uniforms, useUniforms } from "./hooks/useUniforms";

type ThreeContextValue = {
  uniforms: Uniforms;
  atoms: Atoms;
};

const ThreeContext = createContext<ThreeContextValue | null>(null);

export const ThreeProvider = ({ children }: { children: React.ReactNode }) => {
  const uniforms = useUniforms();
  const atoms = useAtoms(uniforms);

  const value = useMemo(
    () => ({
      uniforms,
      atoms,
    }),
    [uniforms, atoms],
  );

  return (
    <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>
  );
};

export const useThreeContext = () => {
  const ctx = useContext(ThreeContext);
  if (!ctx)
    throw new Error("useThreeContext must be used within ThreeProvider");
  return ctx;
};
