import { PointCloudOctree, PointColorType, PointShape, PointSizeType } from "@pnext/three-loader";
import { ElementSetting } from "../components/element-setting/element-setting";
import { Color, Matrix4, Object3D } from "three";

export class PotreePointCloud extends Object3D implements ElementSetting {

  pointCloud: PointCloudOctree;

  constructor(pc: PointCloudOctree) {
    super();
    this.pointCloud = pc;
    this.pointCloud.material.pointSizeType = PointSizeType.FIXED;
    this.pointCloud.material.transparent = true;
  }

  resetColor(): void {
    this.pointCloud.material.pointColorType = PointColorType.RGB;
  }

  setColor(color: string): void {
    this.pointCloud.material.pointColorType = PointColorType.COLOR;
    this.pointCloud.material.uniforms.uColor.value.set(new Color(color));
  }

  setPointSize(size: number): void {
    this.pointCloud.material.size = size;
  }

  setVisibility(visible: boolean): void {
    this.pointCloud.visible = visible;
  }

  getVisibility(): boolean {
    return this.pointCloud.visible;
  }

  setEDL(value: boolean): void  {
    if (value) {
      this.pointCloud.material.pointColorType = PointColorType.ELEVATION;
    } else {
      this.resetColor();
    }
  }

  setPointShape(shape: PointShape): void {
    this.pointCloud.material.shape = shape;
  }

  setBoundingBox(value: boolean): void {
    this.pointCloud.showBoundingBox = value;
  }

  getColor(): Color {
    return this.pointCloud.material.uniforms.uColor.value;
  }

  getName(): string {
    return this.pointCloud.name;
  }

  setName(name: string): void {
    this.pointCloud.name = name;
  }

  setOpacity(opacity: number): void {
    this.pointCloud.material.opacity = opacity;
  }

  override applyMatrix4(matrix: Matrix4) {
    this.pointCloud.applyMatrix4(matrix);
  }

}
