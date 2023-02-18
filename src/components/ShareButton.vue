<template>
    <Popover :visible="visible" trigger="manual" placement="top" offset="-100px">
        <button :disabled="disabled" class="icon-button w-12 flex place-center" title="share" @click="onClick">
            <button class="i-mdi:ios-share w-6 h-6 disabled:bg-gray" :disabled="disabled"></button>
        </button>
        <template #overlay>
            <div ref="sharePanel"
                class="w-70 bg-white rounded-lg shadow-md flex flex-col place-center rounded cursor-pointer">
                <div class="bg-gray-800 w-full p-4 rounded-t flex flex-col items-center justify-center">
                    <canvas ref="codeEl" class="w-[180px] h-[180px]"></canvas>
                    <div class="text-white text-center text-sm py-2 break-all">{{ shareLink }}</div>
                </div>
                <div class="flex flex-col place-center px-4 py-2">
                    <div class="font-bold py-1">Share link to friends</div>
                    <div>
                        <button v-if="isShareable" class="icon-button mx-1" @click="share">
                            <div class="i-mdi:share-variant w-5 h-5"></div>
                        </button>
                        <button class="icon-button mx-1" @click="copy">
                            <div class="i-mdi:content-copy w-5 h-5"></div>
                        </button>
                        <button class="icon-button mx-1" @click="mailTo">
                            <div class="i-mdi:email w-5 h-5"></div>
                        </button>
                    </div>
                    <div class="text-xs text-center text-stone-600 py-1">
                        The share link is generated, tell your friends to open it on browser.
                    </div>
                </div>
            </div>
        </template>
    </Popover>
</template>
<script lang="ts" setup>
import { useClickOutside } from '@/hooks/useClickOutside';
import { URLShareAppend } from '@/hooks/useShare';
import { assay } from '@/utils/assay';
import { copyTextToClipboard } from '@/utils/clipboard';
import { createQrCodeOnCanvas } from '@/utils/qrcode';
import { randomInt } from '@/utils/random';
import { appendMessageToURL } from '@/utils/url';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { showNotice } from './notice';
import Popover from './Popover.vue';

const props = defineProps<{
    peerId?: string
}>()

const emit = defineEmits<{
    (name: 'shared', ack: string): void
}>()

const visible = ref(false);

const disabled = computed(() => !Boolean(props.peerId))

const sharePanel = ref<HTMLDivElement>()
useClickOutside(sharePanel, async () => {
    await nextTick()
    if (visible.value === true) {
        visible.value = false
    }

})

const ack = ref<string>()

const onClick = () => {
    visible.value = true;
    assay('Share', 'Open_Share_Panel')
    if (!ack.value) {
        ack.value = randomInt(4)
        emit('shared', ack.value)
    }
}

const SHARE_TITLE = 'Link to your friends - Peek'
const shareLink = computed(() => appendMessageToURL({ targetId: props.peerId, ack: ack.value } as URLShareAppend))
const copy = async () => {
    await copyTextToClipboard(shareLink.value);
    // showNotice('Copy link success!')
    showNotice({ content: 'Copy link success' })
}
const mailTo = () => {
    window.open(`mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${shareLink.value}`)
}
const isShareable = Boolean(navigator.share)
const share = () => {
    navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TITLE,
        url: shareLink.value,
    })
}

const codeEl = ref<HTMLCanvasElement>()
const codeLoading = ref(true)
watch(() => [visible.value, shareLink.value], () => {
    if (visible.value && shareLink.value) {
        if (!codeEl.value) return
        createQrCodeOnCanvas(shareLink.value, codeEl.value)
        codeLoading.value = true
    }
})

</script>