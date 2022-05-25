import { Matrix4, Object3D, Vector3 } from "three";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { Viewer } from "../../viewer/viewer";

export interface CustomLine {
  start: Vector3,
  end: Vector3,
}

export interface ElementAttributes {
  name: string,
  material?: any,
  position?: Vector3, // TODO: remove position and scale.
  scale?: Vector3,
  transformation?: Matrix4,
}

export interface SceneElement {
  elementId: number,
  source: string | CustomLine[],
  sceneType: SceneElementsEnum,
  attributes: ElementAttributes,
  visible?: boolean,
  element?: Object3D,
}

export interface ViewerData {
  sceneId: number,
  elements: SceneElement[],
  viewer?: Viewer;
}
