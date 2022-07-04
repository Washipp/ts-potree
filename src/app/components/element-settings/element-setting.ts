import { Color } from "three";

export interface ElementSetting {

  setVisibility(visible: boolean): void;

  setColor(color: string): void;
}

export interface PointCloudSetting extends ElementSetting {
  resetColor(): void;

  setPointSize(size: number): void;

  getColor(): Color;
}
