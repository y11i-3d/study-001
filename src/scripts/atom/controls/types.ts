import type { PrimitiveAtom } from "jotai";
import type {
  ButtonSettings,
  FolderSettings,
  InputOptions,
  NumberSettings,
} from "leva/plugin";
import type { Vector2, Vector3, Vector4 } from "three";

export type Transform<T> = (v: T) => T;

export type StringSettings = {
  editable?: boolean;
  rows?: boolean | number;
};

export type NumberSchemeSettings = NumberSettings &
  Omit<InputOptions, "onChange" | "transient">;

export type BooleanSchemeSettings = Omit<
  InputOptions,
  "onChange" | "transient"
>;

export type StringSchemeSettings = StringSettings &
  Omit<InputOptions, "onChange" | "transient">;

export type ColorSchemeSettings = Omit<InputOptions, "onChange" | "transient">;

export type ControllerType =
  | "number"
  | "boolean"
  | "string"
  | "button"
  | "color"
  | "vec2"
  | "vec3"
  | "vec4";

export type NumberControllerParams = [
  type: "number",
  atom: PrimitiveAtom<number>,
  settings?: NumberSchemeSettings,
  onChange?: Transform<number>,
  onInit?: Transform<number>,
];

export type BooleanControllerParams = [
  type: "boolean",
  atom: PrimitiveAtom<boolean>,
  settings?: BooleanSchemeSettings,
  onChange?: Transform<boolean>,
  onInit?: Transform<boolean>,
];

export type StringControllerParams = [
  type: "string",
  atom: PrimitiveAtom<string>,
  settings?: StringSchemeSettings,
  onChange?: Transform<string>,
  onInit?: Transform<string>,
];

export type ButtonControllerParams = [
  type: "button",
  onClick: () => void,
  settings?: ButtonSettings,
];

export type ColorControllerParams = [
  type: "color",
  atom: PrimitiveAtom<string>,
  settings?: ColorSchemeSettings,
  onChange?: Transform<string>,
  onInit?: Transform<string>,
];

export type Vector2ControllerParams = [
  type: "vec2",
  atom: PrimitiveAtom<Vector2>,
  settings?: {
    x?: NumberSchemeSettings;
    y?: NumberSchemeSettings;
  },
  onChange?: Transform<Vector2>,
  onInit?: Transform<Vector2>,
];

export type Vector3ControllerParams = [
  type: "vec3",
  atom: PrimitiveAtom<Vector3>,
  settings?: {
    x?: NumberSchemeSettings;
    y?: NumberSchemeSettings;
    z?: NumberSchemeSettings;
  },
  onChange?: Transform<Vector3>,
  onInit?: Transform<Vector3>,
];

export type Vector4ControllerParams = [
  type: "vec4",
  atom: PrimitiveAtom<Vector4>,
  settings?: {
    x?: NumberSchemeSettings;
    y?: NumberSchemeSettings;
    z?: NumberSchemeSettings;
    w?: NumberSchemeSettings;
  },
  onChange?: Transform<Vector4>,
  onInit?: Transform<Vector4>,
];

export type BoolNumberControllerParams<
  T extends number = number,
  F extends number = number,
> = [
  type: "boolNumber",
  atom: PrimitiveAtom<number>,
  truthy: T,
  falsy: F,
  settings?: NumberSchemeSettings,
  onChange?: (v: boolean) => T | F,
  onInit?: (v: T | F) => boolean,
];

export type ControllerParams =
  | NumberControllerParams
  | BooleanControllerParams
  | StringControllerParams
  | ButtonControllerParams
  | ColorControllerParams
  | Vector2ControllerParams
  | Vector3ControllerParams
  | Vector4ControllerParams
  | BoolNumberControllerParams<number, number>;

export type Params = Record<string, ControllerParams | FolderParams>;

export type FolderParams = {
  children: Params;
  folderSettings: FolderSettings;
};
