import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Viewer } from "../viewer";
import { Options } from "@angular-slider/ngx-slider";

@Component({
  selector: 'app-pc-viewer',
  templateUrl: './pc-viewer.component.html',
  styleUrls: ['./pc-viewer.component.css']
})
export class PcViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('target') target: any;

  viewer: Viewer;

  visible = true;
  color: string;

  // point size slider
  pointSize: number = 3;
  options: Options = {
    floor: 0,
    ceil: 20
  };


  constructor() {
    this.viewer = new Viewer();
    this.color = "#000000"
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onVisibleToggle(): void {
    this.visible = !this.visible;
    this.viewer.changeVisibility(this.visible);
  }

  onPointSizeChange(): void {
    this.viewer.pointResize(this.pointSize);
  }

  onColorChange(): void {
    this.viewer.recolor(this.color);
  }

  unload(): void {
    this.viewer.destroy();
  }

  start() {
    if (this.target != null) {
      this.viewer.initialize(this.target.nativeElement);
      console.log("Initialize Viewer")
    } else {
      console.log("target element not found")
    }
    this.viewer
      .load("cloud.js", "http://127.0.0.1:5000/data/lion_takanawa/")
      .then(pco => {
        // Make the lion shows up at the center of the screen.
        pco.translateX(-1);
        pco.rotateX(-Math.PI / 2);

        pco.material.size = 1.0;
      })
      .catch(err => console.error(err));
  }


}
