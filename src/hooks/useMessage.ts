import { createVNode, render } from "vue";
import Message from "../components/Message.vue";

let containers: { id: number; container: HTMLElement; vnode: any }[] = [];

export default function useMessage(
  text: string,
  option?: {
    delay?: number;
    type?: "success" | "warn" | "error";
  }
) {
  const close = () => {
    render(null, container);
    if (container.parentNode === document.body)
      document.body.removeChild(container);
  };
  const vnode = createVNode(Message, {
    visible: false,
    text,
    onFullDestroyed: close,
    ...option,
  });
  const container = document.createElement("div");
  if (vnode.props)
    vnode.props.onVnodeUnmounted = () => {
      document.body.removeChild(container);
    };

  render(vnode, container);
  document.body.appendChild(container);
}
