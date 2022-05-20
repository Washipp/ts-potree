import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Viewer } from "../../../viewer/viewer";
import { PointCloudOctree } from "@pnext/three-loader";
import { PcoService } from "../../../services/pco.service";

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
    this.start();
  }

  unload(): void {
    this.viewer.destroy();
  }

  changeBackground(): void {
    this.viewer.changeBackground();
  }

  setBoundingBox(): void{
    this.viewer.setBoundingBox(this.showBoundingBox);
  }

  start() {
    if (this.target != null) {
      this.viewer.initialize(this.target.nativeElement);
      console.log("Initialize Viewer")
    } else {
      console.log("Target element not found")
      return;
    }

    let pcs = this.data.pcos;
    this.sceneId = this.data.sceneId;

    pcs.map((p: { elementId: number; url: string; callback: any; }) => {
        this.addPointCloud(this.viewer.load("cloud.js", p.url), p.callback, p.elementId);
      });

    // this.viewer
    //   .load("cloud.js", "http://127.0.0.1:5000/data/lion_takanawa/")
    //   .then(pco => {
    //     // Make the lion shows up at the center of the screen.
    //     pco.translateX(-1);
    //     pco.rotateX(-Math.PI / 2);
    //
    //     pco.material.size = this.pointSize;
    //   })
    //   .catch(err => console.error(err));
  }

  private addPointCloud(promise: Promise<PointCloudOctree>, callback: any, elementId: number): void {
    promise.then(pco => {
      callback(pco);
      this.pcoService.addSceneElement(this.sceneId, elementId, pco);
    });
  }

}
