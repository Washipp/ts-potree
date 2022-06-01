import { Matrix4, Object3D, Vector3 } from "three";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { CameraState, Viewer } from "../../viewer/viewer";
import { CameraTrajectoryData } from "../../elements/camera-trajectory";

export interface CustomLine {
  start: Vector3,
  end: Vector3,
}

export interface ElementAttributes {
  name: string,
  material?: any,
  imageUrl?: string,
  position?: Vector3, // TODO: remove position and scale.
  transformation?: Matrix4,
}

export interface SceneElement {
  elementId: number,
  source: string | CustomLine[] | CameraTrajectoryData,
  sceneType: SceneElementsEnum,
  attributes: ElementAttributes,
  visible?: boolean,
  element?: Object3D,
}

export interface ViewerData {
  sceneId: number,
  elements: SceneElement[],
  camera?: CameraState,
  viewer?: Viewer;
}
