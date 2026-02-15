import { float, Fn } from "three/tsl";

const TAU = Math.PI * 2;

export const mixRadian = Fn(
  ([a, b, t]: [
    ReturnType<typeof float>,
    ReturnType<typeof float>,
    ReturnType<typeof float>,
  ]) => {
    const delta = b.sub(a).add(Math.PI).mod(TAU).sub(Math.PI);
    return a.add(delta.mul(t));
  },
);
