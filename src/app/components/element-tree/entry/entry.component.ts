import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";
import { LineSet } from "../../../elements/line-set";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { HelperFunctions } from "../../utility/helper-functions";
import { CameraTrajectory } from "../../../elements/camera-trajectory";
import { PotreePointCloud } from "../../../elements/potree-point-cloud";
import { DefaultPointCloud } from "../../../elements/default-point-cloud";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  @Input() elementType: SceneElementsEnum;
  @Output() selectedElementEvent = new EventEmitter<[SceneElementsEnum, SceneElement[]]>();

  @Input() elements: SceneElement[];
  @Input() visible: boolean = true;

  constructor() {
    this.elements = [];
    this.elementType = SceneElementsEnum.UNKNOWN;
  }

  ngOnInit(): void {
  }

  loadElementSettings() {
    this.selectedElementEvent.emit([this.elementType, this.elements]);
  }

  setAllSceneElementsVisibility(visible: boolean): void {
    this.elements.forEach(elem => {
      this.setSceneElementVisibility(elem.elementId, visible);
    });
  }

  setSceneElementVisibility(elementId: number, visible: boolean) {
    let elem = this.getElement(this.elements, elementId);
    if (elem == undefined) return;
    switch (HelperFunctions.enumFromStringValue(SceneElementsEnum, elem.sceneType)) {
      case SceneElementsEnum.POTREE_POINT_CLOUD:
        let pco = elem.element as PotreePointCloud
        pco.setVisibility(visible);
        break;
      case SceneElementsEnum.DEFAULT_POINT_CLOUD:
        let pc = elem.element as DefaultPointCloud;
        pc.setVisibility(visible);
        break;
      case SceneElementsEnum.LINE_SET:
        let lineSet = elem.element as LineSet
        lineSet.setVisibility(visible);
        break;
      case SceneElementsEnum.CAMERA_TRAJECTORY:
        let cameraTrajectory = elem.element as CameraTrajectory
        cameraTrajectory.setVisibility(visible);
        break;
      default:
        break;
    }
  }

  getVisibility(): boolean {
    this.elements.forEach(elem => {
      let vis = elem.element?.visible;
      if (vis === undefined) {
        return false;
      } else {
        return vis;
      }
    });
    return false;
  }

  getElement(elements: SceneElement[], elementId: number): SceneElement | undefined {
    let returnElem = undefined;
    elements.forEach(elem => {
      if (elem.elementId === elementId) {
        returnElem = elem;
      }
    });
    return returnElem;
  }

}
