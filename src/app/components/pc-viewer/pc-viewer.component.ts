import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Viewer } from "../../viewer/viewer";
import { SceneElementsService } from "../../services/scene-elements.service";
import { CustomLine, ElementAttributes, SceneElement, ViewerData } from "./pc-viewer.interfaces";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { LineSet } from "../../elements/line-set";
import { CameraTrajectory, CameraTrajectoryData } from "../../elements/camera-trajectory";
import { Vector3 } from "three";
import { WebSocketService } from "../../services/web-socket.service";
import { HelperFunctions } from "../utility/helper-functions";

@Component({
  selector: 'app-pc-viewer',
  templateUrl: './pc-viewer.component.html',
  styleUrls: ['./pc-viewer.component.css']
})
export class PcViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('target') target: any;
  @Input() data: ViewerData;

  viewer: Viewer;

  constructor(private sceneElementsService: SceneElementsService, private socket: WebSocketService) {
    this.viewer = new Viewer(sceneElementsService, socket);
    this.data = { sceneId: -1, elements: [] };
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.start();
  }

  start() {
    if (this.target != null) {
      this.viewer.initialize(this.target.nativeElement);
      console.info("Initialize Viewer with SceneId: " + this.data.sceneId);
    } else {
      console.error("Target element not found");
      return;
    }

    // Add the data reference for other components
    this.data.viewer = this.viewer;
    this.sceneElementsService.addViewerData(this.data);

    // set the camera position.
    if (this.data.camera) {
      // convert from array to the corresponding objects.
      this.viewer.setCameraState(HelperFunctions.minifiedToFullCameraState(this.data.camera));
    }

    let elements = this.data.elements;

    elements.map((p: SceneElement) => {
      switch (p.sceneType) {
        case SceneElementsEnum.POTREE_POINT_CLOUD:
          this.addPotreePointCloud(p.source as string, p.attributes, p.elementId);
          break;
        case SceneElementsEnum.LINE_SET:
          this.addLineSet(p.source as CustomLine[], p.attributes, p.elementId);
          break;
        case SceneElementsEnum.CAMERA_TRAJECTORY:
          this.addCameraTrajectory(p.source as CameraTrajectoryData, p.attributes, p.elementId);
          break;
        case SceneElementsEnum.DEFAULT_POINT_CLOUD:
          this.addDefaultPointCloud(p.source as string, p.attributes, p.elementId);
          break;
        default:
          // TODO: Parse to object3D? Or create error?
          break;
      }
    });
  }

  private addDefaultPointCloud(url: string,
                               attributes: ElementAttributes,
                               elementId: number): void {
    this.viewer.loadDefaultPC(url).then(pc => {
      if (attributes.transformation) {
        pc.applyMatrix4(attributes.transformation);
      }
      pc.name = attributes.name;

      this.sceneElementsService.addSceneElement(this.data.sceneId, elementId, pc);
    });

  }

  private addCameraTrajectory(source: CameraTrajectoryData,
                              attributes: ElementAttributes,
                              elementId: number): void {
    let cameraTrajectory = new CameraTrajectory(source.t, source.r, attributes.imageUrl);
    cameraTrajectory.name = attributes.name;
    if (attributes.material?.color) {
      cameraTrajectory.setColor(attributes.material.color);
    }
    if (attributes.transformation) {
      cameraTrajectory.applyMatrix4(attributes.transformation);
    }
    this.viewer.loadCameraTrajectory(cameraTrajectory);
    this.sceneElementsService.addSceneElement(this.data.sceneId, elementId, cameraTrajectory);
  }

  private addLineSet(lines: CustomLine[],
                     attributes: ElementAttributes,
                     elementId: number): void {
    let set: [Vector3, Vector3][] = [];
    lines.forEach((line: CustomLine) => {
      let start = new Vector3();
      start.fromArray(line[0]);
      let end = new Vector3();
      end.fromArray(line[1]);
      set.push([start, end]);
    });
    let lineSet = new LineSet(set);

    lineSet.name = attributes.name;
    if (attributes.material?.color) {
      lineSet.setColor(attributes.material.color);
    }
    if (attributes.transformation) {
      lineSet.applyMatrix4(attributes.transformation);
    }
    this.viewer.loadLineSet(lineSet);
    this.sceneElementsService.addSceneElement(this.data.sceneId, elementId, lineSet);
  }

  private addPotreePointCloud(url: string,
                              attributes: ElementAttributes,
                              elementId: number): void {
    this.viewer.loadPotreePCO("cloud.js", url).then(pco => {
      pco.name = attributes.name;
      if (attributes.material?.size) {
        pco.material.size = attributes.material.size;
      }
      if (attributes.transformation) {
        pco.applyMatrix4(attributes.transformation);
      }

      this.sceneElementsService.addSceneElement(this.data.sceneId, elementId, pco);
    });
  }
}
