import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";
import { PointCloudOctree } from "@pnext/three-loader";
import { LineSet } from "../../../elements/line-set";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { HelperFunctions } from "../../utility/helper-functions";
import { CameraTrajectory } from "../../../elements/camera-trajectory";

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  @Input() title: SceneElementsEnum;
  @Output() selectedElementEvent = new EventEmitter<[SceneElementsEnum, number]>();

  @Input() elements: SceneElement[];
  visible: boolean = true;

  constructor() {
    this.elements = [];
    this.title = SceneElementsEnum.UNKNOWN;
  }

  ngOnInit(): void {
  }

  loadElementSettings(id: number) {
    this.selectedElementEvent.emit([this.title, id]);
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
        let pco = elem.element as PointCloudOctree
        pco.visible = visible;
        break;
      case SceneElementsEnum.DEFAULT_POINT_CLOUD:
        break;
      case SceneElementsEnum.LINE_SET:
        let lineSet = elem.element as LineSet
        lineSet.visible = visible;
        lineSet.setVisibility(visible);
        break;
      case SceneElementsEnum.CAMERA_TRAJECTORY:
        let cameraTrajectory = elem.element as CameraTrajectory
        cameraTrajectory.visible = visible;
        cameraTrajectory.setVisibility(visible);
        break;
      default:
        break;
    }
  }

  getVisibility(elementId: number): boolean {
    let vis = this.getElement(this.elements, elementId)?.element?.visible;
    if (vis === undefined) {
      return false;
    } else {
      return vis;
    }
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
