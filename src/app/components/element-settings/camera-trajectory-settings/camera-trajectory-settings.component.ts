import { Component, Input, OnInit } from '@angular/core';
import { CameraTrajectory } from "../../../elements/camera-trajectory";
import { SceneElementsService } from "../../../services/scene-elements.service";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";

export interface CTSettings {
  size: number;
  color: string;
}

@Component({
  selector: 'app-camera-trajectory-settings',
  templateUrl: './camera-trajectory-settings.component.html',
  styleUrls: ['./camera-trajectory-settings.component.css', '../element-settings.css']
})
export class CameraTrajectorySettingsComponent implements OnInit {

  options: any = {
    min: 1,
    max: 20
  };

  cameraTrajectory: CameraTrajectory | undefined;
  settings: CTSettings;

  private _data: any | undefined;
  @Input() set data(value: any) {
    this.cameraTrajectory = undefined;
    this.getCameraTrajectory(value.sceneId, value.elementId, 0);
    this._data = value;
  }

  get data() {
    return this._data
  }

  constructor(private sceneElementsService: SceneElementsService) {
    this.settings = {
      size: 1,
      color: '#000000',
    }
  }

  private getCameraTrajectory(sceneId: number, elementId: number, numberOfTries: number) {
    let promise = new Promise(resolve => setTimeout(resolve, 250));
    promise.then(() => {
        this.cameraTrajectory = this.sceneElementsService.getSceneElement(sceneId, elementId) as CameraTrajectory;
        if (this.cameraTrajectory === undefined && numberOfTries < this.sceneElementsService.maxTries) {
          // To copy the value and not the reference
          // TODO: maybe use a better solution
          let a: any = {numberOfTries};
          a.numberOfTries++;
          this.getCameraTrajectory(sceneId, elementId, a);
        }
      }
    );
  }

  ngOnInit(): void {
  }

  setColor() {
    this.cameraTrajectory?.lines.forEach(line => {
      let mat = line.material as LineMaterial;
      mat.color.set(this.settings.color);
    });
  }

  setFrustumSize() {
    this.cameraTrajectory?.setSize(this.settings.size);
  }

}
