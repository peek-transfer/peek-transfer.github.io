import { createVNode, ref, render } from "vue";
import VideoChat from "../components/VideoChat.vue";
import { CallType, UserInfoType, VideoCallStatus } from "../utils/type";

type Option = {
  type: CallType;
  users: (UserInfoType & { id: any })[];
};

export default function useVideoChat(type: CallType = "video") {
  const container = document.createElement("div");
  const close = () => {
    render(null, container);
    if (container.parentNode === document.body)
      document.body.removeChild(container);
  };
  const eventTarget = new EventTarget();
  const config = ref({
    status: VideoCallStatus.waiting,
    users: [] as UserInfoType[],
    type,
    eventTarget,
  });
  const vnode = createVNode(VideoChat, {
    visible: false,
    onFullDestroyed: close,
    status: VideoCallStatus.waiting,
    users: [],
    type,
    config,
  });

  if (vnode.props)
    vnode.props.onVnodeUnmounted = () => {
      document.body.removeChild(container);
    };

  render(vnode, container);
  const show = (st = VideoCallStatus.connecting, option: Option) => {
    if (container.parentElement !== document.body)
      document.body.appendChild(container);
    config.value.status = st;
    config.value.users = option.users;
    if (st === VideoCallStatus.connecting) {
      return new Promise((res) => {
        eventTarget.addEventListener("stop", () => {
          res(true);
        });
      });
    }
    if (st === VideoCallStatus.holding) {
      return new Promise((res, rej) => {
        eventTarget.addEventListener("accept", () => {
          res(true);
        });
        eventTarget.addEventListener("decline", () => {
          rej();
        });
      });
    }
    return new Promise((res, rej) => {
      eventTarget.addEventListener("accept", () => {
        res(true);
      });
      eventTarget.addEventListener("stop", () => {
        rej();
        throw new Error("click stop");
      });
    });
  };
  return {
    show,
    close,
  };
}
