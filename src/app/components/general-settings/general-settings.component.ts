import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsService } from "../../services/scene-elements.service";
import { Viewer } from "../../viewer/viewer";

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css', '../element-settings/element-settings.css']
})
export class GeneralSettingsComponent implements OnInit {

  pointBudgetOptions: any = {
    min: 100_000,
    max: 20_000_000,
    step: 10_000
  };
  fovOptions: any = {
    min: 45,
    max: 120,
    step: 5
  }

  pointBudget: number = 1000_000;
  fov: number = 60;
  sceneId: number = -1;
  viewer: Viewer | undefined;
  backgroundColor: string = '#000000';
  cameraSync: boolean = false;

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
        } else {
          this.fov = this.viewer ? this.viewer.camera.fov : this.fov;
        }
    });
  }

  constructor(private sceneElementsService: SceneElementsService) {
  }

  ngOnInit(): void {
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

  onFovChange(): void {
    if (this.viewer) {
      this.viewer.setCameraFOV(this.fov);
    }
  }

  onCameraSync(): void {
    if (this.viewer) {
      this.cameraSync = !this.cameraSync;
      this.viewer.setCameraSync(this.cameraSync);
    }
  }

  pickerTest(): void {
    if (this.viewer) {
      this.viewer.pickPointTest();
    }
  }

}
