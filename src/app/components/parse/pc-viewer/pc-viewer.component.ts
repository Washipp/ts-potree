import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Viewer } from "../../../viewer/viewer";
import { PointCloudOctree } from "@pnext/three-loader";
import { PcoService } from "../../../services/pco.service";
import { PCOAttributes, PCOElements } from "./pc-viewer.interfaces";

@Component({
  selector: 'app-pc-viewer',
  templateUrl: './pc-viewer.component.html',
  styleUrls: ['./pc-viewer.component.css']
})
export class PcViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('target') target: any;
  @Input() data: any;

  viewer: Viewer;
  showBoundingBox: boolean;
  sceneId: number = -1;

  constructor(private pcoService: PcoService) {
    this.viewer = new Viewer(pcoService);
    this.showBoundingBox = false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.pcoService.addPcViewer(this.data.sceneId, this.viewer);
    this.start();
  }

  unload(): void {
    this.viewer.destroy();
  }

  changeBackground(): void {
    this.viewer.changeBackground();
  }

  setBoundingBox(): void {
    this.viewer.setBoundingBox(this.showBoundingBox);
  }

  start() {
    if (this.target != null) {
      this.viewer.initialize(this.target.nativeElement);
      console.log("Initialize Viewer");
    } else {
      console.log("Target element not found");
      return;
    }

    let pcs = this.data.pcos;
    this.sceneId = this.data.sceneId;

    pcs.map((p: PCOElements) => {
      this.addPointCloud(this.viewer.load("cloud.js", p.url), p.attributes, p.elementId);
    });

  }

  private addPointCloud(promise: Promise<PointCloudOctree>, attributes: PCOAttributes, elementId: number): void {
    promise.then(pco => {
      this.applyAttributes(pco, attributes);
      pco.translateX(-1);
      pco.rotateX(-Math.PI / 2);

      // add reference to service for the settings component.
      this.pcoService.addSceneElement(this.sceneId, elementId, pco);
    });
  }

  private applyAttributes(pco: PointCloudOctree, attributes: PCOAttributes): void {
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
