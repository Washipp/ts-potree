import { LineSet } from "./line-set";
import {
  Color,
  DoubleSide, Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry, Quaternion,
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
  r: number[],
  t: number[],
}

export interface CameraTrajectoryPoints {
  x: Vector3;
  y1: Vector3;
  y2: Vector3;
  y3: Vector3;
  y4: Vector3;
}

export class CameraTrajectory extends Object3D implements ElementSetting {

  lineSet: LineSet;

  readonly originTrajectory =
    {
      x: new Vector3(0,0,0),
      y1: new Vector3(-1,2/3,1),
      y2: new Vector3(1,2/3,1),
      y3: new Vector3(1,-2/3,1),
      y4: new Vector3(-1,-2/3,1),
    };

  points: CameraTrajectoryPoints;
  private size: number = 1;
  mesh: Mesh;
  private imageUrl: string;

  constructor(translation: number[], rotation: number[], imageUrl?: string) {
    super();
    this.points = this.originTrajectory;

    let m = new Matrix4();
    m.makeRotationFromQuaternion(new Quaternion(rotation[1], rotation[2], rotation[3], rotation[0]));
    m.setPosition(translation[0], translation[1], translation[2]);

    this.lineSet = this.pointsToLineSet();

    this.imageUrl = imageUrl ? imageUrl : '';
    this.mesh = this.createMesh();

    this.applyMatrix4(m)
  }

  setColor(color: string): void {
    this.lineSet.setColor(color);
  }

  getColor(): Color {
    return this.lineSet.material.color;
  }

  setVisibility(visible: boolean): void {
    this.visible = visible;
    this.lineSet.setVisibility(visible);
    this.mesh.visible = visible && this.mesh.visible;
  }

  setSize(size: number): void {
    let newSize = size / this.size;
    let oldPosition = this.lineSet.position.clone();
    let x = oldPosition.x;
    let y = oldPosition.y;
    let z = oldPosition.z;
    this.lineSet.lines.forEach(line => {
      //TODO combine these three operations into one?
      line.geometry.translate(-x, -y, -z);
      line.geometry.scale(newSize, newSize, newSize);
      line.geometry.translate(x, y, z);
    });
    this.size = size;
    this.mesh.geometry.translate(-x, -y, -z);
    this.mesh.geometry.scale(newSize, newSize, newSize);
    this.mesh.geometry.translate(x, y, z);
  }

  override applyMatrix4(matrix: Matrix4) {
    this.lineSet.applyMatrix4(matrix);
    this.mesh.applyMatrix4(matrix);
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

  private pointsToLineSet(): LineSet {
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
