import { mixRadian } from "@/scripts/tsl/mixRadian";
import { safeAtan } from "@/scripts/tsl/safeAtan";
import { useMemo } from "react";
import {
  color,
  cos,
  dot,
  float,
  Fn,
  mix,
  positionLocal,
  pow,
  rotate,
  sin,
  vec2,
} from "three/tsl";
import type { Uniforms } from "./useUniforms";

export const useBlobShader = (uniforms: Uniforms) => {
  return useMemo(() => {
    const {
      uShapeAmp,
      uShapeRotation,
      uShapeMix,
      uCurrentSides,
      uNextSides,
      uScale,
      uMode,
      uSpinRotation,
      uSpinAmp,
      uSwingRotation,
      uSpinWholeRotation,
      uSpinOffsetRotation,
      uSpinOffsetAmp,
      uTranslationEnabled,
      uTranslationRadius,
    } = uniforms;

    const shape = Fn(
      ([rad, sides, rotation, amp]: [
        ReturnType<typeof float>,
        ReturnType<typeof float>,
        ReturnType<typeof float>,
        ReturnType<typeof vec2>,
      ]) => {
        const adjustedAmp = amp.div(pow(sides, 2));
        return sides
          .equal(1)
          .select(
            vec2(1, 1),
            pow(vec2(2, 2), cos(rad.mul(sides).sub(rotation)).mul(adjustedAmp)),
          );
      },
    );

    const positionNode = Fn(() => {
      const mode2Mix = uMode.sub(1).clamp(0, 1);
      const mode3Mix = uMode.sub(2).clamp(0, 1);

      const position = positionLocal.toVar();

      const rad = safeAtan(position.y, position.x);

      // ---------- Shape
      const shape1 = shape(rad, uCurrentSides, uShapeRotation, uShapeAmp.xx);
      const shape2 = shape(rad, uNextSides, uShapeRotation, uShapeAmp.xx);

      position.xy.mulAssign(mix(shape1, shape2, uShapeMix).mul(uScale));

      // ---------- Distortion

      // ----- Mode1
      const spin1Rad = uSpinRotation;
      const spin1 = rotate(vec2(1, 0), spin1Rad);

      // ----- Mode2
      const spin2Rad2 = uSwingRotation;
      const spin2 = vec2(cos(spin2Rad2.x), sin(spin2Rad2.y));
      const spin2Rad = safeAtan(spin2.y, spin2.x);
      //const spin2Length = length(spin2);

      const phase2 = dot(position.xy, spin2);

      // ----- Mode3
      const spinOffsetAngle = uSpinOffsetRotation;

      const spin3Rad2 = vec2(spin1Rad).add(
        sin(spinOffsetAngle).mul(uSpinOffsetAmp),
      );
      const spin3 = vec2(cos(spin3Rad2.x), sin(spin3Rad2.y));
      const spin3Rad = safeAtan(spin3.y, spin3.x);

      const phase3 = dot(position.xy, spin3);

      // ----- Mode Mix
      const spinRad2 = mixRadian(spin2Rad2, spin3Rad2, mode3Mix);
      const spinRad = mixRadian(spin2Rad, spin3Rad, mode3Mix);
      const phase = mix(phase2, phase3, mode3Mix);

      // ----- Mode2, Mode3
      const waveA = phase.mul(uSpinAmp.mul(0.4)).mul(mode2Mix);
      position.x.addAssign(cos(rad.add(spinRad2.x)).mul(waveA));
      position.y.addAssign(sin(rad.add(spinRad2.y)).mul(waveA));
      const waveB = phase.mul(uSpinAmp.mul(0.2)).mul(mode2Mix);
      position.x.addAssign(cos(spinRad.add(spinRad2.x)).mul(waveB));
      position.y.addAssign(sin(spinRad.add(spinRad2.y)).mul(waveB));

      // ---------- Translate
      const spin = mix(mix(spin1, spin2, mode2Mix), spin3, mode3Mix);
      position.xy.addAssign(
        spin.mul(uTranslationRadius).mul(uTranslationEnabled),
      );

      // ----- Mode2, Mode3
      position.xy.assign(rotate(position.xy, uSpinWholeRotation));

      return position;
    })();

    const colorNode = color("#000");

    return { positionNode, colorNode };
  }, [uniforms]);
};
