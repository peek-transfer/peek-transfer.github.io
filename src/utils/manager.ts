import dayjs from "dayjs";
import Peer, { DataConnection } from "peerjs";
import { reactive, ref, UnwrapRef } from "vue";
import useStoredRef from "../hooks/useStoredRef";
import getRandomName, { getRandomColor } from "./random";
import {
  ConnectionInfoType,
  ConnectStatus,
  ContentType,
  MessageFlag,
  MessageType,
  UserInfoType,
} from "./type";
import { v4 as uuid } from "uuid";
import useMessage from "../hooks/useMessage";

type Listenertype = {
  ready: void;
  statusChange: ConnectStatus;
  messageListChange: MessageType[];
};

export const createManager = () => {
  const userInfo = useStoredRef("userInfo", {
    name: getRandomName(),
    bgColor: getRandomColor(),
  });
  const peerInfo = useStoredRef("peerInfo", { id: "", createTime: -1 });
  const connectStatus = useStoredRef("connectStatus", ConnectStatus.spare);
  if (connectStatus.value === ConnectStatus.connected)
    connectStatus.value = ConnectStatus.spare;

  let globalPeer: Peer | undefined = undefined;
  let globalConn: DataConnection;
  const connect = (id?: string) => {
    if (!globalPeer || !id) return;
    if (connectStatus.value !== ConnectStatus.spare) {
      connectStatus.value = ConnectStatus.stoping;
      globalPeer.on("disconnected", () => {
        getPeer(true)
          .then((p) => {
            globalPeer = p;
            connectStatus.value = ConnectStatus.spare;
          })
          .catch(dealError);
      });
      globalPeer.disconnect();
      return;
    }
    const conn = globalPeer.connect(id);
    connectStatus.value = ConnectStatus.connecting;
    conn.on("open", () => {
      connectStatus.value = ConnectStatus.connected;
      dealConnection(conn);
      conn.send({
        type: MessageFlag.hand,
        user: { ...userInfo.value, id: peerInfo.value.id },
      });
    });
    conn.on("error", (err) => {
      console.log(err);
    });
  };
  const disconnect = () => {};
  const dealError = (err: any) => {
    useMessage(err, { type: "error" });
  };
  const on = <T extends keyof Listenertype>(
    name: T,
    callback: (v: Listenertype[T]) => void
  ) => {};

  const getPeer = (forceNew = false) => {
    return new Promise<Peer>((res, rej) => {
      const expireTime = 60;
      //  只在本地无peerid 或 本地peer已过期且不在通讯中时 创建新的peer
      if (
        !forceNew &&
        (peerInfo.value.id === "" ||
          (dayjs().unix() - peerInfo.value.createTime > expireTime &&
            connectStatus.value === ConnectStatus.spare))
      ) {
        peerInfo.value = { id: "", createTime: -1 };
        const p = new Peer();
        p.on("open", () => {
          // 更新本地存储的peerInfo
          peerInfo.value = {
            id: p.id,
            createTime: dayjs().unix(),
          };
          res(p);
        });
        p.on("error", rej);
      }
      const p = new Peer(peerInfo.value.id);
      p.on("open", () => {
        res(p);
      });
      p.on("error", rej);
    });
  };

  const connectionInfo = reactive<UnwrapRef<ConnectionInfoType>>({
    participants: [{ ...userInfo.value, id: peerInfo.value.id }],
    type: "",
  });
  const messageMap = new Map<string | number, MessageType>();
  const messageList = ref<MessageType[]>([]);
  const dealConnection = (conn: DataConnection) => {
    globalConn = conn;

    conn.on("data", (data: MessageType) => {
      switch (data.type) {
        case MessageFlag.hand:
          connectStatus.value = ConnectStatus.connected;
          if (connectionInfo.participants.every((p) => p.id !== data.user.id)) {
            connectionInfo.participants.push(data.user);
            conn.send({
              type: MessageFlag.hand,
              user: { ...userInfo.value, id: peerInfo.value.id },
            });
          }

          break;
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
    globalConn.send(headerInfo);
    globalConn.send(contentInfo);
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

  getPeer()
    .then((peer) => {
      globalPeer = peer;
      // 若尚未连接，检查url中的targetId是否存在
      if (connectStatus.value === ConnectStatus.spare) {
        // 若targetId不存在，将本地id放置在url中，便于直接分享url连接
        // if (!targetId.value) {
        //   targetId.value = peerInfo.value.id;
        // }
        // // 若targetId存在且与本地id不同，尝试连接
        // else if (targetId.value !== peerInfo.value.id) {
        //   toConnect(targetId.value);
        // }
      }
      globalPeer.on("connection", (conn) => {
        dealConnection(conn);
      });
    })
    .catch(dealError);
  return {
    disconnect,
    connect,
    sendData,
    on,
    connectStatus,
    messageList,
    userInfo,
    connectionInfo,
  };
};
