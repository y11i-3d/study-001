import { useThree } from "@react-three/fiber";
import { useSetAtom } from "jotai";
import { type ReactNode, useEffect, useMemo } from "react";
import { useThreeContext } from "./ThreeProvider";
import { BASE_SIZE } from "./constatns";

const MIN_SIZE = BASE_SIZE * 1.5;

export const ThreeGroup = ({ children }: { children: ReactNode }) => {
  const { size } = useThree();
  const { atoms } = useThreeContext();
  const setScale = useSetAtom(atoms.uScale);

  const scale = useMemo(() => {
    const minSide = Math.min(size.width, size.height);
    const s = minSide < MIN_SIZE ? minSide / MIN_SIZE : 1;
    return s;
  }, [size]);

  useEffect(() => {
    setScale(scale);
  }, [scale, setScale]);

  return <group scale={[scale, scale, scale]}>{children}</group>;
};
