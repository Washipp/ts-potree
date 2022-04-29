import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Viewer} from "../viewer";

@Component({
  selector: 'app-pc-viewer',
  templateUrl: './pc-viewer.component.html',
  styleUrls: ['./pc-viewer.component.css']
})
export class PcViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('target') target: any;

  viewer: Viewer;


  constructor() {
    this.viewer = new Viewer();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.start()
  }

  start() {
    if(this.target != null) {
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
