import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { WebGPURenderer } from "three/webgpu";
import { ThreeBlob } from "./ThreeBlob";
import { ThreeGroup } from "./ThreeGroup";
import { ThreeProvider } from "./ThreeProvider";
import { ThreeSetup } from "./ThreeSetup";
import { ThreeSpinLine } from "./ThreeSpinLine";

type WebGPURendererParameters = ConstructorParameters<typeof WebGPURenderer>[0];

export const Three = () => {
  return (
    <div className="h-dvh w-screen">
      <ThreeProvider>
        <Canvas
          gl={async (props) => {
            const renderer = new WebGPURenderer(
              props as WebGPURendererParameters,
            );
            await renderer.init();
            return renderer;
          }}
        >
          <OrthographicCamera makeDefault position={[0, 0, 1]} />
          <ThreeGroup>
            <ThreeSetup />
            <ThreeBlob />
            <ThreeSpinLine />
          </ThreeGroup>
        </Canvas>
      </ThreeProvider>
      <div className="in-[html.hide-controls]:hidden in-[html.hide-ui]:hidden">
        <Leva collapsed />
      </div>
    </div>
  );
};
