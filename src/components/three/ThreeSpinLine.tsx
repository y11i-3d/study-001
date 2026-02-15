import { useAtomValue } from "jotai";
import { useMemo } from "react";
import {
  cos,
  float,
  Fn,
  mix,
  positionLocal,
  rotate,
  sin,
  vec2,
  vec3,
} from "three/tsl";
import { PlaneGeometry } from "three/webgpu";
import { useThreeContext } from "./ThreeProvider";
import { BASE_SIZE } from "./constatns";

const LINE_SIZE = BASE_SIZE * 0.75;

export const ThreeSpinLine = () => {
  const { uniforms, atoms } = useThreeContext();
  const lineVisible = useAtomValue(atoms.lineVisible);

  const positionNode = useMemo(() => {
    return Fn(() => {
      const {
        uMode,
        uSpinRotation,
        uSwingRotation,
        uSpinWholeRotation,
        uSpinOffsetRotation,
        uSpinOffsetAmp,
      } = uniforms;

      const mode2Mix = uMode.sub(1).clamp(0, 1);
      const mode3Mix = uMode.sub(2).clamp(0, 1);

      // ---------- Spin

      // ----- Mode1
      const spinAngle1 = uSpinRotation;
      const spin1 = rotate(vec2(1, 0), spinAngle1);

      // ----- Mode2
      const spinAngle2 = uSwingRotation;
      const spin2 = vec2(cos(spinAngle2.x), sin(spinAngle2.y));

      // ----- Mode3
      const spinOffsetAngle = uSpinOffsetRotation;

      const spinAngle3 = vec2(spinAngle1).add(
        sin(spinOffsetAngle).mul(uSpinOffsetAmp),
      );
      const spin3 = vec2(cos(spinAngle3.x), sin(spinAngle3.y));

      // ----- Mode Mix
      const rawPos = mix(mix(spin1, spin2, mode2Mix), spin3, mode3Mix);
      const targetPos = rawPos.mul(LINE_SIZE);

      const dir = targetPos.normalize();
      const perp = vec2(dir.y.negate(), dir.x);

      const thickness = float(2.0).div(uniforms.uScale);
      const offset = perp.mul(positionLocal.y).mul(thickness);
      const axial = targetPos.mul(positionLocal.x);

      const position = vec3(axial.add(offset), 0);

      // ----- Mode2, Mode3
      position.xy.assign(rotate(position.xy, uSpinWholeRotation));

      return position;
    })();
  }, [uniforms]);

  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(1, 1);
    geo.translate(0.5, 0, 0);
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} renderOrder={1} visible={lineVisible}>
      <meshBasicNodeMaterial color="#a0a0a0" positionNode={positionNode} />
    </mesh>
  );
};
