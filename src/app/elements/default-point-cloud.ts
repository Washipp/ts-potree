import { PointCloudSetting } from "../components/element-settings/element-setting";
import { BufferGeometry, Points, PointsMaterial } from "three";

export class DefaultPointCloud extends Points implements PointCloudSetting {

  private colorMaterial: PointsMaterial = new PointsMaterial();
  private defaultMaterial: PointsMaterial;

  constructor(geometry?: BufferGeometry, material?: PointsMaterial) {
    super(geometry, material);
    this.defaultMaterial = material ? material : new PointsMaterial({ vertexColors: true }) ;
  }

  setColor(color: string): void {
    this.colorMaterial.color.set(color);
    this.material = this.colorMaterial;
  }

  setVisibility(visible: boolean): void {
    this.visible = visible;
  }

  resetColor(): void {
    this.material = this.defaultMaterial;
  }

  setPointSize(size: number): void {
    this.colorMaterial.size = size;
    this.defaultMaterial.size = size;
  }
}
