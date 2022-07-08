import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Viewer } from "../../viewer/viewer";
import { SceneElementsService } from "../../services/scene-elements.service";
import { CustomLine, ElementAttributes, SceneElement, ViewerData } from "./scene.interfaces";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { LineSet } from "../../elements/line-set";
import { CameraTrajectory, CameraTrajectoryData } from "../../elements/camera-trajectory";
import { Vector3 } from "three";
import { WebSocketService } from "../../services/web-socket.service";
import { HelperFunctions } from "../utility/helper-functions";
import { ShortcutInput } from "ng-keyboard-shortcuts";
import { Clipboard } from '@angular/cdk/clipboard';
import { Platform } from '@angular/cdk/platform';
import { PotreePointCloud } from "../../elements/potree-point-cloud";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit, AfterViewInit {

  @ViewChild('target') target: any;
  @Input() data: ViewerData;

  shortcuts: ShortcutInput[] = [];

  viewer: Viewer;

  constructor(private sceneElementsService: SceneElementsService, private socket: WebSocketService,
              private clipboard: Clipboard, private platform: Platform, private activateRoute: ActivatedRoute) {
    this.viewer = new Viewer(sceneElementsService, socket);
    this.data = {sceneId: -1, elements: []};
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.start();
    this.shortcuts.push(
      {
        key: ["ctrl + c", "cmd + c"],
        preventDefault: true,
        command: () => {
          let state = JSON.stringify(this.viewer.getCurrentCameraState(this.viewer.camera));
          this.clipboard.copy(state);
        }
      },
      {
        key: ["ctrl + v", "cmd + v"],
        preventDefault: true,
        command: () => {
          if (this.platform.FIREFOX) {
            console.info("Pasting only supported on Chromium Browsers.")
            return;
          }
          navigator.clipboard.readText().then((data) => {
            this.viewer.setCameraState(JSON.parse(data));
            console.log("Pasted camera position");
          });
        }
      }
    );

    // Load camera state from url if it exists.
    this.activateRoute.queryParamMap
      .subscribe((params) => {
        let paramsObject = { ...params };
        this.viewer.setCameraState(HelperFunctions.urlToFullCameraState(paramsObject));
      });
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
      if (attributes.material?.size) {
        pc.setPointSize(attributes.material.size);
      }
      if (attributes.material?.color) {
        pc.setColor(attributes.material.color);
      }

      this.sceneElementsService.addSceneElement(this.data.sceneId, elementId, pc);
    });

  }

  private addCameraTrajectory(source: CameraTrajectoryData,
                              attributes: ElementAttributes,
                              elementId: number): void {
    let cameraTrajectory = new CameraTrajectory(source);
    cameraTrajectory.name = attributes.name;

    if (attributes.material?.color) {
      cameraTrajectory.setColor(attributes.material.color);
    } else {
      cameraTrajectory.setColor('#FF0000') // set default color to red.
    }

    cameraTrajectory.setFrustumSize(0.5); // default value

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
    } else {
      lineSet.setColor('#FF0000') // set default color to red.
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
      let ppc = new PotreePointCloud(pco);
      ppc.setName(attributes.name);
      if (attributes.material?.size) {
        ppc.setPointSize(attributes.material.size);
      }
      if (attributes.material?.color) {
        ppc.setColor(attributes.material.color);
      }

      if (attributes.transformation) {
        ppc.applyMatrix4(attributes.transformation);
      }

      this.sceneElementsService.addSceneElement(this.data.sceneId, elementId, ppc);
    });
  }
}