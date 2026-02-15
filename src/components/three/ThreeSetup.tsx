import { extend, useThree } from "@react-three/fiber";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import * as THREE_WEBGPU from "three/webgpu";
import { useThreeContext } from "./ThreeProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
extend(THREE_WEBGPU as any);

export const ThreeSetup = () => {
  const { atoms } = useThreeContext();
  const { gl } = useThree();
  const setLabel = useSetAtom(atoms.rendererLabel);

  useEffect(() => {
    (async () => {
      type WebGPURendererWithBackend = THREE_WEBGPU.WebGPURenderer & {
        backend: { isWebGPUBackend: boolean };
      };
      const renderer = gl as unknown as WebGPURendererWithBackend;
      setLabel(renderer.backend.isWebGPUBackend === true ? "WebGPU" : "WebGL");
    })();
  }, [gl, setLabel, atoms.rendererLabel]);

  return null;
};
