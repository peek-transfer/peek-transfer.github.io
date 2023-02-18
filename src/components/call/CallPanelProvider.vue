<template>
    <Teleport to="body">
        <Transition name="slide">
            <CallPanel v-if="visible" v-bind="(state as any)" v-model:receiver="receiver"
                :video-source="localVideoSource" :mute="localMuted" @toggle-mute="toggleMute"
                @switch-video="switchVideo">
            </CallPanel>
        </Transition>
    </Teleport>
</template>
<script lang="ts" setup>
import { setCallOption, useCall } from '@/hooks/useCall';
import { useUser } from '@/hooks/useUser';
import { assay } from '@/utils/assay';
import { createUserMedia, stopMediaStream, UserMediaMixer, VideoSource } from '@/utils/userMedia';
import { ref } from 'vue';
import { CallType, showIncomeCallPanel, showDialOutCallPanel, receiver, state, visible, clearAndClosePanel } from './callPanel';
import CallPanel from "./CallPanel.vue";

const getInitialMediaArg = (callType: CallType) => {
    if (callType === CallType.Camera) return [VideoSource.Facial, undefined] as const
    if (callType === CallType.Screen) return [VideoSource.Display, undefined] as const
    return [undefined, undefined] as const
}

const mixer = ref<UserMediaMixer>()
setCallOption({
    onBeRequest: async (accept, reject, { type, name }) => {
        try {
            const { closePanel, shiftToAnswerView, actionAccepted } = showIncomeCallPanel(type, name)
            const ok = await actionAccepted;
            if (!ok) {
                // 我方拒绝
                reject()
                closePanel()
                return
            }
            const args = getInitialMediaArg(type)
            localVideoSource.value = args[0]
            localMuted.value = Boolean(args[1])
            const localStream = (type === CallType.Screen) ? undefined : (await createUserMedia(...args)).stream
            const { remoteStream, close } = accept(localStream)
            const connectionEnd = shiftToAnswerView(remoteStream, localStream)
            try {
                await connectionEnd
                // 我方挂断
                close()
            } catch (error) {
                // 对方挂断
                console.log('connection was hanged up by other side')
                closePanel()
            }
            localStream && stopMediaStream(localStream)
        } catch {
            // 对方取消
            reject()
        }
    },
    onClose: () => {
        clearAndClosePanel()
    }
})

const { userInfo } = useUser()
const { callPlugin } = useCall()
const call = async (type: CallType) => {
    assay('Call', type, 'Start')
    const args = getInitialMediaArg(type)
    localVideoSource.value = args[0]
    localMuted.value = Boolean(args[1])
    mixer.value = await createUserMedia(...args)
    assay('Call', type, 'Stream_Success')
    const localStream = mixer.value.stream
    const { shiftToAnswerView, closePanel } = showDialOutCallPanel(type, userInfo.name, localStream)
    const { stop, answered } = callPlugin.call(localStream, { type, name: userInfo.name })
    let startTime = -1
    try {
        const remoteStream = await answered;
        startTime = Date.now()
        assay('Call', type, 'Connect_Success')
        const startConnection = shiftToAnswerView(remoteStream)
        await startConnection;
        // 我方挂断
        stop()
    } catch (error) {
        // 对方挂断
        console.log('connection was hanged up by other side')
        closePanel()
    }
    if (startTime !== -1) {
        assay('Call', type, `Connect_Duration_${((Date.now() - startTime) / 1000).toFixed(2)}`)
    }

    stopMediaStream(localStream)
}

defineExpose({
    call
})

const localVideoSource = ref<VideoSource>()
const localMuted = ref<boolean>(false)

const toggleMute = async () => {
    await mixer.value?.switchAudio(!localMuted.value)
    localMuted.value = !localMuted.value;

}
const switchVideo = async (source: VideoSource) => {
    await mixer.value?.switchVideo(source)
    localVideoSource.value = source

}
</script>