import { Color } from "three";
import { PointShape } from "@pnext/three-loader";

export interface ElementSetting {

  setColor(color: string): void;

  getColor(): Color;

  getName(): string;

  resetColor?(): void;

  setVisibility(visible: boolean): void;

  getVisibility(): boolean;

  setOpacity(opacity: number): void;

  setPointSize?(size: number): void;

  setMeshVisibility?(visible: boolean): void;

  setLineWidth?(width: number): void;

  setFrustumSize?(size: number): void;

  setBoundingBox?(value: boolean): void;

  setEDL?(value: boolean): void;

  setPointShape?(shape: PointShape): void;
}
