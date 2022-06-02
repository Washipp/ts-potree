import { LineSet } from "./line-set";
import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  TextureLoader,
  Vector3
} from "three";
import { ElementSetting } from "../components/element-settings/element-setting";


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

export class CameraTrajectory extends Object3D implements ElementSetting {

  lineSet: LineSet;

  points: CameraTrajectoryData;
  private size: number = 1;
  mesh: Mesh;
  private imageUrl: string;

  constructor(data: CameraTrajectoryData, imageUrl: string | undefined) {
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
    this.lineSet = this.pointsToLineSet();
    this.imageUrl = imageUrl ? imageUrl : '';
    this.mesh = this.createMesh();
  }

  setColor(color: string): void {
    this.lineSet.setColor(color);
  }

  setVisibility(visible: boolean): void {
    this.lineSet.setVisibility(visible);
    this.mesh.visible = visible && this.mesh.visible;
  }

  setSize(size: number): void {
    let newSize = size / this.size;
    this.lineSet.lines.forEach(line => {
      //TODO combine these three operations into one.
      line.geometry.translate(-this.points.x.x, -this.points.x.y, -this.points.x.z);
      line.geometry.scale(newSize, newSize, newSize);
      line.geometry.translate(this.points.x.x, this.points.x.y, this.points.x.z);
    });
    this.size = size;
    this.mesh.geometry.translate(-this.points.x.x, -this.points.x.y, -this.points.x.z);
    this.mesh.geometry.scale(newSize, newSize, newSize);
    this.mesh.geometry.translate(this.points.x.x, this.points.x.y, this.points.x.z);
  }

  private createMesh(): Mesh {
    let len = this.points.y1.distanceTo(this.points.y2);
    let width = this.points.y1.distanceTo(this.points.y4);
    let geometry = new PlaneGeometry(len, width);
    geometry.setFromPoints([this.points.y2, this.points.y1, this.points.y3, this.points.y4,])
    let loader = new TextureLoader();
    let material = new MeshBasicMaterial({map: loader.load(this.imageUrl), side: DoubleSide});
    let mesh = new Mesh(geometry, material);
    mesh.visible = false;
    return mesh;
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
