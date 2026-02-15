import { useFrame } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { BASE_SIZE } from "./constatns";
import { useAnimations } from "./hooks/useAnimations";
import { useBlobControls } from "./hooks/useBlobControls";
import { useBlobGeometry } from "./hooks/useBlobGeometry";
import { useBlobShader } from "./hooks/useBlobShader";
import { useThreeContext } from "./ThreeProvider";

const TAU = Math.PI * 2;

export const ThreeBlob = () => {
  const { uniforms, atoms } = useThreeContext();
  const isPaused = useAtomValue(atoms.isPaused);
  const { geometry } = useBlobGeometry();
  const { positionNode, colorNode } = useBlobShader(uniforms);

  useBlobControls(atoms);

  useAnimations(atoms);

  const {
    uSpinRotation,
    uSpinRotationSpeed,
    uSwingRotation,
    uSpinSwing,
    uSpinWholeRotation,
    uSpinWholeRotationSpeed,
    uShapeRotation,
    uShapeRotationSpeed,
    uShapeDirection,
    uSpinOffsetRotation,
    uSpinOffsetRotationSpeed,
    uMode,
  } = uniforms;
  useFrame((_, delta) => {
    if (isPaused) return;
    // eslint-disable-next-line react-hooks/immutability
    uShapeRotation.value +=
      delta * uShapeRotationSpeed.value * TAU * uShapeDirection.value;
    // eslint-disable-next-line react-hooks/immutability
    uSpinRotation.value += delta * uSpinRotationSpeed.value * TAU;

    const spinSwing = uSpinSwing.value * 0.5 + 0.5;
    const spinSpeed = uSpinRotationSpeed.value;
    const swingDenom = spinSwing + 0.5;
    // eslint-disable-next-line react-hooks/immutability
    uSwingRotation.value.x += delta * ((spinSpeed * 1.0) / swingDenom) * TAU;
    uSwingRotation.value.y +=
      delta * ((spinSpeed * spinSwing * 2.0) / swingDenom) * TAU;
    if (uMode.value > 1) {
      // eslint-disable-next-line react-hooks/immutability
      uSpinWholeRotation.value += delta * uSpinWholeRotationSpeed.value * TAU;
    }
    if (uMode.value > 2) {
      const speed = uSpinOffsetRotationSpeed.value;
      // eslint-disable-next-line react-hooks/immutability
      uSpinOffsetRotation.value.x += delta * speed.x * TAU;
      uSpinOffsetRotation.value.y += delta * speed.y * TAU;
    }
  });

  return (
    <mesh geometry={geometry} scale={[BASE_SIZE, BASE_SIZE, 1]}>
      <meshBasicNodeMaterial
        colorNode={colorNode}
        positionNode={positionNode}
      />
    </mesh>
  );
};
