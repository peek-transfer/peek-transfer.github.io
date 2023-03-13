<template>
    <div class="w-full h-full flex place-center">
        <div class="w-full h-full md:max-w-800px md:max-h-800px flex flex-col">
            <div class="flex place-center p-2 rounded md:shadow-md">
                <div class="flex-1 flex justify-start">
                    <button class="icon-button" @click="toBack">
                        <div class="icon icon-base i-mdi:arrow-left">
                        </div>
                    </button>
                </div>
                <div class="flex-1 flex justify-center items-center">
                    <Avatar v-if="otherSideInfo" preview :name="otherSideInfo.name" class="h-10 !text-xs"></Avatar>
                </div>
                <div class="flex-1 flex justify-end">
                    <template v-if="userMediaAvailable">
                        <button v-if="displayMediaAvailable" class="icon-button mr-1 md:mr-2" title="share screen"
                            @click="toCall(CallType.Screen)">
                            <div class="icon icon-base i-mdi:laptop">
                            </div>
                        </button>
                        <button class="icon-button mr-1 md:mr-2" title="audio call" @click="toCall(CallType.Microphone)">
                            <div class="icon icon-base i-mdi:phone">
                            </div>
                        </button>
                        <button class="icon-button" title="video call" @click="toCall(CallType.Camera)">
                            <div class="icon icon-base i-mdi:video">
                            </div>
                        </button>
                    </template>
                </div>
            </div>
            <div class="flex-1 overflow-y-hidden mb-2">
                <ChatList class="px-2" :list="messageList"></ChatList>
            </div>
            <ChatInput @send-text="sendText" @send-file="sendFile"></ChatInput>
        </div>
    </div>
    <CallPanelProvider ref="callPanelProvider" />
</template>
<script lang="ts" setup>
import ChatInput from '@/components/ChatInput.vue';
import ChatList from '@/components/ChatList.vue';
import { useMessage } from '@/hooks/useMessage';
import { computed, onBeforeUnmount, ref } from 'vue';
import { MessageType } from '@/core/message';
import { showConfirm } from '@/components/confirm';
import { useRouter } from 'vue-router';
import { usePeek } from '@/hooks/usePeek';
import Avatar from '@/components/Avatar.vue';
import { showNotice } from '@/components/notice';
import CallPanelProvider, { CallType } from '@/components/call';
import { userMediaAvailable, displayMediaAvailable } from '@/utils/userMedia';
import { assay } from '@/utils/assay';
import { t } from '@/locale';

const { info, peek } = usePeek()
const otherSideInfo = computed(() => info.value?.connectors[0])


const { messageList, messagePlugin, clear } = useMessage()

const sendText = (v: string) => {
    if (isChatClosed.value) return
    messagePlugin.send(MessageType.Text, v)
}

const sendFile = (file: File) => {
    if (isChatClosed.value) return
    messagePlugin.send(MessageType.File, file)
}

const isChatClosed = ref(false)
peek.connectionManager.getAll()[0]?.once('close', () => {
    showNotice({ content: t('connection-closed'), type: 'warning' })
    isChatClosed.value = true
})
const router = useRouter()
const toBack = async () => {
    try {
        const leave = await showConfirm({
            selections: [{ label: t('no'), value: false }, { label: t('yes'), value: true },] as const,
            content: t('stop-connection-confirm-message'),
            showClose: true,
            modalClose: true
        })
        if (leave) {
            peek.connectionManager.getAll()[0].close()
            router.replace('/')
        }
    } catch {

    }
}

const callPanelProvider = ref<InstanceType<typeof CallPanelProvider>>()
const toCall = (type: CallType) => {
    if (isChatClosed.value) return
    callPanelProvider.value?.call(type)
    assay('Call', type, 'Start')
}

onBeforeUnmount(() => {
    clear()
})

</script>