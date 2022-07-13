import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { map } from "rxjs/operators";
import { CameraState } from "../viewer/viewer";
import { Observable } from "rxjs";

export interface AnimationData {
  cameraState: CameraState,
  screenshot: boolean,
  screenshotDirectory: string
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  static cameraSyncEvent = 'camera_sync'
  static startAnimationEvent = 'start_animation'
  static getAnimationEvent = 'animation'

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
    this.sendMessage(WebSocketService.cameraSyncEvent, JSON.stringify(data));
  }

  startAnimation(sceneId: number, animationName: string, running: boolean): void {
    let data: any = {
      "sceneId": sceneId,
      "animationName": animationName,
      "running": running
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

  /**
   * Get an observable that updates with the newly received data.
   * The Type defines the expected return type.
   *
   * @param eventName Name of the event to listen form.
   */
  getMessage<Type>(eventName: string): Observable<Type> {
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
