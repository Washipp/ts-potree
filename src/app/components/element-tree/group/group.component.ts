import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementTreeGroup } from "../element-tree.component";
import { SceneElementsService } from "../../../services/scene-elements.service";
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { HelperFunctions } from "../../utility/helper-functions";
import { PointCloudOctree } from "@pnext/three-loader";
import { Points } from "three";
import { LineSet } from "../../../elements/line-set";
import { CameraTrajectory } from "../../../elements/camera-trajectory";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  private _data: ElementTreeGroup;

  groupedTypes: Map<SceneElementsEnum, SceneElement[]> = new Map<SceneElementsEnum, SceneElement[]>();

  @Output() selectedElementEvent = new EventEmitter<[SceneElementsEnum, SceneElement[]]>();
  @Input() sceneId: number;

  @Input() set data(value: ElementTreeGroup) {
    this._data = value;
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
    if (this._data.ids.length != 0) {
      this.loadComponents(this._data.ids);
    }
  }

  setAllSceneElementsVisibility(visible: boolean): void {
    this.setGroupVisibility([this.data], visible)
  }

  setGroupVisibility(groups: ElementTreeGroup[], visible: boolean) {
    groups.map(group => {
      group.visible = visible
      group.sceneElements?.map(elem => {
        this.setSceneElementVisibility(elem, visible);
      });

      this.setGroupVisibility(group.groups, visible);
    });
  }


  setSceneElementVisibility(element: SceneElement, visible: boolean) {
    switch (HelperFunctions.enumFromStringValue(SceneElementsEnum, element.sceneType)) {
      case SceneElementsEnum.POTREE_POINT_CLOUD:
        let pco = element.element as PointCloudOctree
        pco.visible = visible;
        break;
      case SceneElementsEnum.DEFAULT_POINT_CLOUD:
        let pc = element.element as Points;
        pc.visible = visible;
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

  setSelectedElement(event: [SceneElementsEnum, SceneElement[]]): void {
    // pass the event up to the parents until we reach the element-tree component.
    this.selectedElementEvent.emit(event);
  }

  /**
   * Creates a mapping from SceneElementEnum to all used SceneElements in ids and groups them together.
   * This is used to apply settings/visibility to all SceneElements of the same type at the same time.
   *
   * @param elements Elements to parse.
   */
  parseToElementTree(elements: SceneElement[]): Map<SceneElementsEnum, SceneElement[]> {
    elements.map((elem: SceneElement) => {
      if (!this.groupedTypes.has(elem.sceneType)) {
        this.groupedTypes.set(elem.sceneType, []);
      }
      this.groupedTypes.get(elem.sceneType)?.push(elem);
    });
    return this.groupedTypes;
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
      this._data.sceneElements = [];
      if (d.has(this.sceneId)) {
        d.get(this.sceneId)?.elements.map((elem) => {
          if (ids.includes(elem.elementId)) {
            this._data.sceneElements?.push(elem);
          }
        });
        // We need to set the element tree after all the change detections have been triggered
        // and throws ExpressionChangedAfterItHasBeenCheckedError. More info https://angular.io/errors/NG0100
        // It could lead to an infinite loop or some inconsistent view state.
        // here we create a macro task that gets executed after the synchronous parts.
        setTimeout(() => {
          if (this._data.sceneElements) {
            this.parseToElementTree(this._data.sceneElements);
          }
        });
      }
    });
  }


}
