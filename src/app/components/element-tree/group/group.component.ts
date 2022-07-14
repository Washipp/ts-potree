import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementTreeGroup } from "../element-tree.component";
import { SceneElementsService } from "../../../services/scene-elements.service";
import { SceneElement } from "../../scene/scene.interfaces";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { HelperFunctions } from "../../utility/helper-functions";
import { LineSet } from "../../../elements/line-set";
import { CameraTrajectory } from "../../../elements/camera-trajectory";
import { PotreePointCloud } from "../../../elements/potree-point-cloud";
import { DefaultPointCloud } from "../../../elements/default-point-cloud";
import { Viewer } from "../../../viewer/viewer";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  viewer: Viewer | undefined;

  @Output() selectedElementEvent = new EventEmitter<SceneElement[]>();
  @Input() sceneId: number;

  private _data: ElementTreeGroup;

  @Input() set data(value: ElementTreeGroup) {
    this._data = value;
    this.loadComponents(this.data.ids);
  }

  get data() {
    return this._data;
  }

  constructor(private sceneElementsService: SceneElementsService) {
    // set default data
    this.sceneId = -1;
    this._data = {
      groupId: -1,
      name: "Unknown",
      ids: [],
      groups: [],
      visible: false
    }
  }

  ngOnInit(): void {
  }

  setGroupVisibility(groups: ElementTreeGroup[], visible: boolean) {
    groups.map(group => {
      group.visible = visible
      if (group.sceneElements) {
        this.setSceneElementsVisibility(group.sceneElements, visible);
      }
      this.setGroupVisibility(group.groups, visible);
    });
  }

  setSceneElementsVisibility(elements: SceneElement[] | undefined, visible: boolean) {
    elements?.forEach(elem => {
      this.setSceneElementVisibility(elem, visible);
    });
    this.viewer?.requestRender();
  }

  setSceneElementVisibility(element: SceneElement, visible: boolean) {
    switch (HelperFunctions.enumFromStringValue(SceneElementsEnum, element.sceneType)) {
      case SceneElementsEnum.POTREE_POINT_CLOUD:
        let pco = element.element as PotreePointCloud
        pco.setVisibility(visible);
        break;
      case SceneElementsEnum.DEFAULT_POINT_CLOUD:
        let pc = element.element as DefaultPointCloud;
        pc.setVisibility(visible);
        break;
      case SceneElementsEnum.LINE_SET:
        let lineSet = element.element as LineSet
        lineSet.setVisibility(visible);
        break;
      case SceneElementsEnum.CAMERA_TRAJECTORY:
        let cameraTrajectory = element.element as CameraTrajectory
        cameraTrajectory.setVisibility(visible);
        break;
      default:
        break;
    }
  }

  setSelectedElement(event: SceneElement[] | undefined): void {
    if (event) {
      // pass the event up to the parents until we reach the element-tree component.
      this.selectedElementEvent.emit(event);
    }
  }

  /**
   * Subscribes to the viewer data observable and if the data and therefore the components are available,
   * add them to the data and create a grouping of the same types.
   *
   * @param ids component ids to load
   * @private
   */
  private loadComponents(ids: number[]): void {
    this.sceneElementsService.getViewerData().subscribe(d => {
      this.viewer = d.get(this.sceneId)?.viewer;
      this.data.sceneElements = [];
      let viewerData = d.get(this.sceneId);
      if (viewerData) {
        viewerData.elements.map((elem) => {
          if (ids.includes(elem.elementId)) {
            this.data.sceneElements?.push(elem);
          }
        });
        // We need to set the element tree after all the change detections have been triggered
        // and throws ExpressionChangedAfterItHasBeenCheckedError. More info https://angular.io/errors/NG0100
        // It could lead to an infinite loop or some inconsistent view state.
        // here we create a macro task that gets executed after the synchronous parts.
        // setTimeout(() => {
        //   this.viewer = d.get(this.sceneId)?.viewer;
        // });
      }
    });
  }

}
