import Peer, { DataConnection } from "peerjs";
import useMessage from "../hooks/useMessage";
import { ConnectStatus } from "../utils/type";
import createAcceptSystem from "./accept";
import createConnectInfoSystem from "./connect-info";
import createMessageSystem from "./message";
import setPeer from "./set-peer";
import createStreamSystem from "./stream";

export default function creatManager() {
  let globalPeer: Peer;
  const updatePeer = () =>
    setPeer((p) => {
      globalPeer = p;
      connectInfoSystem.connectionInfo.status = ConnectStatus.spare;
      p.on("connection", (conn) => {
        dealConnect(conn);
      });
      p.on("error", dealError);
    });
  updatePeer();

  let globalConn: DataConnection;
  const toConnect = (id?: string) => {
    if (!globalPeer || !id) return;
    if (connectInfoSystem.connectionInfo.status === ConnectStatus.connecting) {
      connectInfoSystem.connectionInfo.status = ConnectStatus.stoping;
      globalPeer.on("disconnected", () => {
        updatePeer();
        connectInfoSystem.connectionInfo.status = ConnectStatus.spare;
      });
      globalPeer.disconnect();
      return;
    }
    connectInfoSystem.connectionInfo.status = ConnectStatus.connecting;
    globalPeer.on("error", dealError);
    const conn = globalPeer.connect(id);
    dealConnect(conn);
  };

  const dealConnect = (conn: DataConnection) => {
    globalConn = conn;
    streamSystem.use(globalPeer);
    globalConn.on("open", () => {
      connectInfoSystem.use(globalConn);
      messageSystem.use(globalConn);
      acceptSystem.use(globalConn);
    });
    globalConn.on("error", dealError);
  };

  const messageSystem = createMessageSystem();
  const connectInfoSystem = createConnectInfoSystem();
  const acceptSystem = createAcceptSystem();
  const streamSystem = createStreamSystem();

  const dealError = (err: any) => {
    connectInfoSystem.connectionInfo.status = ConnectStatus.spare;
    useMessage(err, { type: "error" });
  };

  return {
    toConnect,
    messageSystem,
    connectInfoSystem,
    acceptSystem,
    streamSystem,
  };
}
