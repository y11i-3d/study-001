import { useMemo } from "react";
import { uniform, vec2 } from "three/tsl";

export const useUniforms = () => {
  return useMemo(
    () => ({
      uShapeAmp: uniform(2),
      uShapeRotation: uniform(0),
      uShapeRotationSpeed: uniform(0.6),
      uShapeDirection: uniform(-1),
      uShapeMix: uniform(0),

      uCurrentSides: uniform(3),
      uNextSides: uniform(3),
      uScale: uniform(1),

      uMode: uniform(3),

      uSpinRotation: uniform(0),
      uSpinRotationSpeed: uniform(0.4),
      uSpinSwing: uniform(1),
      uSwingRotation: uniform(vec2(0, 0)),
      uSpinAmp: uniform(0.5),
      uSpinWholeRotation: uniform(0),
      uSpinWholeRotationSpeed: uniform(0.15),

      uSpinOffsetRotation: uniform(vec2(0, 0)),
      uSpinOffsetRotationSpeed: uniform(vec2(0.7, 0.6)),
      uSpinOffsetAmp: uniform(vec2(1.1, 1.3)),

      uTranslationEnabled: uniform(1),
      uTranslationRadius: uniform(0.3),
    }),
    [],
  );
};

export type Uniforms = ReturnType<typeof useUniforms>;
