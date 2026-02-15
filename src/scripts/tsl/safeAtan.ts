import { atan, float, Fn, vec2 } from "three/tsl";

export const safeAtan = Fn(
  ([y, x]: [ReturnType<typeof float>, ReturnType<typeof float>]) => {
    return vec2(x, y).length().equal(0).select(0, atan(y, x));
  },
);
