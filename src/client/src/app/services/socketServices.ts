import { io } from "socket.io-client";
import { Observable, Subscriber } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class socketServices {
  socket: any;
  readonly url: string = "ws://localhost:3000";
  roomid: Number = -1;
  /* constructor() {
    this.socket = io(this.url);
  }*/

  set_room(id: Number) {
    this.roomid = id;
    console.log(this.roomid);
  }

  listen(eventname: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventname, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventname: string, data: any) {
    this.socket.emit(eventname, data);
  }
}
