import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementTreeBranch } from "../element-tree.component";
import { SceneElementsService } from "../../../services/scene-elements.service";
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";
import { HelperFunctions } from "../../utility/helper-functions";
import { PointCloudOctree } from "@pnext/three-loader";
import { Points } from "three";
import { LineSet } from "../../../elements/line-set";
import { CameraTrajectory } from "../../../elements/camera-trajectory";

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  private _data: ElementTreeBranch;

  groupedTypes: Map<SceneElementsEnum, SceneElement[]> = new Map<SceneElementsEnum, SceneElement[]>();

  @Output() selectedElementEvent = new EventEmitter<[SceneElementsEnum, SceneElement[]]>();
  @Input() sceneId: number;

  @Input() set data(value: ElementTreeBranch) {
    this._data = value;
  }

  get data() {
    return this._data;
  }

  constructor(private sceneElementsService: SceneElementsService) {
    // set default data
    this.sceneId = -1;
    this._data = {
      branchId: -1,
      name: "Unknown",
      ids: [],
      branches: [],
      visible: false
    }
  }

  ngOnInit(): void {
    this.loadComponents(Array.from(this._data.ids));
  }

  setAllSceneElementsVisibility(visible: boolean): void {
    // Set visibility recursively in all branches
    this.data.branches.map(branch => {
      branch.visible = visible;
      branch.sceneElements?.map(elem => {
        this.setSceneElementVisibility(elem, visible);
      })
    });

    // Set visibility of all components in this branch
    this.data.sceneElements?.map(elem => {
      this.setSceneElementVisibility(elem, visible);
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
        lineSet.visible = visible;
        lineSet.setVisibility(visible);
        break;
      case SceneElementsEnum.CAMERA_TRAJECTORY:
        let cameraTrajectory = element.element as CameraTrajectory
        cameraTrajectory.visible = visible;
        cameraTrajectory.setVisibility(visible);
        break;
      default:
        break;
    }
  }

  setSelectedElement(event: [SceneElementsEnum, SceneElement[]]): void {
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
        // We need to set  the element tree after all the change detections have been triggered
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
