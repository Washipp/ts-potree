import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { CameraState, Viewer } from "../../viewer/viewer";
import { CameraTrajectoryData } from "../../elements/camera-trajectory";
import { ComponentTreeData } from "../../services/scene-elements.service";
import { ElementSetting } from "../element-setting/element-setting";

// Tuple with start/end point accordingly with the points in an array.
export type CustomLine = [number[], number[]];

export interface ElementAttributes {
  name: string,
  material?: any,
  imageUrl?: string,
  transformation?: number[],
}

export interface SceneElement {
  elementId: number,
  source: string | CustomLine[] | CameraTrajectoryData,
  sceneType: SceneElementsEnum,
  attributes: ElementAttributes,
  visible?: boolean,
  element?: ElementSetting,
}

export interface ViewerData extends ComponentTreeData {
  sceneId: number,
  elements: SceneElement[],
  camera?: CameraState,
  viewer?: Viewer; // is never provided in the state json but is used for reference
}
