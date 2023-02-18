<template>
    <div ref="listEl" class="w-full h-full overflow-y-scroll pt-2">
        <div v-for="(msg, index) in list" :key="msg.id" class="flex my-2 chat-item items-end"
            :class="[msg.byMe ? 'sended' : 'received']">
            <template v-if="msg.type === MessageType.Text">
                <div class="bubble">
                    {{ msg.value }}
                </div>
            </template>
            <template v-else-if="msg.type === MessageType.File">
                <div v-if="msg.fileType === FileType.Image" class="bubble">
                    <template v-if="msg.received || msg.byMe">
                        <img :src="createBlobURL(msg.value)" alt="">
                    </template>
                    <template v-else>
                        <div class="flex items-center">
                            <div class="i-mdi:image w-4 h-4"></div>{{ msg.fileName }}
                        </div>
                    </template>
                </div>
                <div v-else-if="msg.fileType === FileType.Video" class="bubble">
                    <template v-if="msg.received || msg.byMe">
                        <video controls :src="createBlobURL(msg.value)" alt=""></video>
                    </template>
                    <template v-else>
                        <div class="flex items-center">
                            <div class="i-mdi:play-box w-4 h-4"></div>{{ msg.fileName }}
                        </div>
                    </template>
                </div>
                <div v-else-if="msg.fileType === FileType.Audio" class="bubble">
                    <template v-if="msg.received || msg.byMe">
                        <audio controls :src="createBlobURL(msg.value)" alt=""></audio>
                    </template>
                    <template v-else>
                        <div class="flex items-center">
                            <div class="i-mdi:music-box w-4 h-4"></div>{{ msg.fileName }}
                        </div>
                    </template>
                </div>
                <div v-else-if="msg.fileType === FileType.File" class="bubble">
                    <template v-if="msg.received || msg.byMe">
                        <a class="flex items-center rounded bg-white px-2 py-1 shadow" :href="createBlobURL(msg.value)"
                            :download="msg.fileName" target="_blank">
                            <div class="i-mdi:file w-4 h-4 mr-1"></div>{{
                                msg.fileName
                            }}
                        </a>
                    </template>
                    <template v-else>
                        <div class="flex items-center">
                            <div class="i-mdi:file"></div>{{ msg.fileName }}
                        </div>
                    </template>
                </div>
            </template>
            <div class="bg-gray mx-1"
                :class="[msg.received ? 'i-mdi:check-circle-outline' : 'i-mdi:checkbox-blank-circle-outline']">
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { FullMessage } from '@/hooks/useMessage';
import { MessageType } from '@/core/message';

import { nextTick, ref, watch } from 'vue';
import { FileType } from '@/utils/file';
import { debounce } from "lodash-es";

const props = defineProps<{
    list: FullMessage[]
}>()

const createBlobURL = (blob: Blob | ArrayBuffer) => {
    if (blob instanceof Blob)
        return URL.createObjectURL(blob)
    const f = new Blob([new Uint8Array(blob).buffer])
    return URL.createObjectURL(f)
}

const listEl = ref<HTMLDivElement>()
const autoScroll = debounce(() => {
    nextTick(() => {
        listEl.value?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    })
}, 100)
watch(() => props.list.length, autoScroll)
</script>
<style lang="scss" scoped>
.chat-item {
    .bubble {
        @apply p-2 rounded-md max-w-[60%] break-words;
    }

    &.sended {
        @apply justify-end;

        .bubble {
            @apply rounded-rb-0 bg-orange-200;
        }
    }

    &.received {
        @apply justify-end flex-row-reverse;

        .bubble {
            @apply rounded-lb-0 bg-stone-200;
        }
    }
}
</style>