import { Matrix4, Object3D, Vector3 } from "three";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { MinifiedCameraState, Viewer } from "../../viewer/viewer";
import { CameraTrajectoryData } from "../../elements/camera-trajectory";

// Tuple with start/end point accordingly with the points in an array.
export type CustomLine = [number[], number[]];

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
  camera?: MinifiedCameraState,
  viewer?: Viewer; // is never provided in the state json but is used for reference
}
