import { Component, Input, OnInit } from '@angular/core';
import { CameraTrajectory } from "../../../elements/camera-trajectory";
import { SceneElement } from "../../pc-viewer/pc-viewer.interfaces";
import { SceneElementsEnum } from "../../../viewer/scene-elements.enum";

export interface CTSettings {
  size: number;
  color: string;
  meshVisible: boolean,
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

  settings: CTSettings = {
    size: 1,
    color: '#000000',
    meshVisible: false,
  }

  type: SceneElementsEnum = SceneElementsEnum.UNKNOWN;

  cameraTrajectories: CameraTrajectory[] | undefined;

  private _data: SceneElement[] | undefined;
  @Input() set data(sceneElements: SceneElement[]) {
    this._data = sceneElements;

    this.cameraTrajectories = [];
    this._data?.forEach((sceneElement) => {
      this.cameraTrajectories?.push(sceneElement.element as CameraTrajectory);
      this.type = sceneElement.sceneType;
    });

    //TODO override the default color
  }

  get data() {
    return this._data ? this._data : [];
  }

  constructor() {}

  ngOnInit(): void {
  }

  setColor() {
    this.cameraTrajectories?.forEach((trajectory) => {
      trajectory.setColor(this.settings.color);
    });
  }

  setFrustumSize() {
    this.cameraTrajectories?.forEach((trajectory) => {
      trajectory.setSize(this.settings.size);
    });
  }

  setMeshVisibility(): void {
    this.cameraTrajectories?.forEach((trajectory) => {
      trajectory.mesh.visible = this.settings.meshVisible;
    });
  }

}
