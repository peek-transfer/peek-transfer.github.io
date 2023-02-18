<template>
    <div class="call-panel w-full h-full backdrop-filter backdrop-blur rounded fixed top-0 flex place-center">
        <div
            class="w-full h-full md:max-w-800px md:max-h-800px flex flex-col justify-between items-center pt-20 relative">
            <Avatar v-if="(!answered || !type) && name" :name="name" class="w-32 h-32"></Avatar>
            <template v-if="!answered">
                <template v-if="income">
                    <div class="text-lg font-semibold">Invites you to join {{ typeString(type) }}</div>
                </template>
                <template v-else>
                    <div class="text-lg">Waiting for answered</div>
                </template>
            </template>
            <div v-if="answered" class="w-full h-full flex justify-center items-center">
                <div class="video-view" :class="{ 'front': firstFronted }" @click="toggleFrontVideo">
                    <div class="relative w-full">
                        <video ref="otherVideoEl" playsinline class="flex-1 w-full h-full rounded shadow-md"></video>
                        <Avatar v-if="name" class="w-10 absolute bottom-1 left-1 text-xs" :name="name"></Avatar>
                    </div>
                </div>
                <div class="video-view w-full" :class="{ 'front': !firstFronted }" @click="toggleFrontVideo">
                    <div class="relative">
                        <video v-show="videoSource !== VideoSource.Display" ref="selfVideoEl" playsinline
                            class="flex-1 w-full h-full rounded shadow-md"></video>
                        <Avatar v-if="name" class="w-10 absolute bottom-1 left-1 text-xs" name="me"></Avatar>
                    </div>
                    <div v-show="videoSource === VideoSource.Display">Screen Sharing</div>
                </div>
            </div>
            <div class="absolute bottom-20 flex w-full justify-between px-20 md:px-[30%] transition-all z-10"
                :class="{ '!px-[calc(50%-28px)]': !showAnswerButton }">
                <button
                    class="bg-red rounded-full w-14 h-14 flex-shrink-0 backdrop-filter backdrop-blur transition-all hover:scale-110 active:!scale-120 flex place-center"
                    @click="clickHangup">
                    <div class="i-mdi:phone-hangup w-8 h-8 bg-white"></div>
                </button>
                <button v-if="showAnswerButton"
                    class="bg-green rounded-full w-14 h-14 flex-shrink-0 backdrop-filter backdrop-blur transition-all hover:scale-110 active:!scale-120 flex place-center"
                    @click="clickAnswer">
                    <div class="i-mdi:phone w-8 h-8 bg-white"></div>
                </button>
            </div>

        </div>
    </div>
</template>
<script lang="ts" setup>
import { useUser } from '@/hooks/useUser';
import { VideoSource } from '@/utils/userMedia';
import { computed, ref, watchEffect } from 'vue';
import Avatar from '../Avatar.vue';
import { CallType, ReceiverType } from './callPanel';

type CallState = {
    income?: boolean | undefined,
    name?: string | undefined,
    answered?: boolean | undefined,
    type?: CallType | undefined,

    localStream?: MediaStream | undefined,
    remoteStream?: undefined | undefined,
    receiver?: ReceiverType,

    mute?: boolean,
    videoSource?: VideoSource
}

const props = defineProps<CallState>()

type Emits = {
    (name: ReceiverType): void,
    (name: 'toggleMute', v: boolean): void,
    (name: 'switchVideo', v: VideoSource): void
}

const emit = defineEmits<Emits>()

const { userInfo } = useUser()

const typeString = (type?: CallType) => {
    switch (type) {
        case CallType.Camera:
            return 'video call'
        case CallType.Screen:
            return 'screen share'
        case CallType.Microphone:
            return 'phone call'
        default:
            return ''
    }
}

const showAnswerButton = computed(() => props.income && !props.answered)

const clickHangup = () => {
    if (props.answered) {
        emit('stop');

        return
    }
    if (props.income) {
        emit('reject');

        return
    }
    emit('cancel')

}
const clickAnswer = () => {
    emit('accept')

}

const firstFronted = ref(true)
const toggleFrontVideo = () => { firstFronted.value = !firstFronted.value }

const selfVideoEl = ref<HTMLVideoElement>()
const otherVideoEl = ref<HTMLVideoElement>()
watchEffect(() => {
    if (selfVideoEl.value && props.localStream) {
        selfVideoEl.value.srcObject = props.localStream
        selfVideoEl.value.play()
    }
    if (otherVideoEl.value && props.remoteStream) {
        otherVideoEl.value.srcObject = props.remoteStream
        otherVideoEl.value.play()
    }
})


</script>
<style lang="scss" scoped>
.call-panel {
    .video-view {
        @apply flex justify-center items-center transition-all duration-500 rounded absolute top-2 right-2 min-w-40 min-h-30 max-w-40 max-h-30 cursor-pointer z-2;

        &.front {
            @apply w-full h-full max-w-full max-h-full z-1 top-0 right-0 pointer-events-none;
        }
    }
}
</style>