import { BufferGeometry, Color, Line, LineBasicMaterial, Matrix4, Object3D, Vector3 } from "three";

export class LineSet extends Object3D {

  lines: Line[];
  color: Color = new Color(0x0000ff);
  material = new LineBasicMaterial()

  constructor(points?: [Vector3, Vector3][]) {
    super();
    this.lines = [];
    this.material.color = this.color;
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
    })
  }
}
