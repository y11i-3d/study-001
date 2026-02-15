import type { Params } from "@/scripts/atom/controls/types";
import { useAtomControls } from "@/scripts/atom/controls/useAtomControls";
import { useStore } from "jotai";
import { useEffect, useMemo } from "react";
import type { Atoms } from "./useAtoms";

const spinOffsetSpeedSettings = { min: 0, max: 1.5, step: 0.1 };
const spinOffsetAmpSettings = { min: 0, max: 2, step: 0.1 };

export const useBlobControls = (atoms: Atoms) => {
  const store = useStore();

  const params: Params = useMemo(
    () => ({
      renderer: ["string", atoms.rendererLabel, { editable: false }],
      sides: [
        "number",
        atoms.sides,
        { min: 1, max: 6, step: 1, label: "sides [1-6]" },
      ],
      mode: [
        "number",
        atoms.mode,
        { min: 1, max: 3, step: 1, label: "mode [←,→]" },
      ],
      pause: ["boolean", atoms.isPaused, { label: "pause [Space]" }],
      line: ["boolean", atoms.lineVisible],
      translate: ["boolNumber", atoms.uTranslationEnabled, 1, 0],
      Shape: {
        children: {
          shapeAmp: ["number", atoms.uShapeAmp, { min: 1, max: 4, step: 0.5 }],
          shapeSpeed: [
            "number",
            atoms.uShapeRotationSpeed,
            { min: 0, max: 1, step: 0.2 },
          ],
          reverse: ["boolNumber", atoms.uShapeDirection, 1, -1],
        },
        folderSettings: { collapsed: true },
      },
      "Spin (Mode2)": {
        children: {
          spinAmp: ["number", atoms.uSpinAmp, { min: 0, max: 1, step: 0.1 }],
          spinSpeed: [
            "number",
            atoms.uSpinRotationSpeed,
            { min: 0.2, max: 0.8, step: 0.1 },
          ],
          swing: ["number", atoms.uSpinSwing, { min: 0, max: 2.0, step: 0.1 }],
          wholeSpeed: [
            "number",
            atoms.uSpinWholeRotationSpeed,
            { min: 0, max: 0.5, step: 0.05 },
          ],
        },
        folderSettings: { collapsed: true },
      },
      "Spin (Mode3)": {
        children: {
          offsetSpeed: [
            "vec2",
            atoms.uSpinOffsetRotationSpeed,
            {
              x: { ...spinOffsetSpeedSettings, label: "offsetSpeedX" },
              y: { ...spinOffsetSpeedSettings, label: "offsetSpeedY" },
            },
          ],
          offsetAmp: [
            "vec2",
            atoms.uSpinOffsetAmp,
            {
              x: { ...spinOffsetAmpSettings, label: "offsetAmpX" },
              y: { ...spinOffsetAmpSettings, label: "offsetAmpY" },
            },
          ],
        },
        folderSettings: { collapsed: true },
      },
      Translation: {
        children: {
          radius: [
            "number",
            atoms.uTranslationRadius,
            { min: 0, max: 0.5, step: 0.1 },
          ],
        },
        folderSettings: { collapsed: true },
      },
    }),
    [atoms],
  );

  useAtomControls(params);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1-6: set sides
      const num = Number(e.key);
      if (num >= 1 && num <= 6) {
        store.set(atoms.sides, num);
        return;
      }

      // ArrowLeft / ArrowRight: decrement / increment mode
      if (e.key === "ArrowLeft") {
        const current = store.get(atoms.mode);
        store.set(atoms.mode, Math.max(1, current - 1));
        return;
      }
      if (e.key === "ArrowRight") {
        const current = store.get(atoms.mode);
        store.set(atoms.mode, Math.min(3, current + 1));
        return;
      }
      if (e.key === " ") {
        store.set(atoms.isPaused, (prev) => !prev);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [store, atoms.sides, atoms.mode, atoms.isPaused]);
};
