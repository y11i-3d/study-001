import { setInterleavedBufferAttributes } from "@/scripts/three/interleavedBufferUtils";
import { useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";

const TAU = Math.PI * 2;

export const useBlobGeometry = () => {
  return useMemo(() => {
    const segments = 512;
    const vertexNum = segments + 1;
    const bufferStride = 5;

    // ------------------------------ Vertices
    const vertices = new Float32Array(vertexNum * bufferStride);

    let index = 0;

    // ---------- position
    vertices[index++] = 0;
    vertices[index++] = 0;
    vertices[index++] = 0;

    // ---------- uv
    vertices[index++] = 0.5;
    vertices[index++] = 0.5;

    for (let i = 0; i < segments; i++) {
      const rad = (i / segments) * TAU;

      const x = Math.cos(rad) * 0.5;
      const y = Math.sin(rad) * 0.5;

      // ---------- position
      vertices[index++] = x;
      vertices[index++] = y;
      vertices[index++] = 0;

      // ---------- uv
      vertices[index++] = x + 0.5;
      vertices[index++] = y + 0.5;
    }

    const geometry = new BufferGeometry();
    setInterleavedBufferAttributes(geometry, vertices, {
      names: ["position", "uv"],
      itemSizes: [3, 2],
    });

    // ------------------------------ Indices
    const indices = new Uint16Array(segments * 3);

    index = 0;
    for (let i = 0; i < segments; i++) {
      indices[index++] = 0;
      indices[index++] = i + 1;
      indices[index++] = ((i + 1) % segments) + 1;
    }

    geometry.setIndex(new BufferAttribute(indices, 1));

    return {
      geometry,
    };
  }, []);
};
