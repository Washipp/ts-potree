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

  originTrajectory =
    {
      x: new Vector3(0,0,0),
      y1: new Vector3(-3,2,5),
      y2: new Vector3(3,2,5),
      y3: new Vector3(3,-2,5),
      y4: new Vector3(-3,-2,5),
    };

  points: CameraTrajectoryData;
  private size: number = 1;
  mesh: Mesh;
  private imageUrl: string;

  constructor(translation: number[], rotation: number[], imageUrl: string | undefined) {
    super();
    this.points = this.originTrajectory;
    this.lineSet = this.pointsToLineSet();
    this.applyTranslation(this.lineSet, translation);
    this.applyRotation(this.lineSet, rotation);

    // TODO: check why the mesh is broken. Maybe the array is read differently.
    this.imageUrl = imageUrl ? imageUrl : '';
    this.mesh = this.createMesh();
    this.applyTranslation(this.mesh, translation);
    this.applyRotation(this.mesh, rotation);
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
    let x = this.points.x.x;
    let y = this.points.x.y;
    let z = this.points.x.z;
    this.lineSet.lines.forEach(line => {
      //TODO combine these three operations into one.
      line.geometry.translate(-x, -y, -z);
      line.geometry.scale(newSize, newSize, newSize);
      line.geometry.translate(x, y, z);
    });
    this.size = size;
    this.mesh.geometry.translate(-x, -y, -z);
    this.mesh.geometry.scale(newSize, newSize, newSize);
    this.mesh.geometry.translate(x, y, z);
  }

  private applyTranslation(object: Object3D, translation: number[]) {
    object.translateX(translation[0]);
    object.translateY(translation[1]);
    object.translateZ(translation[2]);
  }

  private applyRotation(object: Object3D, rotation: number[]) {
    object.rotateX(rotation[0]);
    object.rotateY(rotation[1]);
    object.rotateZ(rotation[2]);
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
