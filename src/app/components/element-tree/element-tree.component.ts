import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { SceneElementsService } from "../../services/scene-elements.service";
import { SceneElement, ViewerData } from "../pc-viewer/pc-viewer.interfaces";
import { HelperFunctions } from "../utility/helper-functions";

@Component({
  selector: 'app-element-tree',
  templateUrl: './element-tree.component.html',
  styleUrls: ['./element-tree.component.css']
})
export class ElementTreeComponent implements OnInit {

  elem = SceneElementsEnum; // used in template as ENUM
  private _data: any;
  private sceneId: number;
  @Input() set data(value: ViewerData) {
    this.getTree(value.sceneId, 0);
    this.sceneId = value.sceneId;
    this._data = value;
  }

  get data() {
    return this._data;
  }

  private selectedElement: [SceneElementsEnum, number];
  elementData: any | undefined;

  setSelectedElement(value: [SceneElementsEnum, number]) {
    // Check if the correct settings are already loaded
    if (this.selectedElement[0] === value[0] && this.selectedElement[1] === value[1]) return;

    // if not load the new ones.
    this.selectedElement = value;
    this.elementData = {
      sceneId: this.sceneId,
      elementId: this.selectedElement[1],
      elementType: this.selectedElement[0]
    };
  }


  /**
   * Per supported element we create a mapping.
   */
  tree: Map<SceneElementsEnum, SceneElement[]> | undefined;


  constructor(private sceneElementsService: SceneElementsService) {
    this.sceneId = -1;
    this.selectedElement = [SceneElementsEnum.UNKNOWN, -1];
  }

  ngOnInit(): void {
  }

  private getTree(sceneId: number, numberOfTries: number): void {
    let promise = new Promise(resolve => setTimeout(resolve, 250));
    promise.then(() => {
        // Try to parse the elements for the scene to a tree.
        // If the data is not yet available, it returns undefined and we try again in 250ms.
        let parsed = this.parseToElementTree(this.sceneElementsService.getSceneElements(sceneId));
        if (!parsed && numberOfTries < this.sceneElementsService.maxTries) {
          let a: any = {numberOfTries};
          a.numberOfTries++;
          this.getTree(sceneId, a);
        }
      }
    );
  }

  /**
   * Parse to different interface for easier displaying and handling
   *
   * @param elements SceneElements of a scene.
   */
  private parseToElementTree(elements: SceneElement[]): boolean {
    if (elements === undefined) return false;

    this.tree = new Map<SceneElementsEnum, SceneElement[]>();
    for (const value of Object.values(SceneElementsEnum)) {
      this.tree.set(value, []);
    }

    elements.forEach((elem: SceneElement) => {
      if (this.tree?.has(elem.sceneType)) {
        this.tree?.get(elem.sceneType)?.push(elem);
      }
    });
    return true;
  }

  parseToEnum(type: string): SceneElementsEnum | undefined {
    return HelperFunctions.enumFromStringValue(SceneElementsEnum, type);
  }

}
