import { DataConnection } from "peerjs";
import { reactive, UnwrapRef } from "vue";
import useStoredRef from "../hooks/useStoredRef";
import getRandomName, { getRandomColor } from "../utils/random";
import { ConnectionInfoType, ConnectStatus } from "../utils/type";

enum HandFlag {
  hand = "handflag",
}

export default function createConnectInfoSystem() {
  const userInfo = useStoredRef("userInfo", {
    name: getRandomName(),
    bgColor: getRandomColor(),
  });
  const peerInfo = useStoredRef("peerInfo", { id: "", createTime: -1 });
  const connectionInfo = reactive<UnwrapRef<ConnectionInfoType>>({
    participants: [{ ...userInfo.value, id: peerInfo.value.id }],
    type: "",
    status: ConnectStatus.spare,
  });

  let conn: DataConnection;
  const use = (con: DataConnection) => {
    conn = con;
    onConnBinded();
    connectionInfo.participants[0].id = peerInfo.value.id;
  };
  const onConnBinded = () => {
    connectionInfo.status = ConnectStatus.connecting;
    connectionInfo.status = ConnectStatus.connected;

    conn.on("data", (data) => {
      if (!Object.values(HandFlag).includes(data.type)) return;
      connectionInfo.status = ConnectStatus.connected;
      if (connectionInfo.participants.every((p) => p.id !== data.user.id)) {
        connectionInfo.participants.push(data.user);
        conn.send({
          type: HandFlag.hand,
          user: { ...userInfo.value, id: peerInfo.value.id },
        });
      }
    });
    conn.send({
      type: HandFlag.hand,
      user: { ...userInfo.value, id: peerInfo.value.id },
    });
    // });
  };
  return { use, connectionInfo };
}
