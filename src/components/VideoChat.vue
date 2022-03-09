<script lang="ts" setup>
import { CallType, UserInfoType, VideoCallStatus } from "../utils/type";
import Avatar from "./Avatar.vue";
import PhoneIcon from "../assets/icons/phone.svg?component";
import {
  getCurrentInstance,
  onBeforeUnmount,
  Ref,
  ref,
  UnwrapRef,
  watch,
  watchEffect,
} from "vue";
import usePreventScroll from "../hooks/usePreventScroll";
import useForRefs from "../hooks/useForRefs";
const emit = defineEmits(["decline", "accept", "stop"]);
const props = defineProps<{
  status: VideoCallStatus;
  users: (UserInfoType & { id: any; stream?: MediaStream })[];
  type: CallType;
}>();

const instance = getCurrentInstance();
const { refs: videoRefs, setRefs: setVideoRefs } =
  useForRefs<HTMLVideoElement>();

watchEffect(() => {
  props.users.forEach((u, i) => {
    if (u.stream) {
      if (videoRefs.value?.[i]) {
        videoRefs.value[i].srcObject = u.stream;
        videoRefs.value[i].play();
      }
    }
  });
});

usePreventScroll();

defineExpose({ videoRefs });
</script>
<template>
  <div class="video-chat">
    <div
      class="frame"
      :class="{
        waiting: props.status === VideoCallStatus.waiting,
        connecting: props.status === VideoCallStatus.connecting,
        holding: props.status === VideoCallStatus.holding,
      }"
    >
      <div class="videos">
        <video
          v-for="(u, index) in users"
          :key="index"
          :ref="setVideoRefs"
          playsinline
        ></video>
      </div>
      <div v-if="props.status !== VideoCallStatus.connecting" class="avatars">
        <Avatar
          v-for="(user, i) in props.users"
          :name="user.name"
          :bg-color="user.bgColor"
          :editable="false"
          :key="i"
        ></Avatar>
      </div>
      <div v-if="props.status !== VideoCallStatus.connecting" class="info">
        {{
          props.status === VideoCallStatus.waiting
            ? "Waiting for accept..."
            : "You get a VideoCall Invitation"
        }}
      </div>

      <div class="buttons">
        <button
          v-if="props.status === VideoCallStatus.holding"
          class="accept"
          @click="emit('accept')"
        >
          <PhoneIcon></PhoneIcon>
        </button>
        <button
          class="decline"
          @click="
            emit(props.status === VideoCallStatus.holding ? 'decline' : 'stop')
          "
        >
          <PhoneIcon></PhoneIcon>
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../styles/utils.scss";
.video-chat {
  position: fixed;
  z-index: 10;
  width: 110vw;
  height: 110vh;
  top: -5vh;
  left: -5vw;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  .frame {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    width: 100%;
    height: 100%;
  }
  .avatars {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    top: 10%;
  }
  .info {
    position: absolute;
    top: 45%;
  }
  .buttons {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-around;
    width: 80vw;
    position: absolute;
    top: 75%;
    button {
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 50%;
      padding: 8px;
      fill: white;
      @include buttoned();
      &.decline {
        background-color: red;
        svg {
          transform: rotate(135deg);
        }
      }
      &.accept {
        background-color: green;
      }
    }
  }
  .videos {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
    height: 100%;
    video:nth-child(1) {
      position: absolute;
      top: calc(5vh + 20px);
      right: calc(5vw + 20px);
      width: 40vw;
    }
    video {
      width: calc(100% - 10vw - 20px);
    }
  }
}
</style>
