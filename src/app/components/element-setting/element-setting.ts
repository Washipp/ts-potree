import { Color } from "three";

export interface ElementSetting {

  setColor(color: string): void;

  getColor(): Color;

  resetColor?(): void;

  setVisibility(visible: boolean): void;

  getVisibility(): boolean;

  setOpacity(opacity: number): void;

  setPointSize?(size: number): void;

  setMeshVisibility?(visible: boolean): void;

  setLineWidth?(width: number): void;

  setFrustumSize?(size: number): void;
}
