import {
  DoubleSide,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D, PlaneGeometry,
  Quaternion,
  TextureLoader,
  Vector3
} from "three";
import { LineSet } from "./line-set";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";

export interface CameraFrustumPoints {
  x: Vector3;
  y1: Vector3;
  y2: Vector3;
  y3: Vector3;
  y4: Vector3;
}

export class CameraFrustum extends Object3D {

  lineSet: LineSet;
  mesh: Mesh;
  private size: number = 1;
  points: CameraFrustumPoints;

  constructor(frustumPoints: CameraFrustumPoints,
              material: LineMaterial,
              translation: number[],
              rotation: number[],
              imageUrl?: string) {
    super();
    this.points = this.clonePoints(frustumPoints);
    this.lineSet = this.pointsToLineSet(this.points, material);
    this.mesh = this.createMesh(this.points);


    let m = new Matrix4();
    m.makeRotationFromQuaternion(new Quaternion(rotation[1], rotation[2], rotation[3], rotation[0]));
    m.setPosition(translation[0], translation[1], translation[2]);
    m.invert();
    this.lineSet.applyMatrix4(m);
    this.mesh.applyMatrix4(m);
    this.points.x.applyMatrix4(m);


    if (imageUrl) {
      // load the image async
      new Promise<string>((resolve) => {
        let loader = new TextureLoader();
        this.mesh.material = new MeshBasicMaterial({map: loader.load(imageUrl), side: DoubleSide});
        resolve(imageUrl);
      }).then();
    }
  }

  override applyMatrix4(matrix: Matrix4) {
    this.lineSet.applyMatrix4(matrix);
    this.mesh.applyMatrix4(matrix);
  }

  setVisibility(visible: boolean): void {
    this.lineSet.setVisibility(visible);
    this.setMeshVisibility(visible && this.mesh.visible);
  }

  setMeshVisibility(visible: boolean): void {
    this.mesh.visible = visible;
  }

  setFrustumSize(size: number): void {
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

  private createMesh(points: CameraFrustumPoints): Mesh {
    let len = points.y1.distanceTo(points.y2);
    let width = points.y1.distanceTo(points.y4);
    let geometry = new PlaneGeometry(len, width);
    geometry.setFromPoints([
      points.y3,
      points.y4,
      points.y2,
      points.y1,
    ]);
    let material = new MeshBasicMaterial();
    let mesh = new Mesh(geometry, material);
    mesh.visible = false;
    return mesh;
  }

  private pointsToLineSet(points: CameraFrustumPoints, material: LineMaterial): LineSet {
    let set: [Vector3, Vector3][] = [];
    set.push([points.x, points.y1]);
    set.push([points.x, points.y2]);
    set.push([points.x, points.y3]);
    set.push([points.x, points.y4]);
    set.push([points.y1, points.y2]);
    set.push([points.y2, points.y3]);
    set.push([points.y3, points.y4]);
    set.push([points.y4, points.y1]);
    return new LineSet(set, material);
  }

  private clonePoints(points: CameraFrustumPoints): CameraFrustumPoints {
    return {
      "x" : points.x.clone(),
      "y1": points.y1.clone(),
      "y2": points.y2.clone(),
      "y3": points.y3.clone(),
      "y4": points.y4.clone(),
    }
  }

}
