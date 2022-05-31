import { BufferGeometry, Line, LineBasicMaterial, Matrix4, Object3D, Vector3 } from "three";
import { ElementSetting } from "../components/element-settings/element-setting";

export class LineSet extends Object3D implements ElementSetting {

  lines: Line[];
  material = new LineBasicMaterial();

  constructor(points?: [Vector3, Vector3][]) {
    super();
    this.lines = [];
    if (points) {
      points.forEach(p => {
        this.addLine(p);
      });
    }
  }

  addLine(points: [Vector3, Vector3]): void {
    let geometry = new BufferGeometry().setFromPoints(points);
    let line = new Line(geometry, this.material);
    this.lines.push(line);
  }

  override applyMatrix4(matrix: Matrix4): void {
    this.lines.forEach(line => {
      line.applyMatrix4(matrix);
    });
  }

  setVisibility(visible: boolean): void {
    this.lines.forEach(line => {
      line.visible = visible;
    });
  }

  setColor(color: string): void {
    this.material.color.set(color);
  }
}
