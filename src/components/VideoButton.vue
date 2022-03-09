<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import createAcceptSystem from "../connection/accept";
import { VideoCallStatus, UserInfoType } from "../utils/type";
import VideoIcon from "../assets/icons/videocamera.svg?component";
import Picker from "./Picker.vue";
import VideoChat from "./VideoChat.vue";
import createStreamSystem from "../connection/stream";
import useStoredRef from "../hooks/useStoredRef";

const props = defineProps<{
  acceptSystem: ReturnType<typeof createAcceptSystem>;
  users: (UserInfoType & { id: any })[];
  streamSystem: ReturnType<typeof createStreamSystem>;
}>();
const showedUsers = ref<(UserInfoType & { id: any; stream?: MediaStream })[]>(
  props.users
);
const peerInfo = useStoredRef("peerInfo", { id: "", createTime: -1 });
const showVideoChat = ref(false);
const videoStatus = ref(VideoCallStatus.waiting);
const typeList = ["video", "voice"] as const;
type TypeList = typeof typeList[number];
const type = ref<TypeList>("video");

const cleanStream = () => {
  showedUsers.value.forEach((u) => {
    u.stream = undefined;
  });
};

const eventTarget = new EventTarget();

const call = async (t: TypeList) => {
  const index = showedUsers.value.findIndex((u) => u.id !== peerInfo.value.id);
  const localStream = await props.streamSystem.call(
    t,
    showedUsers.value[index].id
  );
  showedUsers.value[0].stream = localStream;
};

const onAccept = () => {
  eventTarget.dispatchEvent(new CustomEvent("accept"));
  videoStatus.value = VideoCallStatus.connecting;
  //   props.streamSystem.backcall();
  call(type.value);
};
const onDecline = () => {
  eventTarget.dispatchEvent(new CustomEvent("decline"));
  showVideoChat.value = false;
  props.streamSystem.close();
  cleanStream();
};
const onStop = () => {
  eventTarget.dispatchEvent(new CustomEvent("stop"));
  showVideoChat.value = false;
  props.acceptSystem.stop();
  props.streamSystem.close();
  cleanStream();
};

const onChoose = async (t: TypeList) => {
  type.value = t;
  showVideoChat.value = true;
  videoStatus.value = VideoCallStatus.waiting;
  try {
    await props.acceptSystem.requestAccept(t);
    videoStatus.value = VideoCallStatus.connecting;
    await call(t);
  } catch {
    showVideoChat.value = false;
  }
};

props.acceptSystem.onBeStopped(() => {
  showVideoChat.value = false;
  eventTarget.dispatchEvent(new CustomEvent("stop"));
  props.streamSystem.close();
  cleanStream();
});

props.acceptSystem.onBeRequested(
  (t) =>
    new Promise((res, rej) => {
      type.value = t as any;
      showVideoChat.value = true;
      videoStatus.value = VideoCallStatus.holding;
      const onAccept = () => {
        videoStatus.value = VideoCallStatus.connecting;
        res(true);
      };
      const onDecline = () => {
        showVideoChat.value = false;
        rej();
      };
      const onStop = () => {
        showVideoChat.value = false;
        rej();
        eventTarget.removeEventListener("accept", onAccept);
        eventTarget.removeEventListener("decline", onDecline);
        eventTarget.removeEventListener("stop", onStop);
      };
      eventTarget.addEventListener("accept", onAccept);
      eventTarget.addEventListener("decline", onDecline);
      eventTarget.addEventListener("stop", onStop);
    })
);

props.streamSystem.onStream((s) => {
  const index = showedUsers.value.findIndex((u) => u.id !== peerInfo.value.id);
  if (index !== -1) {
    showedUsers.value[index].stream = s;
  }
});
</script>
<template>
  <Picker :list="['video', 'voice']" @choose="onChoose">
    <button class="video tool-button">
      <VideoIcon />
    </button>
  </Picker>
  <teleport to="body">
    <transition>
      <VideoChat
        v-if="showVideoChat"
        :type="type"
        :status="videoStatus"
        :users="showedUsers"
        @accept="onAccept"
        @decline="onDecline"
        @stop="onStop"
      ></VideoChat>
    </transition>
  </teleport>
</template>
<style lang="scss" scoped>
@import "../styles/utils.scss";
.tool-button {
  width: 45px;
  height: 45px;
  padding: 10px;
  background: none;
  fill: white;
  border: none;
  @include buttoned();
}
</style>
