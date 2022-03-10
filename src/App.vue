<script setup lang="ts">
import { computed, ref, watch } from "vue";
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
import CustomInput from "./components/CustomInput.vue";
import useHistoryUsers from "./hooks/useHistoryUsers";
import Avatar1 from "./components/Avatar.vue";

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

const showVideoButton = computed(() =>
  manager.connectInfoSystem.connectionInfo.participants.every(
    (p) => p.userMedia
  )
);

const inputId = ref("");
const {
  users: historyUsers,
  deleteUser: deleteHistoryUser,
  addUser: addHistoryUser,
} = useHistoryUsers();
const showFilterList = computed(() => historyUsers.length > 0);
watch(connectionInfo.participants, () => {
  connectionInfo.participants.forEach((p) => {
    if (p.id !== peerInfo.value.id) {
      addHistoryUser(p);
    }
  });
});
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
        <CustomInput
          v-model="inputId"
          placeholder="input id here"
          type="text"
          class="id-input"
          :show-filter-list="showFilterList"
          :filter-list="historyUsers"
        >
          <template #default="u">
            <div
              class="history-user"
              @click="
                () => {
                  inputId = u.id;
                }
              "
            >
              <div class="right">
                <Avatar :name="u.name" :bg-color="u.bgColor"></Avatar>
                <div class="full-name">{{ u.name }}</div>
              </div>
              <button
                class="remove-user"
                @click="
                  (e) => {
                    deleteHistoryUser(u.id);
                    e.stopPropagation();
                  }
                "
              ></button>
            </div>
          </template>
        </CustomInput>
      </div>
      <button
        class="connect-button"
        :disabled="
          peerInfo.id === null ||
          connectStatus === ConnectStatus.stoping ||
          connectStatus === ConnectStatus.initial
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
      width: 250px;
      height: 50px;
      border-radius: 60px;
      background-color: white;
      @include dynamic-shadowed();
      display: flex;
      align-items: center;
      justify-content: center;
      .id-input {
        width: 80%;
        height: 40px;
        display: flex;

        ::v-deep(.filter-list) {
          width: 250px;
          .history-user {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px 5px 5px;
            max-height: 200px;
            // border-bottom: 1px solid gray;
            // .avatar {
            //   transform: scale(0.8);
            // }
            .right {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
            }
            .full-name {
              color: black;
              text-overflow: ellipsis;
            }
            transition: all ease-in-out 0.2s;
            &:hover,
            &:active {
              background-color: #aaa5a5;
            }
            .remove-user {
              @include crossed();
              @include buttoned();
              width: 15px;
              height: 15px;
              border-radius: 50%;
              background-color: #aaa5a5;
            }
          }
        }
      }
      margin-bottom: 10px;
    }
    .connect-button {
      @include buttoned();
      border: none;
      width: 250px;
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
