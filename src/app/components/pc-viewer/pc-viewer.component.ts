import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Viewer } from "../../viewer/viewer";
import { PointCloudOctree } from "@pnext/three-loader";
import { SceneElementsService } from "../../services/scene-elements.service";
import { CustomLine, ElementAttributes, SceneElement, ViewerData } from "./pc-viewer.interfaces";
import { SceneElementsEnum } from "../../viewer/scene-elements.enum";
import { LineSet } from "../../elements/line-set";

@Component({
  selector: 'app-pc-viewer',
  templateUrl: './pc-viewer.component.html',
  styleUrls: ['./pc-viewer.component.css']
})
export class PcViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('target') target: any;
  @Input() data: ViewerData;

  viewer: Viewer;
  showBoundingBox: boolean;

  constructor(private sceneElementsService: SceneElementsService) {
    this.viewer = new Viewer(sceneElementsService);
    this.showBoundingBox = false;
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
      console.log("Initialize Viewer");
    } else {
      console.log("Target element not found");
      return;
    }

    // Add the data reference for other components
    this.data.viewer = this.viewer;
    this.sceneElementsService.addViewerData(this.data);

    let pcs = this.data.elements;

    pcs.map((p: SceneElement) => {
      switch (p.sceneType) {
        case SceneElementsEnum.POTREE_POINT_CLOUD:
          this.addPointCloud(this.viewer.loadPotreePCO("cloud.js", p.source as string), p.attributes, p.elementId);
          break;
        case SceneElementsEnum.LINE_SET:
          this.addLineSet(p.source as CustomLine[], p.attributes, p.elementId);
          break;
        case SceneElementsEnum.CAMERA_TRAJECTORY:
          break;
        case SceneElementsEnum.DEFAULT_POINT_CLOUD:
          break;
        default:
          break;
      }
    });
  }

  private addLineSet(lines: CustomLine[], attributes: ElementAttributes, elementId: number): void {
    let lineSet = new LineSet();
    lines.forEach((line: CustomLine) => {
      let start = line.start;
      let end = line.end;
      lineSet.addLine([start, end]);
    });
    if (attributes.transformation) {
      lineSet.applyMatrix4(attributes.transformation);
    }
    this.viewer.loadLineSet(lineSet);
    this.sceneElementsService.addSceneElement(this.data.sceneId, elementId, lineSet);
  }

  private addPointCloud(promise: Promise<PointCloudOctree>, attributes: ElementAttributes, elementId: number): void {
    promise.then(pco => {
      this.applyAttributes(pco, attributes);
      if (attributes.transformation) {
        pco.applyMatrix4(attributes.transformation);
      }
      pco.translateX(-1);
      pco.rotateX(-Math.PI / 2);

      this.sceneElementsService.addSceneElement(this.data.sceneId, elementId, pco);
    });
  }

  private applyAttributes(pco: PointCloudOctree, attributes: ElementAttributes): void {
    pco.name = attributes.name;
    pco.material.size = attributes.material.size;
    if (attributes.position) {
      pco.position.set(attributes.position.x, attributes.position.y, attributes.position.z);
    }
    if (attributes.scale) {
      pco.scale.set(attributes.scale.x, attributes.scale.y, attributes.scale.z);
    }
  }

}
