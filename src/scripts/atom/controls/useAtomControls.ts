import type { PrimitiveAtom } from "jotai";
import { useStore } from "jotai";
import type { Store } from "jotai/vanilla/store";
import { button, folder, useControls } from "leva";
import type { Schema } from "leva/plugin";
import { useEffect } from "react";
import type { ControllerParams, FolderParams, Params } from "./types";

type SchemaItemWithOptions = Schema[string];

const isFolderParams = (
  v: ControllerParams | FolderParams,
): v is FolderParams => "children" in v && "folderSettings" in v;

const buildScheme = (
  key: string,
  params: ControllerParams,
  store: Store,
): Record<string, SchemaItemWithOptions> => {
  const type = params[0];

  switch (type) {
    case "number": {
      const [, atom, settings, onChange, onInit] = params;
      const raw = store.get(atom);
      return {
        [key]: {
          value: onInit ? onInit(raw) : raw,
          ...settings,
          onChange: (v: number, _path: string, ctx: { initial: boolean }) => {
            if (ctx.initial) return;
            store.set(atom, onChange ? onChange(v) : v);
          },
        } as SchemaItemWithOptions,
      };
    }
    case "boolean": {
      const [, atom, settings, onChange, onInit] = params;
      const raw = store.get(atom);
      return {
        [key]: {
          value: onInit ? onInit(raw) : raw,
          ...settings,
          onChange: (v: boolean, _path: string, ctx: { initial: boolean }) => {
            if (ctx.initial) return;
            store.set(atom, onChange ? onChange(v) : v);
          },
        } as SchemaItemWithOptions,
      };
    }
    case "string": {
      const [, atom, settings, onChange, onInit] = params;
      const raw = store.get(atom);
      return {
        [key]: {
          value: onInit ? onInit(raw) : raw,
          ...settings,
          onChange: (v: string, _path: string, ctx: { initial: boolean }) => {
            if (ctx.initial) return;
            store.set(atom, onChange ? onChange(v) : v);
          },
        } as SchemaItemWithOptions,
      };
    }
    case "color": {
      const [, atom, settings, onChange, onInit] = params;
      const raw = store.get(atom);
      return {
        [key]: {
          value: onInit ? onInit(raw) : raw,
          ...settings,
          onChange: (v: string, _path: string, ctx: { initial: boolean }) => {
            if (ctx.initial) return;
            store.set(atom, onChange ? onChange(v) : v);
          },
        } as SchemaItemWithOptions,
      };
    }
    case "button": {
      const [, onClick, settings] = params;
      return {
        [key]: button(onClick, settings) as SchemaItemWithOptions,
      };
    }
    case "vec2": {
      const [, atom, settings, onChange, onInit] = params;
      const raw = store.get(atom);
      const initial = onInit ? onInit(raw) : raw;
      const makeOnChange =
        (axis: "x" | "y") =>
        (v: number, _path: string, ctx: { initial: boolean }) => {
          if (ctx.initial) return;
          const current = store.get(atom).clone();
          current[axis] = v;
          store.set(atom, onChange ? onChange(current) : current);
        };
      const result: Record<string, SchemaItemWithOptions> = {};
      if (settings?.x) {
        result[`${key}_x`] = {
          value: initial.x,
          ...settings.x,
          onChange: makeOnChange("x"),
        } as SchemaItemWithOptions;
      }
      if (settings?.y) {
        result[`${key}_y`] = {
          value: initial.y,
          ...settings.y,
          onChange: makeOnChange("y"),
        } as SchemaItemWithOptions;
      }
      return result;
    }
    case "vec3": {
      const [, atom, settings, onChange, onInit] = params;
      const raw = store.get(atom);
      const initial = onInit ? onInit(raw) : raw;
      const makeOnChange =
        (axis: "x" | "y" | "z") =>
        (v: number, _path: string, ctx: { initial: boolean }) => {
          if (ctx.initial) return;
          const current = store.get(atom).clone();
          current[axis] = v;
          store.set(atom, onChange ? onChange(current) : current);
        };
      const result: Record<string, SchemaItemWithOptions> = {};
      if (settings?.x) {
        result[`${key}_x`] = {
          value: initial.x,
          ...settings.x,
          onChange: makeOnChange("x"),
        } as SchemaItemWithOptions;
      }
      if (settings?.y) {
        result[`${key}_y`] = {
          value: initial.y,
          ...settings.y,
          onChange: makeOnChange("y"),
        } as SchemaItemWithOptions;
      }
      if (settings?.z) {
        result[`${key}_z`] = {
          value: initial.z,
          ...settings.z,
          onChange: makeOnChange("z"),
        } as SchemaItemWithOptions;
      }
      return result;
    }
    case "vec4": {
      const [, atom, settings, onChange, onInit] = params;
      const raw = store.get(atom);
      const initial = onInit ? onInit(raw) : raw;
      const makeOnChange =
        (axis: "x" | "y" | "z" | "w") =>
        (v: number, _path: string, ctx: { initial: boolean }) => {
          if (ctx.initial) return;
          const current = store.get(atom).clone();
          current[axis] = v;
          store.set(atom, onChange ? onChange(current) : current);
        };
      const result: Record<string, SchemaItemWithOptions> = {};
      if (settings?.x) {
        result[`${key}_x`] = {
          value: initial.x,
          ...settings.x,
          onChange: makeOnChange("x"),
        } as SchemaItemWithOptions;
      }
      if (settings?.y) {
        result[`${key}_y`] = {
          value: initial.y,
          ...settings.y,
          onChange: makeOnChange("y"),
        } as SchemaItemWithOptions;
      }
      if (settings?.z) {
        result[`${key}_z`] = {
          value: initial.z,
          ...settings.z,
          onChange: makeOnChange("z"),
        } as SchemaItemWithOptions;
      }
      if (settings?.w) {
        result[`${key}_w`] = {
          value: initial.w,
          ...settings.w,
          onChange: makeOnChange("w"),
        } as SchemaItemWithOptions;
      }
      return result;
    }
    case "boolNumber": {
      const [, atom, truthy, falsy, settings, onChange, onInit] = params;
      const raw = store.get(atom);
      const initial = onInit ? onInit(raw) : raw === truthy;
      return {
        [key]: {
          value: initial,
          ...settings,
          onChange: (v: boolean, _path: string, ctx: { initial: boolean }) => {
            if (ctx.initial) return;
            const nextVal = onChange ? onChange(v) : v ? truthy : falsy;
            store.set(atom, nextVal);
          },
        } as SchemaItemWithOptions,
      };
    }
  }
};

const buildSchema = (params: Params, store: Store) => {
  const schema: Record<string, SchemaItemWithOptions> = {};

  for (const [key, value] of Object.entries(params)) {
    if (isFolderParams(value)) {
      schema[key] = folder(
        buildSchema(value.children, store),
        value.folderSettings,
      );
    } else {
      Object.assign(schema, buildScheme(key, value, store));
    }
  }

  return schema;
};

const collectAtoms = (params: Params): [string, ControllerParams][] => {
  const result: [string, ControllerParams][] = [];
  for (const [key, value] of Object.entries(params)) {
    if (isFolderParams(value)) {
      result.push(...collectAtoms(value.children));
    } else if (value[0] !== "button") {
      result.push([key, value]);
    }
  }
  return result;
};

export const useAtomControls = (params: Params) => {
  const store = useStore();
  const [, set] = useControls(() => buildSchema(params, store));

  useEffect(() => {
    const unsubs = collectAtoms(params).map(([key, controller]) => {
      const atom = controller[1] as PrimitiveAtom<unknown>;
      const sync = () => {
        const type = controller[0];
        if (type === "vec2" || type === "vec3" || type === "vec4") {
          const v = store.get(atom) as {
            x: number;
            y: number;
            z?: number;
            w?: number;
          };
          const settings = controller[2] as Record<string, unknown> | undefined;
          const entries: Record<string, SchemaItemWithOptions> = {};
          if (settings?.x) entries[`${key}_x`] = v.x as SchemaItemWithOptions;
          if (settings?.y) entries[`${key}_y`] = v.y as SchemaItemWithOptions;
          if (settings?.z) entries[`${key}_z`] = v.z as SchemaItemWithOptions;
          if (settings?.w) entries[`${key}_w`] = v.w as SchemaItemWithOptions;
          if (Object.keys(entries).length > 0) set(entries);
        } else if (type === "boolNumber") {
          const truthy = controller[2] as number;
          const onInit = controller[6] as ((v: number) => boolean) | undefined;
          const val = store.get(atom) as number;
          const current = onInit ? onInit(val) : val === truthy;
          set({ [key]: current });
        } else {
          set({ [key]: store.get(atom) as SchemaItemWithOptions });
        }
      };
      // This also fires when the atom is updated via leva's onChange, causing a redundant set with the same value.
      const unsub = store.sub(atom, sync);
      sync();
      return unsub;
    });
    return () => unsubs.forEach((unsub) => unsub());
  }, [params, store, set]);
};
