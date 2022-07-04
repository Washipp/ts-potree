import { Color, Matrix4, Object3D, Vector3 } from "three";
import { ElementSetting } from "../components/element-setting/element-setting";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";

export class LineSet extends Object3D implements ElementSetting {

  lines: Line2[];
  material = new LineMaterial({linewidth: 0.002,});

  constructor(points?: [Vector3, Vector3][]) {
    super();
    this.lines = [];
    if (points) {
      points.forEach(p => {
        this.addLine(p);
      });
    }
    this.material.transparent = true;
  }

  addLine(points: [Vector3, Vector3]): void {
    let geometry = new LineGeometry();
    const positions: number[] = [];
    points.forEach(p => positions.push(p.x, p.y, p.z));
    geometry.setPositions(positions);
    let line = new Line2(geometry, this.material);
    this.lines.push(line);
  }

  override applyMatrix4(matrix: Matrix4): void {
    this.lines.forEach(line => {
      line.applyMatrix4(matrix);
    });
  }

  setVisibility(visible: boolean): void {
    this.visible = visible;
    this.lines.forEach(line => {
      line.visible = visible;
    });
  }

  getVisibility(): boolean {
    return this.visible;
  }

  setColor(color: string): void {
    this.material.color.set(color);
  }

  getColor(): Color {
    return this.material.color;
  }

  setLineWidth(width: number): void {
    this.material.linewidth = width;
  }

  setOpacity(opacity: number): void {
    this.material.opacity = opacity;
  }
}
