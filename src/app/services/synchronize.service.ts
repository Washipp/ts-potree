import { Injectable } from '@angular/core';
import { BaseServiceService } from "./base-service.service";
import { CameraState } from "../viewer/viewer";
import { Euler, Vector3 } from "three";

@Injectable({
  providedIn: 'root'
})
export class SynchronizeService extends BaseServiceService {

  ws = new WebSocket('ws://localhost:5001');

  state: CameraState = {
      position: new Vector3(38.25590670544343,  34.8853869591281, 31.929537717547742),
      rotation: new Euler(
         -0.8296086926953281,
         0.6801674658568955,
         0.6020464180012758,
         "XYZ"),
      fov: 60,
      near: 0.1,
      far: 10000,
      lastUpdate: 0
    }


  constructor() {
    super();
  }

  onMessage(): void {
    // console.log(this.socket.fromEvent('new_camera_state'));
  }

  onSend(sceneId: number, state?: CameraState): void {
    this.ws.send(JSON.stringify(state))
  }

}
