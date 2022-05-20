import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Viewer } from "../../../viewer/viewer";
import { PointCloudOctree } from "@pnext/three-loader";

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

  constructor() {
    this.viewer = new Viewer();
    this.showBoundingBox = false;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
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
      console.log("target element not found")
      return;
    }

    let pcs = [
      {
        url: "http://127.0.0.1:5000/data/lion_takanawa/",
        callback: (pco: PointCloudOctree) => {
          pco.name = "Lion 1"
          pco.material.size = 2;
          pco.position.set(-15, 0, 0);
          pco.scale.set(10, 10, 10);
          pco.translateX(-1);
          pco.rotateX(-Math.PI / 2);
        },

      }, {
        url: "http://127.0.0.1:5000/data/lion_takanawa/",
        callback: (pco: PointCloudOctree) => {
          pco.name = "Lion 2"

          pco.material.size = 2;
          pco.position.set(15, 0, 0);
          pco.scale.set(10, 10, 10);
          pco.translateX(-1);
          pco.rotateX(-Math.PI / 2);
        },
      }
    ];

    pcs.map(p => this.addPointCloud(this.viewer.load("cloud.js", p.url), p.callback));

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

  private addPointCloud(promise: Promise<PointCloudOctree>, callback: any): void {
    promise.then(pco => {
      callback(pco);
    });
  }

}
