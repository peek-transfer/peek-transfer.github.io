export enum ConnectStatus {
  spare = "Connect",
  connected = "Connected",
  connecting = "Connecting",
  stoping = "Stoping",
}

export type ContentType = { content: string; type: "text" | "file" | "img" };
export type MessageType = {
  user: {
    name: string;
    id: string;
    color: string;
  };
  time: number;
} & ContentType;
