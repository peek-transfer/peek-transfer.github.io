import dayjs from "dayjs";
import Peer from "peerjs";
import useStoredRef from "../hooks/useStoredRef";
import { ConnectStatus } from "../utils/type";

export default function setPeer(sync: (p: Peer) => void) {
  const peerInfo = useStoredRef("peerInfo", { id: "", createTime: -1 });
  const connectStatus = useStoredRef("connectStatus", ConnectStatus.initial);
  const expireTime = Infinity;
  //  只在本地无peerid 或 本地peer已过期且不在通讯中时 创建新的peer
  if (
    peerInfo.value.id === "" ||
    (dayjs().unix() - peerInfo.value.createTime > expireTime &&
      connectStatus.value === ConnectStatus.spare)
  ) {
    peerInfo.value = { id: "", createTime: -1 };
    const p = new Peer();
    p.on("open", () => {
      // 更新本地存储的peerInfo
      peerInfo.value = {
        id: p.id,
        createTime: dayjs().unix(),
      };
      sync(p);
    });
  }
  const p = new Peer(peerInfo.value.id);
  p.on("open", () => {
    sync(p);
  });
}
