import { Component, OnDestroy, OnInit } from "@angular/core";
import { socketServices } from "@app/services/socketServices";
import { UserService } from "@app/services";
import { io } from "socket.io-client";

const mediaDevices = navigator.mediaDevices as any;
const MESSAGE_TYPE = {
  SDP: "SDP",
  CANDIDATE: "CANDIDATE",
};

@Component({
  templateUrl: "./videochat.component.html",
})

export class VideoChatComponent implements OnInit, OnDestroy {
  peerConnection: any;
  senders = [];
  userMediaStream: any;
  displayMediaStream: any;

  muteflag: Number = 0;
  novideoflag: Number = 0;

  video_flag: boolean = true;
  audio_flag: boolean = true;

  chat = []; //contains name and flag(me,him) and message content

  constructor(
    private socketService: socketServices,
    private userSerivce: UserService
  ) {}

  ngOnInit() {
    this.socketService.socket = io(this.socketService.url);

    this.startchat();
    this.socketService.listen("closeRTC").subscribe((data) => {
      this.peerConnection.close();
    });

    this.socketService.listen("recievechat").subscribe((data) => {
      this.chat.unshift(data);
    });

    //console.log(this.socketService.roomid);
  }

  ngOnDestroy(): void {
    this.socketService.emit("closeconnect", {
      roomid: this.socketService.roomid,
    });

    for(let track of this.userMediaStream.getTracks()) {
      track.stop();
    }

    this.peerConnection.close();
    this.peerConnection = null;
    this.socketService.socket.disconnect(true);
  }

  async startchat() {
    this.userMediaStream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    this.peerConnection = this.createPeerConnection();

    this.addMessageHandler();

    this.userMediaStream
    .getTracks()
    .forEach((track) =>
      this.senders.push(
        this.peerConnection.addTrack(track, this.userMediaStream)
      )
    );
    var a = document.getElementById("self-view") as HTMLVideoElement;
    a.srcObject = this.userMediaStream;
  }

  createPeerConnection() {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun1.l.google.com:19302" },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    pc.onnegotiationneeded = async () => {
      await this.CreateandSendOffer();
    };

    pc.onicecandidate = (iceEvent) => {
      if (iceEvent.candidate) {
        this.socketService.emit("message", {
          roomid: this.socketService.roomid,
          message_type: MESSAGE_TYPE.CANDIDATE,
          content: iceEvent.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const video = document.getElementById("remote-view") as HTMLVideoElement;
      video.srcObject = event.streams[0];
    };
    return pc;
  }

  async audio_change() {
    this.audio_flag = !this.audio_flag;
    this.changetest();
  }

  async video_change() {
    this.video_flag = !this.video_flag;
    this.changetest();
  }

  async changetest() {
    if (this.audio_flag == false && this.video_flag == false) {
      this.userMediaStream.getTracks().forEach((track) => {
        track.stop();
      });

      var a = document.getElementById("self-view") as HTMLVideoElement;

      return;
    }

    this.userMediaStream = await navigator.mediaDevices.getUserMedia({
      audio: this.audio_flag,
      video: this.video_flag,
    });

    this.userMediaStream
    .getTracks()
    .forEach((track) =>
      this.senders.push(
        this.peerConnection.addTrack(track, this.userMediaStream)
      )
    );

    var a = document.getElementById("self-view") as HTMLVideoElement;
    a.srcObject = this.userMediaStream;
  }

  async change_video_audio() {
    var senders = this.peerConnection.getSenders();
    senders.forEach((s) => {
      this.peerConnection.removeTrack(s);
    });

    // stop both video and audio
    this.userMediaStream.getTracks().forEach((track) => {
      track.stop();
    });

    this.userMediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: this.video_flag,
    });

    var senders = this.peerConnection.getSenders();
    senders.find((sender) => sender.track.kind === "video").replaceTrack(this.displayMediaStream.getVideoTracks()[0]);

    var a = document.getElementById("self-view") as HTMLVideoElement;
    a.srcObject = this.userMediaStream;
  }

  async sharescreen() {
    var senders = this.peerConnection.getSenders();

    senders.forEach((s) => {
      this.peerConnection.removeTrack(s);
    });

    // stop both video and audio
    this.userMediaStream.getTracks().forEach((track) => {
      track.stop();
    });

    this.userMediaStream = await mediaDevices.getDisplayMedia();

    this.userMediaStream
    .getTracks()
    .forEach((track) => this.senders.push(this.peerConnection.addTrack(track, this.userMediaStream)));
    var a = document.getElementById("self-view") as HTMLVideoElement;
    a.srcObject = this.userMediaStream;
  }

  send_message(msg: string) {
    if (msg === "") return;
    var msgsend = {
      name:
        this.userSerivce.getCurrentUserValue().firstname +
        " " +
        this.userSerivce.getCurrentUserValue().lastname,
      flag: this.userSerivce.getCurrentUserValue().firstname.charAt(0) + this.userSerivce.getCurrentUserValue().lastname.charAt(0),
      message: msg,
    };

    this.chat.unshift(msgsend);
    this.socketService.emit("sendchat", {
      name:
        this.userSerivce.getCurrentUserValue().firstname +
        " " +
        this.userSerivce.getCurrentUserValue().lastname,
      flag: this.userSerivce.getCurrentUserValue().firstname.charAt(0) + this.userSerivce.getCurrentUserValue().lastname.charAt(0),
      message: msg,
      roomid: this.socketService.roomid,
    });
  }

  async CreateandSendOffer() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socketService.emit("message", {
      roomid: this.socketService.roomid,
      message_type: MESSAGE_TYPE.SDP,
      content: offer,
      con_type: "offer",
    });
  }

  addMessageHandler() {
    this.socketService.listen("message2").subscribe(async (data) => {
      console.log(data);
      if (!data) {
        return;
      }

      try {
        if (data["message_type"] === MESSAGE_TYPE.CANDIDATE) {
          await this.peerConnection.addIceCandidate(data["content"]);
        } else if (data["message_type"] === MESSAGE_TYPE.SDP) {
          if (data["con_type"] === "offer") {
            //offer
            await this.peerConnection.setRemoteDescription(data["content"]);
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            this.socketService.emit("message", {
              roomid: this.socketService.roomid,
              message_type: MESSAGE_TYPE.SDP,
              content: answer,
              con_type: "answer",
            });
          } else if (data["con_type"] === "answer") {
            await this.peerConnection.setRemoteDescription(data["content"]);
          } else {
            console.log("Unsupported SDP type.");
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
}
