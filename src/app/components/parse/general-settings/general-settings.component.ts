import { Component, Input, OnInit } from '@angular/core';
import { PcoService } from "../../../services/pco.service";
import { Viewer } from "../../../viewer/viewer";

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {

  sceneId: number = -1;
  showBoundingBox: boolean = false;
  private maxTries: number = 10;
  viewer: Viewer | undefined;

  private _data: Viewer | undefined;
  @Input() set data(value: any) {
    this.getViewer(value.sceneId, 0);
  }

  get data() {
    return this._data
  }

  /**
   * Check every 250ms if the data/pcos are available.
   *
   * @param sceneId Scene which holds elements.
   * @param numberOfTries Current try number.
   */
  getViewer(sceneId: number, numberOfTries: number) {
    let promise = new Promise(resolve => setTimeout(resolve, 250));
    promise.then(() => {
        this.viewer = this.pcoService.getPcViewer(sceneId);
        if (this.viewer === undefined && numberOfTries < this.maxTries) {
          this.getViewer(sceneId, numberOfTries++);
        }
      }
    );
  }


  constructor(private pcoService: PcoService) {

  }

  ngOnInit(): void {
  }

  unload(): void {

  }

  changeBackground(): void {
    if (this.viewer) {
      this.viewer?.changeBackground()
    }
  }

  setBoundingBox(): void {
    this.showBoundingBox = !this.showBoundingBox;
    if (this.viewer) {
      this.viewer.setBoundingBox(this.showBoundingBox);
    }
  }

  start() {

  }

}
