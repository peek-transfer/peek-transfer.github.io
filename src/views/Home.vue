<template>
    <div class="w-full h-full flex justify-center">
        <div class="p-4 w-full max-w-[400px] flex flex-col items-center">
            <div class="header-placeholder flex-1 max-h-[10%]"></div>
            <div class="w-full flex-shrink-0 mt-1 flex flex-col items-center justify-center">
                <Avatar v-model:name="userInfo.name" editable class="h-20 text-xl"></Avatar>
                <span class="py-1 truncate max-w-[90%]">Hello, <span class="font-bold">{{ userInfo.name }}</span>
                </span>
            </div>
            <div class="rounded-md flex flex-col place-center py-2 my-1 w-full min-h-20 cursor-pointer transition-all"
                :class="[info?.peerId ? 'bg-green-700' : 'bg-yellow-500']">
                <div v-if="info?.peerId" class="flex flex-col place-center" @click="copyId">
                    <div class="text-light-700 text-sm">Your id:</div>
                    <div class="text-light-50 text-center font-bold px-1">{{ info.peerId }}</div>
                    <div class="text-light-700 text-sm">click to copy</div>
                </div>
                <template v-else>
                    <div class="text-stone-500 text-sm text-white">loading...</div>
                </template>
            </div>
            <MainInput v-model="targetId" :history="historyList" @remove="removeHistoryConnector"
                @select="selectHistoryConnector"></MainInput>
            <button class="primary-button my-1 w-full" :disabled="disabled" @click="toConnect()">{{
                connectStatus ===
                PeekConnectStatus.Connecting ? 'connecting...' :
                (openStatus === PeekOpenStatus.Initial ? 'waiting...' : 'connect') }}</button>
            <div class="pt-4">
                <ShareButton :peer-id="info?.peerId" @shared="(ack) => canAutoAcceptAck = ack"></ShareButton>
            </div>
            <div class="pt-4">
                <GuideButton></GuideButton>
            </div>
        </div>
        <button class="absolute bottom-2 right-2 icon-button" title="reset" @click="toReset()">
            <div class="i-mdi:head-remove-outline w-5 h-5 bg-stone-500"></div>
        </button>
    </div>
</template>
<script lang="ts" setup>
import Avatar from '@/components/Avatar.vue';
import { showConfirm } from '@/components/confirm';
import MainInput from '@/components/MainInput.vue';
import { showNotice } from '@/components/notice';
import ShareButton from '@/components/ShareButton.vue';
import GuideButton from '@/components/GuideButton.vue';
import { isManuallyRejectedError, PeekOpenStatus, PeekConnectStatus } from '@/core/peek';
import { useConnectHistory } from '@/hooks/useConnectHistory';
import { setPeekBequest, usePeek } from '@/hooks/usePeek';
import { useValueSettled } from '@/hooks/useSettled';
import { useShare } from '@/hooks/useShare';
import { useUser } from '@/hooks/useUser';
import { copyTextToClipboard } from '@/utils/clipboard';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { userMediaAvailable } from '@/utils/userMedia';
import { assay } from '@/utils/assay';

// Deal connection acceptation
const { add: addHistoryConnector, remove: removeHistoryConnector, history } = useConnectHistory()
const historyList = computed(() => [...history.value.map(h => ({ ...h }))].reverse())
const canAutoAcceptAck = ref<string>()
const { openStatus, connectStatus, info, peek } = usePeek()

setPeekBequest(async (accept, reject, meta) => {
    const doAccept = async () => {
        await accept()
        router.replace('/chat');
        addHistoryConnector({ name: meta.name, peerId: meta.peerId })
    }
    if (meta.acceptAck && canAutoAcceptAck.value && meta.acceptAck === canAutoAcceptAck.value) {
        await doAccept()
        return
    }
    try {
        const accepted = await showConfirm({
            selections: [{ label: 'Decline', value: false }, {
                label: 'Accept', value: true, entering: async () => {
                    await doAccept()
                    return
                }
            },] as const,
            content: `${meta.name} wants to connect, confirm?`,
        })
        if (!accepted) {
            reject()
        }
    } catch {

    }
})

// Base connect method
const { userInfo } = useUser()
const router = useRouter()
const connectById = async (id?: string) => {
    if (!id) return
    const { connect } = peek.connectTo(id, { ...userInfo, media: userMediaAvailable, acceptAck: shareInfo.value?.ack })
    assay('Communication', 'Start')
    try {
        const targetInfo = await connect;
        router.replace('/chat')
        addHistoryConnector({ name: targetInfo.name, peerId: targetId.value })
        assay('Communication', 'Success')
    } catch (error) {
        if (isManuallyRejectedError(error as Error)) {
            // showNotice('connect rejected', { type: NoticeType.Error })
            showNotice({ type: 'error', content: 'connect rejected' })
            return

        }
        // else showNotice('connect failed', { type: NoticeType.Error })
        showNotice({ type: 'error', content: 'connect failed' })
    }
}

// Manually connect to others
const targetId = ref('')
const selectHistoryConnector = (id: string) => {
    targetId.value = id
}
const toConnect = async () => {
    connectById(targetId.value)
}

// Auto connect to id by url info
const { info: shareInfo, clear: clearShareInfo } = useShare()
const openStatusSettled = useValueSettled(openStatus, PeekOpenStatus.Available, PeekConnectStatus.Spare)

if (shareInfo.value?.targetId) {
    targetId.value = shareInfo.value!.targetId!
    openStatusSettled.then(() => {
        connectById(targetId.value)
    })
    clearShareInfo()
}



// some UI states & method
const disabled = computed(() => openStatus.value !== PeekOpenStatus.Available || connectStatus.value !== PeekConnectStatus.Spare || targetId.value.length === 0)

const copyId = async () => {
    if (info.value?.peerId) {
        await copyTextToClipboard(info.value.peerId);
        // showNotice('Copy id success!')
        showNotice({ content: 'copy id success' })
    }
}

const toReset = async () => {
    try {
        const done = await showConfirm({
            selections: [{ label: 'Yes', value: true }, { label: 'No', value: false }] as const,
            content: `This will clear all your history connections and reset your ID, Are you sure?`,
            modalClose: true,
            showClose: true
        })
        if (done) {
            assay('Reset')
            localStorage.clear()
            location.reload()
        }
    } catch {

    }
}

</script>