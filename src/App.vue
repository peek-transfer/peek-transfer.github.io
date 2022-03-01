<script setup lang="ts">
import { ref, watchEffect } from "vue";
import Avatar from "./components/Avatar.vue";
import getRandomName, { getRandomColor } from "./utils/random";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import useStoredRef from "./hooks/useStoredRef";
import dayjs from "dayjs";
import { ConnectStatus, ContentType, MessageType } from "./utils/type";
import { parseIDFromString } from "./utils/parser";
import Chat from "./components/Chat.vue";

const initialUser = useStoredRef("userInfo", {
  name: getRandomName(),
  color: getRandomColor(),
});

const peerInfo = useStoredRef("peerInfo", { id: "", createTime: -1 });
const connectStatus = useStoredRef("connectStatus", ConnectStatus.spare);
if ((connectStatus.value = ConnectStatus.stoping))
  connectStatus.value = ConnectStatus.spare;

// const targetId = useLocationSearch("targetId");

const getPeer = (forceNew = false) =>
  new Promise<Peer>((res, rej) => {
    const expireTime = 60;
    //  只在本地无peerid 或 本地peer已过期且不在通讯中时 创建新的peer
    if (
      !forceNew &&
      (peerInfo.value.id === "" ||
        (dayjs().unix() - peerInfo.value.createTime > expireTime &&
          connectStatus.value === ConnectStatus.spare))
    ) {
      peerInfo.value = { id: "", createTime: -1 };
      const p = new Peer();
      p.on("open", () => {
        // 更新url中的targetId防止与旧ID连接
        // targetId.value = p.id;
        // 更新本地存储的peerInfo
        peerInfo.value = {
          id: p.id,
          createTime: dayjs().unix(),
        };
        res(p);
      });
      p.on("error", rej);
    }
    const p = new Peer(peerInfo.value.id);
    p.on("open", () => {
      res(p);
    });
    p.on("error", rej);
  });
let globalPeer: Peer | undefined;
getPeer().then((peer) => {
  globalPeer = peer;
  // 若尚未连接，检查url中的targetId是否存在
  if (connectStatus.value === ConnectStatus.spare) {
    // 若targetId不存在，将本地id放置在url中，便于直接分享url连接
    // if (!targetId.value) {
    //   targetId.value = peerInfo.value.id;
    // }
    // // 若targetId存在且与本地id不同，尝试连接
    // else if (targetId.value !== peerInfo.value.id) {
    //   toConnect(targetId.value);
    // }
  }
  globalPeer.on("connection", (conn) => {
    console.log("be called");
    dealConnection(conn);
  });
});

const toConnect = (id?: string) => {
  if (!globalPeer || !id) return;
  if (connectStatus.value !== ConnectStatus.spare) {
    connectStatus.value = ConnectStatus.stoping;
    globalPeer.on("disconnected", () => {
      getPeer(true).then((p) => {
        globalPeer = p;
        connectStatus.value = ConnectStatus.spare;
      });
    });
    globalPeer.disconnect();
    return;
  }
  const conn = globalPeer.connect(id);
  connectStatus.value = ConnectStatus.connecting;
  conn.on("open", () => {
    console.log("com");
    connectStatus.value = ConnectStatus.connected;
    dealConnection(conn);
  });
  conn.on("error", (err) => {
    console.log(err);
  });
};

let globalConn: DataConnection;
const messageList = ref<MessageType[]>([]);
const dealConnection = (conn: DataConnection) => {
  globalConn = conn;
  connectStatus.value = ConnectStatus.connected;
  conn.on("data", (data: MessageType) => {
    console.log("Received", data);
    // messageList.value.push({})
    console.log(messageList.value);
    messageList.value.push(data);
  });
};
const sendData = (data: ContentType) => {
  const tmpData = (() => {
    switch (data.type) {
      case "text": {
        const tmpData = {
          user: {
            name: initialUser.value.name,
            id: peerInfo.value.id,
            color: initialUser.value.color,
          },
          time: dayjs().unix(),
          ...data,
        };
        globalConn.send(tmpData);
        return tmpData;
      }
      case "img": {
        const tmpData = {
          user: {
            name: initialUser.value.name,
            id: peerInfo.value.id,
            color: initialUser.value.color,
          },
          time: dayjs().unix(),
          ...data,
        };
        globalConn.send(tmpData);
        return tmpData;
      }
      case "file": {
        const tmpData = {
          user: {
            name: initialUser.value.name,
            id: peerInfo.value.id,
            color: initialUser.value.color,
          },
          time: dayjs().unix(),
          ...data,
        };
        globalConn.send(tmpData);
        return tmpData;
      }
    }
  })();
  messageList.value.push(tmpData);
};

const inputId = ref("");
</script>

<template>
  <div class="header">
    <Avatar
      :name="initialUser.name"
      :bg-color="initialUser.color"
      :editable="connectStatus !== ConnectStatus.connected"
      @change="(v) => (initialUser = { ...initialUser, name: v })"
    ></Avatar>
  </div>
  <div class="content">
    <Chat
      v-if="connectStatus === ConnectStatus.connected"
      :message-list="messageList"
      @send="sendData"
    ></Chat>
    <div v-else class="home">
      <div class="welcome">Hello,{{ initialUser.name }}</div>
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

<style lang="scss">
@import "styles/color.scss";
@import "styles/utils.scss";

* {
  padding: 0;
  margin: 0;
  -webkit-tap-highlight-color: transparent; /* for removing the highlight */
  :not(input) {
    user-select: none;
    -webkit-user-select: none;
  }
}
.allow-select {
  user-select: all;
  -webkit-user-select: all;
}
html {
  background-color: var(--primary-color-dark);
}
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: var(--text-color);
  touch-action: manipulation;
}
#app {
  width: 100vw;
  height: 100vh;
  height: var(--app-height);
  display: flex;
  flex-flow: column nowrap;
}
.header {
  position: sticky;
  top: 0;
  width: calc(100% - 20px);
  padding: 10px;
  background-color: var(--primary-color-dark);
  @include shadowed();
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
