import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Viewer } from "../../viewer/viewer";
import { PointCloudOctree } from "@pnext/three-loader";
import { SceneElementsService } from "../../services/scene-elements.service";
import { ElementAttributes, SceneElements, ViewerData } from "./pc-viewer.interfaces";

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
  sceneId: number = -1;

  constructor(private sceneElementsService: SceneElementsService) {
    this.viewer = new Viewer();
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
    this.sceneId = this.data.sceneId;

    pcs.map((p: SceneElements) => {
      this.addPointCloud(this.viewer.load("cloud.js", p.url), p.attributes, p.elementId);
    });

  }

  private addPointCloud(promise: Promise<PointCloudOctree>, attributes: ElementAttributes, elementId: number): void {
    promise.then(pco => {
      this.applyAttributes(pco, attributes);
      pco.translateX(-1);
      pco.rotateX(-Math.PI / 2);

      this.sceneElementsService.addSceneElement(this.sceneId, elementId, pco);
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
