import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { map } from "rxjs/operators";
import { CameraState } from "../viewer/viewer";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(private socket: Socket) { }

  /**
   * Send cameraState via websocket.
   *
   * @param sceneId id of the scene the camera belongs to.
   * @param cameraState New state.
   */
  sendCameraState(sceneId: number, cameraState: CameraState): void {
    let data: any = {
      "sceneId": sceneId,
      "state": cameraState
    }
    this.sendMessage(JSON.stringify(data));
  }

  /**
   * Send any data to the server via websocket
   *
   * @param data data to send.
   */
  sendMessage(data: string): void {
    this.socket.emit('json', data);
  }

  getMessage(): Observable<CameraState> {
    return this.socket.fromEvent('json').pipe(map((data: any) => data));
  }

  connect(): void {
    this.socket.connect();
    console.log("Connected the socket.")
  }

  disconnect(): void {
    this.socket.disconnect();
    console.log("Disconnected the socket.")
  }
}
