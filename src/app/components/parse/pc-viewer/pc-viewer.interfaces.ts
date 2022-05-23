import { Vector3 } from "three";

export interface PCOAttributes {
  name: string,
  material?: any,
  position?: Vector3,
  scale?: Vector3,
}

export interface PCOElements {
  elementId: number,
  url: string,
  attributes: PCOAttributes
}

export interface PCViewerElements {
  sceneId: number,
  pcos: PCOElements[]
}
