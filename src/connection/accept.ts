import { DataConnection } from "peerjs";
import { v4 as uuid } from "uuid";

enum AcceptFlag {
  request = "Srequest",
  accept = "Saccept",
  decline = "Sdecline",
  stop = "Sstop",
}

export default function createAcceptSystem() {
  let conn: DataConnection;
  const use = (con: DataConnection) => {
    conn = con;
    onConnBinded();
  };
  let stopFlag = false;
  const target = new EventTarget();

  let onRequest: (content: string) => Promise<any> = () => Promise.reject();
  let onStopped: () => any;

  const onConnBinded = () => {
    conn.on("data", (data: { type: AcceptFlag; content: string }) => {
      if (!Object.values(AcceptFlag).includes(data.type)) return;
      switch (data.type) {
        case AcceptFlag.accept:
          target.dispatchEvent(new CustomEvent("accept"));
          break;
        case AcceptFlag.request: {
          onRequest(data.content)
            .then(() => {
              conn.send({ type: AcceptFlag.accept });
            })
            .catch(() => {
              conn.send({ type: AcceptFlag.decline });
            });

          break;
        }
        case AcceptFlag.decline:
          target.dispatchEvent(new CustomEvent("decline"));
          break;
        case AcceptFlag.stop:
          onStopped();
          target.dispatchEvent(new CustomEvent("decline"));
          break;
        default:
          break;
      }
    });
  };
  const requestAccept = async (content: string) => {
    const promise = new Promise((res, rej) => {
      conn.send({ type: AcceptFlag.request, content });
      stopFlag = false;
      target.addEventListener("accept", () => {
        if (stopFlag) rej();
        res(true);
      });
      target.addEventListener("decline", () => {
        rej();
      });
    });
    return await promise;
  };
  const onBeRequested = (callback: (content: string) => Promise<any>) => {
    onRequest = callback;
  };
  const onBeStopped = (callback: () => any) => {
    onStopped = callback;
  };
  const stop = () => {
    target.dispatchEvent(new CustomEvent("stop"));
    conn.send({ type: AcceptFlag.stop });
  };
  return { use, requestAccept, onBeRequested, onBeStopped, stop };
}
