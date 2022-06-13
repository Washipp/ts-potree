import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsService } from "../../services/scene-elements.service";
import { Viewer } from "../../viewer/viewer";
import { SynchronizeService } from "../../services/synchronize.service";

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css', '../element-settings/element-settings.css']
})
export class GeneralSettingsComponent implements OnInit {

  pointBudgetOptions: any = {
    min: 100_000,
    max: 200_000_000,
    step: 25_000
  };
  fovOptions: any = {
    min: 45,
    max: 120,
    step: 5
  }

  pointBudget: number = 1000_000;
  fov: number = 60;
  viewer: Viewer | undefined;
  backgroundColor: string = '#000000';
  cameraSync: boolean = false;

  sceneId: number = -1;
  @Input() set data(value: any) {
    this.sceneId = value.sceneId;
    this.loadViewer(value.sceneId, 0);
    this.sceneId = value;
  }

  get data() {
    return this.sceneId
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

  constructor(private sceneElementsService: SceneElementsService, private service: SynchronizeService) {
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
    this.service.applyUpdate();
    if (this.viewer) {
      this.viewer.pickPointTest();
    }
  }

}
