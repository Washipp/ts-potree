import { Component, Input, OnInit } from '@angular/core';
import { ComponentTreeData, SceneElementsService } from "../../services/scene-elements.service";
import { CameraState, Viewer } from "../../viewer/viewer";
import { Socket } from "ngx-socket-io";
import { WebSocketService } from "../../services/web-socket.service";

export interface GeneralSettingsData extends ComponentTreeData {
  sceneId: number
}

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

  private _data: GeneralSettingsData = {sceneId: -1};
  @Input() set data(value: GeneralSettingsData) {
    this._data = value
    this.loadViewer();
  }

  get data(): GeneralSettingsData {
    return this._data;
  }

  constructor(private socket: Socket,
              private ws: WebSocketService,
              private sceneElementsService: SceneElementsService) {
  }

  ngOnInit(): void {
  }

  onPointBudgetChange(): void {
    this.viewer?.setPointBudget(this.pointBudget);
  }

  changeBackground(): void {
    this.viewer?.changeBackground(this.backgroundColor);
  }

  onFovChange(): void {
    this.viewer?.setCameraFOV(this.fov);
  }

  onCameraSync(): void {
    this.cameraSync = !this.cameraSync;
    this.viewer?.setCameraSync(this.cameraSync);
  }

  onStartAnimation(): void {
    if (!this.cameraSync) {
      this.onCameraSync();
    }
    this.ws.startAnimation(this.data.sceneId, "animation_1");
  }

  pickerTest(): void {
    this.viewer?.pickPointTest();
  }

  extractRandT(cameraState: CameraState): [number[], number[]] {
    return [
      [this.round(cameraState.position.x), this.round(cameraState.position.y), this.round(cameraState.position.z)],
      [this.round(cameraState.rotation.x), this.round(cameraState.rotation.y), this.round(cameraState.rotation.z), this.round(cameraState.rotation.w)]
    ];
  }

  private round(num: number): number {
    let digits = 6
    let rounding = Math.pow(10, digits)
    return ((Math.round(num * rounding) / rounding).toFixed(digits) as unknown) as number;
  }

  private loadViewer() {
    this.sceneElementsService.getViewerData().subscribe(data => {
      if (data.has(this.data.sceneId)) {
        setTimeout(() => {
          this.viewer = data.get(this.data.sceneId)?.viewer;
        });
      }
    });
  }

}
