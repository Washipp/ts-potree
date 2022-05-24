import { Object3D, Vector3 } from "three";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { Viewer } from "../../viewer/viewer";

export interface ElementAttributes {
  name: string,
  material?: any,
  position?: Vector3, // TODO: change to a 4x4 matrix called transform
  scale?: Vector3,
}

export interface SceneElements {
  elementId: number,
  url: string,
  sceneType: SceneElementsEnum,
  attributes: ElementAttributes,
  element?: Object3D,
}

export interface ViewerData {
  sceneId: number,
  elements: SceneElements[],
  viewer?: Viewer;
}
