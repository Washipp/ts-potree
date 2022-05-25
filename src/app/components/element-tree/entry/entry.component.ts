import { Component, Input, OnInit } from '@angular/core';
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";
import { PointCloudOctree } from "@pnext/three-loader";
import { LineSet } from "../../../elements/line-set";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { HelperFunctions } from "../../utility/helper-functions";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  @Input() title: string;

  @Input() elements: SceneElement[];
  visible: boolean = true;

  constructor() {
    this.elements = [];
    this.title = "";
  }

  ngOnInit(): void {
  }


  toggleAllSceneElements() {
    this.elements.forEach(elem => {
      this.toggleSceneElement(elem.elementId);
    })
  }

  toggleSceneElement(elementId: number) {
    let elem = this.getElement(this.elements, elementId);
    if (elem == undefined) return;
    switch (HelperFunctions.enumFromStringValue(SceneElementsEnum, elem.sceneType)) {
      case SceneElementsEnum.POTREE_POINT_CLOUD:
        let pco = elem.element as PointCloudOctree
        pco.visible = !pco.visible;
        pco.material.visible = pco.visible;
        break;
      case SceneElementsEnum.DEFAULT_POINT_CLOUD:
        break;
      case SceneElementsEnum.LINE_SET:
        let lineSet = elem.element as LineSet
        lineSet.visible = !lineSet.visible;
        lineSet.material.visible = lineSet.visible;
        break;
      case SceneElementsEnum.CAMERA_TRAJECTORY:
        break;
      default:
        break;
    }
  }

  getElement(elements: SceneElement[], elementId:number) : SceneElement | undefined {
    let returnElem = undefined;
    elements.forEach(elem => {
      if (elem.elementId === elementId) {
        returnElem = elem;
      }
    });
    return returnElem;
  }

}
