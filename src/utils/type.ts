export type UserInfoType = {
  name: string;
  bgColor: string;
};
export enum ConnectStatus {
  spare = "Connect",
  connected = "Connected",
  connecting = "Connecting",
  stoping = "Stoping",
}

export type ConnectionInfoType = {
  participants: (UserInfoType & { id: number | string })[];
  type: "";
  status: ConnectStatus;
};

export enum VideoCallStatus {
  waiting,
  holding,
  connecting,
}

export type CallType = "voice" | "video";
