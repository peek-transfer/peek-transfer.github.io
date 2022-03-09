import dayjs from "dayjs";
import { DataConnection } from "peerjs";
import { ref } from "vue";
import useStoredRef from "../hooks/useStoredRef";
import getRandomName, { getRandomColor } from "../utils/random";
import { v4 as uuid } from "uuid";

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
  start = "Mstart",
  content = "MContent",
  end = "Mend",
}

export default function createMessageSystem() {
  const userInfo = useStoredRef("userInfo", {
    name: getRandomName(),
    bgColor: getRandomColor(),
  });
  const peerInfo = useStoredRef("peerInfo", { id: "", createTime: -1 });

  let conn: DataConnection;
  const use = (con: DataConnection) => {
    conn = con;
    onConnBinded();
  };

  const messageMap = new Map<string | number, MessageType>();
  const messageList = ref<MessageType[]>([]);
  const onConnBinded = () => {
    conn.on("data", (data: MessageType) => {
      if (!Object.values(MessageFlag).includes(data.type)) return;
      switch (data.type) {
        case MessageFlag.start:
          messageMap.set(data.id, data);
          messageList.value.push(data);
          break;
        case MessageFlag.content:
          const fullMessage = {
            ...messageMap.get(data.id),
            ...data,
            type: MessageFlag.end,
            recieveTime: dayjs().unix(),
            dataUrl:
              data.dataType !== "text"
                ? URL.createObjectURL(
                    new Blob([data.content!], { type: data.fileType! })
                  )
                : undefined,
          };
          messageMap.set(data.id, fullMessage);
          // messageList.value.push(messageMap.get(data.id)!);
          const index = messageList.value.findIndex((v) => v.id === data.id);
          messageList.value[index] = fullMessage;
          conn.send({
            id: data.id,
            type: MessageFlag.end,
            reciveTime: messageMap.get(data.id)?.recieveTime,
          });
          break;
        case MessageFlag.end:
          messageMap.set(data.id, {
            ...messageMap.get(data.id)!,
            recieveTime: data.recieveTime,
          });
          const i = messageList.value.findIndex((v) => v.id === data.id);
          messageList.value[i].recieveTime = data.recieveTime;
          break;
        default:
          break;
      }
    });
  };
  const sendData = (data: ContentType) => {
    const id = uuid();
    const headerInfo = {
      user: {
        name: userInfo.value.name,
        id: peerInfo.value.id,
        bgColor: userInfo.value.bgColor,
      },
      sendTime: dayjs().unix(),
      dataType: data.dataType,
      type: MessageFlag.start,
      id,
      fileType: data.fileType,
      fileName: data.fileName,
    };
    const contentInfo = {
      content: data.content,
      id,
      type: MessageFlag.content,
      fileType: data.fileType,
      fileName: data.fileName,
    };
    conn.send(headerInfo);
    conn.send(contentInfo);
    const record = {
      ...headerInfo,
      ...contentInfo,
      recieveTime: -1,
      dataUrl:
        data.dataType !== "text"
          ? URL.createObjectURL(
              new Blob([data.content!], { type: data.fileType! })
            )
          : undefined,
    };
    messageMap.set(id, record);
    messageList.value.push(record);
  };
  return { use, messageList, sendData };
}
