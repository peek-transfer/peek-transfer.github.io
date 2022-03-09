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
        { audio: false, video: type === "video" },
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
// export default function createStreamSystem() {
//   let peer: Peer;
//   let anotherStream: MediaStream;
//   let globalCall: MediaConnection;
//   let onCall = () => Promise.resolve(true);
//   let onStreamCallback = (s: MediaStream) => {};
//   let onCloseCallback = () => {};
//   const use = (p: Peer) => {
//     peer = p;
//     onConnBinded();
//   };
//   let eventTarget = new EventTarget();
//   const onConnBinded = () => {
//     peer.on("call", (call) => {
//       onCall().then(() => {
//         console.log("call accept");
//         onStreamCallback(anotherStream);
//       });
//       call.on("stream", (stream) => {
//         //   globalStream = stream;
//         anotherStream = stream;
//       });
//       call.on("close", function () {
//         console.log("finishded");
//         onCloseCallback();
//       });
//       const fn = () => {
//         call?.close();
//         eventTarget.removeEventListener("close", fn);
//       };
//       eventTarget.addEventListener("close", fn);
//     });
//   };

//   const call = (type: string, id: string) => {
//     return new Promise<MediaStream>((res, rej) => {
//       navigator.getUserMedia =
//         navigator.getUserMedia ||
//         navigator.webkitGetUserMedia ||
//         navigator.mozGetUserMedia;
//       navigator.getUserMedia(
//         { audio: true, video: type === "video" },
//         (s) => {
//           res(s);
//           globalCall = peer.call(id, s);
//         },
//         rej
//       );
//     });
//   };

//   const onBeCalled = (callback: typeof onCall) => {
//     onCall = callback;
//   };
//   const onStream = (callback: typeof onStreamCallback) => {
//     onStreamCallback = callback;
//   };
//   const onClose = (callback: typeof onCloseCallback) => {
//     onCloseCallback = callback;
//   };

//   const close = () => {
//     globalCall?.close();
//     eventTarget.dispatchEvent(new CustomEvent("close"));
//   };

//   return {
//     use,
//     call,
//     close,
//     onStream,
//     onClose,
//     onBeCalled,
//   };
// }
