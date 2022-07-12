import { Component, Input, OnInit } from '@angular/core';
import { ComponentTreeData, SceneElementsService } from "../../services/scene-elements.service";
import { Viewer } from "../../viewer/viewer";
import { WebSocketService } from "../../services/web-socket.service";
import { Clipboard } from "@angular/cdk/clipboard";
import { HelperFunctions } from "../utility/helper-functions";
import { HttpClient } from "@angular/common/http";

export interface GeneralSettingsData extends ComponentTreeData {
  sceneId: number
}

@Component({
  selector: 'app-scene-settings',
  templateUrl: './scene-settings.component.html',
  styleUrls: ['./scene-settings.component.css', '../element-setting/element-setting.component.css']
})
export class SceneSettingsComponent implements OnInit {

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

  hidden = false;

  pointBudget: number = 1000_000;
  fov: number = 60;
  viewer: Viewer | undefined;
  backgroundColor: string = '#FFFFFF';
  cameraSync: boolean = false;

  private _data: GeneralSettingsData = {sceneId: -1};
  @Input() set data(value: GeneralSettingsData) {
    this._data = value
    this.loadViewer();
  }

  get data(): GeneralSettingsData {
    return this._data;
  }

  constructor(private ws: WebSocketService,
              private sceneElementsService: SceneElementsService,
              private clipboard: Clipboard,
              private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  onPointBudgetChange(): void {
    this.viewer?.setPointBudget(this.pointBudget);
    this.viewer?.requestRender();
  }

  changeBackground(): void {
    this.viewer?.changeBackground(this.backgroundColor);
    this.viewer?.requestRender();
  }

  onFovChange(): void {
    this.viewer?.setCameraFOV(this.fov);
    this.viewer?.requestRender();
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

  onShareCameraState(): void {
    if (this.viewer) {
      let params = HelperFunctions.cameraStateToUrlParams(this.viewer.getCurrentCameraState(this.viewer.camera));
      this.clipboard.copy(this.sceneElementsService.baseUrl+params);
    }
  }

  onCreateScreenshot(): void {
    if (this.viewer) {
      this.viewer.renderOnce();
      this.viewer.getRenderer().domElement.toBlob(blob => {
        if (blob) {
          let formData = new FormData();
          formData.append('file', new Blob([blob], {'type':'image/png'}));

          this.http.post<Blob>(this.sceneElementsService.baseUrl+'upload/dir', formData)
            .subscribe((response) => {
              console.log("Got response")
              console.log(response)
            });
        }
      }, 'image/png', 1.0);

    }
  }

  pickerTest(): void {
    this.viewer?.pickPointTest();
  }

  private loadViewer() {
    this.sceneElementsService.getViewerData().subscribe(data => {
      if (data.has(this.data.sceneId)) {
        setTimeout(() => {
          this.viewer = data.get(this.data.sceneId)?.viewer;
          // after loading the reference to the viewer we can overwrite the default background color.
          this.changeBackground();
        });
      }
    });
  }

}
