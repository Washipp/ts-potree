import {
  Color,
  Matrix4,
  Object3D,
  Vector3
} from "three";
import { ElementSetting } from "../components/element-setting/element-setting";
import { CameraFrustum, CameraFrustumPoints } from "./camera-frustum";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import { LineSet } from "./line-set";


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
  corners: number[][],
  cameras: [number[], number[], string] [],
  linkImages: boolean
}

export class CameraTrajectory extends Object3D implements ElementSetting {

  originFrustumPoints: CameraFrustumPoints;

  cameraFrustums: CameraFrustum[];
  material: LineMaterial;

  linkingLines: LineSet;

  constructor(data: CameraTrajectoryData) {
    super();
    // create origin frustum
    let y1 = data.corners[0];
    let y2 = data.corners[1];
    let y3 = data.corners[2];
    let y4 = data.corners[3];

    this.originFrustumPoints = {
      x: new Vector3(0, 0, 0),
      y1: new Vector3(y1[0], y1[1], y1[2]),
      y2: new Vector3(y2[0], y2[1], y2[2]),
      y3: new Vector3(y3[0], y3[1], y3[2]),
      y4: new Vector3(y4[0], y4[1], y4[2]),
    };

    this.material = new LineMaterial({linewidth: 0.002,});

    // create frustums
    this.cameraFrustums = [];
    data.cameras.map((camera) => {
      let t = camera[0];
      let r = camera[1];
      let imageUrl = camera[2];

      let frustum = new CameraFrustum(this.originFrustumPoints, this.material, t, r, imageUrl);

      this.cameraFrustums.push(frustum);
    });

    let linkingPoints: [Vector3, Vector3][] = [];
    if (data.linkImages) {
      let lastPoint: Vector3;
      this.cameraFrustums.map((frustum) => {
        if (lastPoint) {
          linkingPoints.push([lastPoint, frustum.points.x])
        }
        lastPoint = frustum.points.x;
      });
    }
    this.linkingLines = new LineSet(linkingPoints, this.material);
  }

  setColor(color: string): void {
    this.material.color.set(color);
  }

  getColor(): Color {
    return this.material.color;
  }

  getName(): string {
    return this.name;
  }

  setVisibility(visible: boolean): void {
    this.visible = visible;
    this.cameraFrustums.forEach(frustum => {
      frustum.setVisibility(visible);
    });
    this.linkingLines.setVisibility(visible);
  }

  getVisibility(): boolean {
    return this.visible;
  }

  setMeshVisibility(visible: boolean): void {
    this.cameraFrustums.forEach(frustum => {
      frustum.setMeshVisibility(visible);
    });
  }

  setLineWidth(width: number): void {
    this.material.linewidth = width;
  }

  setFrustumSize(size: number): void {
    this.cameraFrustums.forEach(frustum => {
      frustum.setFrustumSize(size);
    });
  }

  setOpacity(opacity: number) {
    this.material.opacity = opacity;
  }

  override applyMatrix4(matrix: Matrix4) {
    this.cameraFrustums.forEach(frustum => {
      frustum.applyMatrix4(matrix);
    });
    this.linkingLines.applyMatrix4(matrix);
  }
}
