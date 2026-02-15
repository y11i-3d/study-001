import { atomProxy } from "@/scripts/atom/atomProxy";
import { parallel, serial } from "@/scripts/gsap/gsapUtils";
import gsap from "gsap";
import { useStore } from "jotai";
import { useEffect } from "react";
import type { Atoms } from "./useAtoms";

const scaleBounce = (scale: ReturnType<typeof atomProxy>) => {
  return serial(
    gsap.to(scale, {
      value: 0.5,
      duration: 0.2,
      ease: "power4.out",
    }),
    gsap.to(scale, {
      value: 1,
      duration: 0.3,
      ease: "back.out",
    }),
  );
};

export const useAnimations = (atoms: Atoms) => {
  const store = useStore();

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;

    const unsub = store.sub(atoms.sides, () => {
      tl?.kill();

      const nextSides = store.get(atoms.sides);
      store.set(atoms.uNextSides, nextSides);

      const mix = atomProxy(atoms.uShapeMix, store);
      const scale = atomProxy(atoms.uScale, store);

      tl = parallel(
        gsap.to(mix, {
          value: 1,
          duration: 0.4,
          ease: "power4.inOut",
          onComplete: () => {
            store.set(atoms.uCurrentSides, nextSides);
            store.set(atoms.uShapeMix, 0);
          },
        }),
        scaleBounce(scale),
      );
    });
    return () => {
      unsub();
      tl?.kill();
    };
  }, [atoms, store]);

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;

    const unsub = store.sub(atoms.mode, () => {
      tl?.kill();

      const nextMode = store.get(atoms.mode);
      const mode = atomProxy(atoms.uMode, store);
      const scale = atomProxy(atoms.uScale, store);

      tl = parallel(
        gsap.to(mode, {
          value: nextMode,
          duration: 0.4,
          ease: "power4.inOut",
        }),
        scaleBounce(scale),
      );
    });

    return () => {
      unsub();
      tl?.kill();
    };
  }, [atoms, store]);

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;

    const params = new URLSearchParams(window.location.search);
    if (!params.has("dev")) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "a" && e.key !== "A") return;

      tl?.kill();

      tl = serial(
        gsap.delayedCall(3, () => {
          store.set(atoms.sides, 5);
          store.set(atoms.mode, 3);
        }),
        gsap.delayedCall(4, () => {
          store.set(atoms.sides, 3);
          store.set(atoms.uSpinAmp, 0.9);
        }),
        gsap.delayedCall(4, () => {
          store.set(atoms.sides, 4);
        }),
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      tl?.kill();
    };
  }, [atoms, store]);
};
