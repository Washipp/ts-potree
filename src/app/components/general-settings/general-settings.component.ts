import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsService } from "../../services/scene-elements.service";
import { Viewer } from "../../viewer/viewer";

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css', '../element-settings/element-settings.css']
})
export class GeneralSettingsComponent implements OnInit {

  options: any = {
    min: 100_000,
    max: 20_000_000
  };

  pointBudget: number = 1000_000;
  sceneId: number = -1;
  showBoundingBox: boolean = false;
  viewer: Viewer | undefined;
  backgroundColor: string = '#000000';

  private _data: Viewer | undefined;
  @Input() set data(value: any) {
    this.sceneId = value.sceneId;
    this.loadViewer(value.sceneId, 0);
    this._data = value;
  }

  get data() {
    return this._data
  }

  /**
   * Check every 250ms if the viewer is available.
   *
   * @param sceneId Scene which holds elements.
   * @param numberOfTries Current try number.
   */
  loadViewer(sceneId: number, numberOfTries: number) {
    let promise = new Promise(resolve => setTimeout(resolve, 250));
    promise.then(() => {
        this.viewer = this.sceneElementsService.getPcViewer(sceneId);
        if (this.viewer === undefined && numberOfTries < this.sceneElementsService.maxTries) {
          this.loadViewer(sceneId, numberOfTries++);
        }
    });
  }


  constructor(private sceneElementsService: SceneElementsService) {
  }

  ngOnInit(): void {
  }

  start() {
  }

  unload(): void {
  }

  onPointBudgetChange(): void {
    if (this.viewer) {
      this.viewer.setPointBudget(this.pointBudget);
    }
  }

  changeBackground(): void {
    if (this.viewer) {
      this.viewer.changeBackground(this.backgroundColor);
    }
  }

  setBoundingBox(): void {
    this.showBoundingBox = !this.showBoundingBox;
    if (this.viewer) {
      this.viewer.setBoundingBox(this.showBoundingBox);
    }
  }


}
