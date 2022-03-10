export type UserInfoType = {
  name: string;
  bgColor: string;
};
export enum ConnectStatus {
  initial = "Checking",
  spare = "Connect",
  connected = "Connected",
  connecting = "Connecting",
  stoping = "Stoping",
}

export type ConnectionInfoType = {
  participants: (UserInfoType & { id: number | string; userMedia?: boolean })[];
  type: "";
  status: ConnectStatus;
  userMedia: boolean;
};

export enum VideoCallStatus {
  waiting,
  holding,
  connecting,
}

export type CallType = "voice" | "video";
