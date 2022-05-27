import { LineSet } from "./line-set";
import { Vector3 } from "three";


/**
 * 'x' denotes the origin of the camera
 * y1, ..., y4 denote the four corners of the frustum:
 *  y1 _______________ y2
 *  |                  |
 *  |                  |
 *  |                  |
 *  y4 _______________ y3
 */
export interface CameraTrajectoryData {
  x: Vector3;
  y1: Vector3;
  y2: Vector3;
  y3: Vector3;
  y4: Vector3;
}

export class CameraTrajectory extends LineSet {

  points: CameraTrajectoryData;
  private size: number = 1;

  constructor(data: CameraTrajectoryData) {
    super();
    // Vectors need to be explicitly instantiated to make use of built-in functions.
    // https://stackoverflow.com/questions/51763745/angular-6-error-typeerror-is-not-a-function-but-it-is
    this.points =
    {
      x: new Vector3(data.x.x, data.x.y, data.x.z),
      y1: new Vector3(data.y1.x, data.y1.y, data.y1.z),
      y2: new Vector3(data.y2.x, data.y2.y, data.y2.z),
      y3: new Vector3(data.y3.x, data.y3.y, data.y3.z),
      y4: new Vector3(data.y4.x, data.y4.y, data.y4.z),
    };
    this.lines = this.pointsToLineSet().lines;
  }

  setSize(size: number): void {
    let oldSize = 1/this.size;
    this.lines.forEach(line => {
      line.geometry.translate(-this.points.x.x, -this.points.x.y, -this.points.x.z);
      line.geometry.scale(oldSize, oldSize, oldSize);
      line.geometry.scale(size, size, size);
      line.geometry.translate(this.points.x.x, this.points.x.y, this.points.x.z);
    });
    this.size = size;
  }


  getMaxPoint(): Vector3 {
    let max = this.points.x.length() < this.points.y1.length() ? this.points.y1 : this.points.x;
    max = max.length() < this.points.y2.length() ? this.points.y2 : max;
    max = max.length() < this.points.y3.length() ? this.points.y3 : max;
    max = max.length() < this.points.y4.length() ? this.points.y4 : max;
    return max;
  }

  pointsToLineSet(): LineSet {
    let set: [Vector3, Vector3][] = [];
    set.push([this.points.x, this.points.y1]);
    set.push([this.points.x, this.points.y2]);
    set.push([this.points.x, this.points.y3]);
    set.push([this.points.x, this.points.y4]);
    set.push([this.points.y1, this.points.y2]);
    set.push([this.points.y2, this.points.y3]);
    set.push([this.points.y3, this.points.y4]);
    set.push([this.points.y4, this.points.y1]);
    return new LineSet(set);
  }
}
