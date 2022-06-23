import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { map } from "rxjs/operators";
import { MinifiedCameraState } from "../viewer/viewer";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  static cameraSyncEvent = 'camera_sync'
  static startAnimationEvent = 'start_animation'

  constructor(private socket: Socket) { }

  /**
   * Send cameraState via websocket.
   *
   * @param sceneId id of the scene the camera belongs to.
   * @param cameraState New state.
   */
  sendCameraState(sceneId: number, cameraState: MinifiedCameraState): void {
    let data: any = {
      "sceneId": sceneId,
      "state": cameraState
    }
    this.sendMessage(WebSocketService.cameraSyncEvent, JSON.stringify(data));
  }

  startAnimation(sceneId: number, animationName: string): void {
    let data: any = {
      "sceneId": sceneId,
      "animationName": animationName
    }
    this.sendMessage(WebSocketService.startAnimationEvent, JSON.stringify(data));
  }

  /**
   * Send any data to the server via websocket
   *
   * @param eventName event name that is used in the request
   * @param data data to send.
   */
  sendMessage(eventName: string, data: string): void {
    this.socket.emit(eventName, data);
  }

  getMessage(eventName: string): Observable<MinifiedCameraState> {
    return this.socket.fromEvent(eventName).pipe(map((data: any) => data));
  }

  connect(): void {
    if (!this.isConnected()) {
      this.socket.connect();
      console.info("[WS]: Connected the socket.")
    } else {
      console.info("[WS]: Socket already connected")
    }
  }

  disconnect(): void {
    if (this.isConnected()) {
      this.socket.disconnect();
      console.info("[WS]: Disconnected the socket.")
    } else {
      console.info("[WS]: Socket already disconnected.")
    }
  }

  isConnected(): boolean {
    return this.socket.ioSocket.connected;
  }
}
