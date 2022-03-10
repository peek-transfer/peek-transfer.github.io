import Peer, { DataConnection, MediaConnection } from "peerjs";

export default function createStreamSystem() {
  let peer: Peer;
  let globalCall: MediaConnection;
  let globMediaStream: MediaStream;
  const use = (p: Peer) => {
    peer = p;
    onConnBinded();
  };
  let onStreaCallBack = (s: MediaStream) => {};
  let eventTarget = new EventTarget();
  let isCalled = false;
  const onConnBinded = () => {
    peer.on("call", (call) => {
      call.answer();
      call.on("stream", (stream) => {
        onStreaCallBack(stream);
        eventTarget.addEventListener("close", () => {
          stream?.stop?.();
        });
      });
      call.on("close", function () {});
    });
  };

  const sendcall = (type: string, id: string) => {
    return new Promise<MediaStream>((res, rej) => {
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      navigator.getUserMedia(
        { audio: import.meta.env.DEV ? false : true, video: type === "video" },
        (s) => {
          globMediaStream = s;
          res(s);
          isCalled = true;
          globalCall = peer.call(id, s, {
            metadata: { type, selfId: peer.id },
          });
        },
        rej
      );
    });
  };
  eventTarget.addEventListener("close", () => {
    if (!globMediaStream) return;
    globMediaStream.stop?.();
    globMediaStream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  });

  const close = () => {
    globalCall?.close();
    eventTarget.dispatchEvent(new CustomEvent("close"));
  };

  const onStream = (callback: typeof onStreaCallBack) => {
    onStreaCallBack = callback;
  };

  return {
    use,
    call: sendcall,
    close,
    onStream,
  };
}
