import Peer from "peerjs";
import getRandomName, { getRandomColor } from "./random";

type ManagerConfig = {
  lastPeerId: string;
  urlPeerId: string;
  userInfo: { name: string; bgColor: string };
};
export default class Manager {
  config: ManagerConfig;
  peer: Peer;
  constructor(config: Partial<ManagerConfig>) {
    this.config = {
      lastPeerId: "",
      urlPeerId: "",
      userInfo: { name: getRandomName(), bgColor: getRandomColor() },
      ...config,
    };
    if (this.config.lastPeerId === "") {
      // create new Peer
      this.peer = new Peer();
    } else {
      // create Peer with last peerid
      this.peer = new Peer(this.config.lastPeerId);
    }
    this.peer.on("open", () => {
      this.config.lastPeerId = this.peer.id;
      if (this) this.config.urlPeerId = this.peer.id;
    });
  }
}
