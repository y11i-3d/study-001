import {
  type BufferGeometry,
  InstancedInterleavedBuffer,
  InterleavedBuffer,
  InterleavedBufferAttribute,
} from "three";

export interface AttributeOrders {
  names: string[];
  itemSizes: number[];
  normalized?: boolean[];
}

function computeStride(sizes: number[]) {
  return sizes.reduce((sum, size) => sum + size, 0);
}

function makeInterleavedBuffer(
  vertices: Float32Array,
  attrsOrder: AttributeOrders,
  instanced = false,
) {
  const stride = computeStride(attrsOrder.itemSizes);
  return new (instanced ? InstancedInterleavedBuffer : InterleavedBuffer)(
    vertices,
    stride,
  );
}

function setAttributes(
  geometry: BufferGeometry,
  buffer: InterleavedBuffer,
  attrsOrder: AttributeOrders,
) {
  let offset = 0;
  const len = attrsOrder.names.length;

  for (let i = 0; i < len; i++) {
    const size = attrsOrder.itemSizes[i];
    geometry.setAttribute(
      attrsOrder.names[i],
      new InterleavedBufferAttribute(
        buffer,
        size,
        offset,
        attrsOrder.normalized?.[i],
      ),
    );
    offset += size;
  }
}

export function setInterleavedBufferAttributes(
  geometry: BufferGeometry,
  vertices: Float32Array,
  attrsOrder: AttributeOrders,
) {
  const buffer = makeInterleavedBuffer(vertices, attrsOrder, false);
  setAttributes(geometry, buffer, attrsOrder);
}

export function setInstancedInterleavedBufferAttributes(
  geometry: BufferGeometry,
  vertices: Float32Array,
  attrsOrder: AttributeOrders,
) {
  const buffer = makeInterleavedBuffer(
    vertices,
    attrsOrder,
    true,
  ) as InstancedInterleavedBuffer;
  setAttributes(geometry, buffer, attrsOrder);
}
