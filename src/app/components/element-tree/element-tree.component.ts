import { Component, Input, OnInit } from '@angular/core';
import { HelperFunctions } from "../utility/helper-functions";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { SceneElementsService } from "../../services/scene-elements.service";
import { SceneElement, ViewerData } from "../pc-viewer/pc-viewer.interfaces";
import { PointCloudOctree } from "@pnext/three-loader";

export interface ElementTree {
  potreePointClouds: SceneElement[];
  defaultPointClouds: SceneElement[];
  lineSets: SceneElement[];
  cameraTrajectories: SceneElement[];
  unknown: SceneElement[];
}

@Component({
  selector: 'app-element-tree',
  templateUrl: './element-tree.component.html',
  styleUrls: ['./element-tree.component.css']
})
export class ElementTreeComponent implements OnInit {

  private _data: any;
  @Input() set data(value: ViewerData) {
    this.getTree(value.sceneId, 0);
    this._data = value;
  }

  get data() {
    return this._data;
  }

  tree: ElementTree | undefined;
  enumEntriesMapping: Map<SceneElementsEnum, SceneElement[]>;
  visible: boolean = true; // TODO: set it up for each element separately.


  constructor(private sceneElementsService: SceneElementsService) {
    this.enumEntriesMapping = new Map<SceneElementsEnum, SceneElement[]>();
    for (const value of Object.values(SceneElementsEnum)) {
      this.enumEntriesMapping.set(value, []);
    }
  }

  private getTree(sceneId: number, numberOfTries: number): void {
    let promise = new Promise(resolve => setTimeout(resolve, 250));
    promise.then(() => {
        // Try to parse the elements for the scene to a tree.
        // If the data is not yet available, it returns undefined and we try again in 250ms.
        this.tree = this.parseToElementTree(this.sceneElementsService.getSceneElements(sceneId));
        if (this.tree === undefined && numberOfTries < this.sceneElementsService.maxTries) {
          let a: any = {numberOfTries};
          a.numberOfTries++;
          this.getTree(sceneId, a);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  toggleAllSceneElements(elements: SceneElement[]): void {
    elements.forEach(elem => {
      this.toggleSceneElement(elements, elem.elementId);
    });
  }

  toggleSceneElement(elements: SceneElement[], elementId: number): void {
    let pco = elements[elementId].element as PointCloudOctree;
    let mat = pco.material;
    mat.visible = !mat.visible;
  }

  parseToEnum(type: string): SceneElementsEnum | undefined {
    return HelperFunctions.enumFromStringValue(SceneElementsEnum, type);
  }

  /**
   * Parse to different interface for easier displaying and handling
   *
   * @param elements SceneElements of a scene.
   */
  private parseToElementTree(elements: SceneElement[]): ElementTree | undefined {
    if (elements === undefined) return undefined;
    let t: ElementTree = {
      potreePointClouds: [],
      defaultPointClouds: [],
      lineSets: [],
      cameraTrajectories: [],
      unknown: [],
    };

    elements.forEach((elem: SceneElement) => {
      if (this.enumEntriesMapping.has(elem.sceneType)) {
        this.enumEntriesMapping.get(elem.sceneType)?.push(elem);
      }

      switch (this.parseToEnum(elem.sceneType)) {
        case SceneElementsEnum.POTREE_POINT_CLOUD:
          t.potreePointClouds?.push(elem);
          break;
        case SceneElementsEnum.DEFAULT_POINT_CLOUD:
          t.defaultPointClouds?.push(elem);
          break;
        case SceneElementsEnum.LINE_SET:
          t.lineSets?.push(elem);
          break;
        case SceneElementsEnum.CAMERA_TRAJECTORY:
          t.cameraTrajectories?.push(elem);
          break;
        default:
          t.unknown?.push(elem);
          break;
      }
    });
    return t;
  }

}
