import { Injectable } from '@angular/core';
import { BaseServiceService } from "./base-service.service";

@Injectable({
  providedIn: 'root'
})
export class SynchronizeService extends BaseServiceService {

  socket = new WebSocket(this.baseUrl + '/camera_state');

  constructor() {
    super();
    // this.socket.subscribe(
    //   msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
    //   err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
    //   () => console.log('complete') // Called when connection is closed (for whatever reason).
    // );

    this.socket.onopen = (event) => {
      console.log("[WS]Opened connection");
      console.log(event);
    };
    this.socket.onerror = (error) => {
      console.log("[WS]Error occurred");
      console.log(error);
    }
    this.socket.onmessage = (ev) => {
      console.log("[WS]Message received");
      console.log(ev)
    };
  }
}
