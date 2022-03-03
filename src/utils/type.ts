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

export type ContentType = {
  content?: string | Blob;
  dataType: "text" | "file" | "image";
  fileType?: string;
  fileName?: string;
};
export type MessageType = {
  user: {
    name: string;
    id: string;
    bgColor: string;
  };
  sendTime: number;
  recieveTime: number;
  type: MessageFlag;
  id: string | number;
  dataUrl?: string;
  fileType?: string;
} & ContentType;
export enum MessageFlag {
  hand,
  start,
  content,
  end,
}

export type ConnectionInfoType = {
  participants: (UserInfoType & { id: number | string })[];
  type: "";
};
