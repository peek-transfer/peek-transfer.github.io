<script setup lang="ts">
import { ref } from "vue";
import useStoredRef from "../hooks/useStoredRef";
import { MessageType } from "../utils/type";
import Avatar from "./Avatar.vue";
import dayjs from "dayjs";
import SendIcon from "../assets/icons/send.svg?component";

defineProps<{ messageList: MessageType[] }>();
const emits = defineEmits(["send"]);
const peerInfo = useStoredRef("peerInfo");

const textValue = ref("");
const sendText = () => {
  if (textValue.value !== "") {
    emits("send", { type: "text", content: textValue.value });
    textValue.value = "";
  }
};
</script>
<template>
  <div class="chat">
    <div class="list">
      <div
        v-for="(msg, index) in messageList"
        :key="index"
        class="message"
        :class="{ self: msg.user.id === peerInfo.id }"
      >
        <div class="avatar">
          <Avatar :name="msg.user.name" :bg-color="msg.user.bgColor"></Avatar>
        </div>
        <div class="bubble">
          <template v-if="msg.dataType === 'text'"> {{ msg.content }}</template>
          <template v-else-if="msg.dataType === 'image'">
            <img :src="msg.dataUrl" />
          </template>
          <template v-else-if="msg.dataType === 'file'">
            <a :href="msg.dataUrl" :download="msg.fileName">{{
              msg.fileName
            }}</a></template
          >
        </div>
        <div class="tag">
          {{ dayjs.unix(msg.sendTime).format("YYYY-MM-DD HH:MM:ss") }}
        </div>
      </div>
    </div>
    <div class="pannel">
      <input v-model="textValue" type="text" />
      <button @click="sendText()"><SendIcon></SendIcon></button>
      <!-- <button></button> -->
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../styles/utils.scss";
.chat {
  flex: 1;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  .list {
    width: 100%;
    margin: 10px;
    flex: 1;
    .message {
      padding: 5px 10px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: flex-start;
      &.self {
        flex-direction: row-reverse;
        .tag {
          text-align: right;
        }
      }
      .bubble {
        background-color: var(--primary-color-dark);
        padding: 5px;
        margin: 5px;
        border-radius: 4px;
        max-width: 70%;
        min-height: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          max-width: 100%;
        }
      }
      .tag {
        font-size: 12px;
        align-self: flex-end;
      }
    }
  }
  .pannel {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: var(--primary-color-light);
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    input {
      flex: 1;
      margin: 10px;
      padding: 0 10px;
      font-size: 16px;
      height: 38px;
      border: none;
      outline: none;
      background: white;
      border-radius: 18px;
    }
    button {
      width: 40px;
      height: 40px;
      margin: 5px;
      padding: 10px;
      border-radius: 30px;
      border: none;
      color: white;
      font-size: 16px;
      background-color: var(--secondary-color);
      @include buttoned();
      display: flex;
      justify-content: center;
      align-items: center;
      fill: white;
      svg {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
