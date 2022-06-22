import { Component, Input, OnInit } from '@angular/core';
import { SceneElementsService } from "../../services/scene-elements.service";
import { Viewer } from "../../viewer/viewer";
import { SynchronizeService } from "../../services/synchronize.service";
import { Socket } from "ngx-socket-io";
import { WebSocketService } from "../../services/web-socket.service";

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
    this.loadViewer();
  }

  get data() {
    return this.sceneId
  }

  constructor(private socket: Socket,
              private ws: WebSocketService,
              private sceneElementsService: SceneElementsService, private service: SynchronizeService) {
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
    this.ws.sendMessage('start_animation', '0');
  }

  pickerTest(): void {
    this.service.applyUpdate();
    this.viewer?.pickPointTest();
  }

  private loadViewer() {
    this.sceneElementsService.getViewerData().subscribe(data => {
      if (data.has(this.sceneId)) {
        setTimeout(() => {
          this.viewer = data.get(this.sceneId)?.viewer;
        });
      }
    });
  }

}
