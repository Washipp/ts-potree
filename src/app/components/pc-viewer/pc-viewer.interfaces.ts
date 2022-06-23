import { Matrix4, Object3D } from "three";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { MinifiedCameraState, Viewer } from "../../viewer/viewer";
import { CameraTrajectoryData } from "../../elements/camera-trajectory";
import { ComponentTreeData } from "../../services/scene-elements.service";

// Tuple with start/end point accordingly with the points in an array.
export type CustomLine = [number[], number[]];

export interface ElementAttributes {
  name: string,
  material?: any,
  imageUrl?: string,
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

export interface ViewerData extends ComponentTreeData {
  sceneId: number,
  elements: SceneElement[],
  camera?: MinifiedCameraState,
  viewer?: Viewer; // is never provided in the state json but is used for reference
}
