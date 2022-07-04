import { ElementSetting } from "../components/element-setting/element-setting";
import { BufferGeometry, Color, Points, PointsMaterial } from "three";

export enum DPCMaterial {
  DEFAULT = 0,
  COLOR = 1
}

export class DefaultPointCloud extends Points implements ElementSetting {

  private pointsMaterials: PointsMaterial[] = [];

  constructor(geometry?: BufferGeometry, material?: PointsMaterial) {
    super(geometry, material);
    this.pointsMaterials[DPCMaterial.DEFAULT] = material ? material : new PointsMaterial({
      vertexColors: true,
      sizeAttenuation: false, transparent: true
    });
    this.pointsMaterials[DPCMaterial.COLOR] = new PointsMaterial({
      sizeAttenuation: false, transparent: true
    });
  }

  setColor(color: string): void {
    this.pointsMaterials[DPCMaterial.COLOR].color.set(color);
    this.material = this.pointsMaterials[DPCMaterial.COLOR];
  }

  getColor(): Color {
    return this.pointsMaterials[DPCMaterial.COLOR].color;
  }

  setVisibility(visible: boolean): void {
    this.visible = visible;
  }

  getVisibility(): boolean {
    return this.visible;
  }

  resetColor(): void {
    this.material = this.pointsMaterials[DPCMaterial.DEFAULT];
  }

  setPointSize(size: number): void {
    this.pointsMaterials.forEach(mat => mat.size = size);
  }

  setOpacity(opacity: number): void {
    this.pointsMaterials.forEach(mat => mat.opacity = opacity);
  }
}
