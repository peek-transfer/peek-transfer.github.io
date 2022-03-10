<script setup lang="ts">
import { computed, ref } from "vue";
import Avatar from "./components/Avatar.vue";
import useStoredRef from "./hooks/useStoredRef";
import { useFilePicker } from "./hooks/useFilePicker";

import { ConnectStatus } from "./utils/type";
import { parseIDFromString } from "./utils/parser";
import Chat from "./components/Chat.vue";
import { toResetAll } from "./utils/reset";
import FileIcon from "./assets/icons/file.svg?component";
import creatManager from "./connection/manager";
import getRandomName, { getRandomColor } from "./utils/random";
import { ContentType } from "./connection/message";
import VideoButton from "./components/VideoButton.vue";

const peerInfo = useStoredRef("peerInfo", { id: "", createTime: -1 });

const manager = creatManager();
const connectStatus = computed(
  () => manager.connectInfoSystem.connectionInfo.status
);

const toConnect = (id?: string) => {
  manager.toConnect(id);
};

const messageList = manager.messageSystem.messageList;

const sendData = (data: ContentType) => {
  manager.messageSystem.sendData({ ...data, dataType: "text" });
};
const sendFile = async () => {
  const files = await useFilePicker();
  const file = files.item(0)!;
  const type = file?.type.includes("image") ? "image" : "file";
  manager.messageSystem.sendData({
    dataType: type,
    content: new Blob(files as unknown as BlobPart[], { type: file?.type }),
    fileType: file.type,
    fileName: file.name,
  });
};

const userInfo = useStoredRef("userInfo", {
  name: getRandomName(),
  bgColor: getRandomColor(),
});
const connectionInfo = manager.connectInfoSystem.connectionInfo;

const inputId = ref("");

const showVideoButton = Boolean(
  navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
);
</script>

<template>
  <div class="header">
    <div class="avatars">
      <Avatar
        v-if="connectStatus !== ConnectStatus.connected"
        :name="userInfo.name"
        :bg-color="userInfo.bgColor"
        :editable="true"
        @change="
          (newName) => {
            userInfo = { ...userInfo, name: newName };
          }
        "
      ></Avatar>
      <template v-else>
        <Avatar
          v-for="(user, i) in connectionInfo.participants"
          :name="user.name"
          :bg-color="user.bgColor"
          :editable="false"
          :key="i"
        ></Avatar>
      </template>
    </div>
    <div class="tools">
      <button
        v-if="connectStatus !== ConnectStatus.connected"
        class="reset"
        @click="toResetAll()"
      >
        reset
      </button>
      <template v-else>
        <button class="file tool-button" @click="() => sendFile()">
          <FileIcon />
        </button>
        <VideoButton
          v-if="showVideoButton"
          :accept-system="manager.acceptSystem"
          :users="connectionInfo.participants"
          :stream-system="manager.streamSystem"
        ></VideoButton>
      </template>
    </div>
  </div>
  <div class="content">
    <Chat
      v-if="connectStatus === ConnectStatus.connected"
      :message-list="messageList"
      @send="sendData"
    ></Chat>
    <div v-else class="home">
      <div class="welcome">Hello,{{ userInfo.name }}</div>
      <div class="id-field">
        Your ID is <span class="id-text allow-select">{{ peerInfo.id }}</span>
      </div>
      <div class="id-editor">
        <input v-model="inputId" placeholder="input id here" type="text" />
      </div>
      <button
        class="connect-button"
        :disabled="
          peerInfo.id === null || connectStatus === ConnectStatus.stoping
        "
        :class="{
          loading: connectStatus === ConnectStatus.connecting,
        }"
        @click="toConnect(parseIDFromString(inputId))"
        @touchstart=""
      >
        {{ connectStatus }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "styles/utils.scss";

.header {
  position: sticky;
  top: 0;
  left: 0;
  width: calc(100% - 20px);
  padding: 10px;
  background-color: var(--primary-color-dark);
  @include shadowed();
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  .avatars {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    overflow-x: scroll;
  }
  .tools {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    .reset {
      margin: 5px;
      padding: 5px;
      border-radius: 30px;
      border: none;
      color: var(--primary-color-dark);
      font-size: 16px;
      background-color: white;
      @include buttoned();
    }
    .tool-button {
      width: 45px;
      height: 45px;
      padding: 10px;
      background: none;
      fill: white;
      border: none;
      @include buttoned();
    }
  }
}
.content {
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-start;
  background-color: var(--primary-color);
  .home {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-around;
    padding: 20px;
    .welcome {
      font-size: 32px;
      padding: 10px;
    }
    .id-field {
      padding: 20px;
      text-align: center;
    }
    .id-editor {
      width: 200px;
      height: 50px;
      border-radius: 60px;
      background-color: white;
      @include dynamic-shadowed();
      display: flex;
      align-items: center;
      justify-content: center;
      input {
        border: none;
        outline: none;
        background: none;
        width: 80%;
        height: 40px;
      }
      margin-bottom: 10px;
    }
    .connect-button {
      @include buttoned();
      border: none;
      width: 200px;
      height: 50px;
      border-radius: 60px;
      background-color: #ffa726;
      @include dynamic-shadowed();
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      &:disabled,
      &.disabled {
        background-color: gray;
      }
    }
  }
}
</style>
