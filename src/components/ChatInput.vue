<template>
    <div class="flex flex-wrap justify-end rounded-lg bg-stone-200 m-2 p-2 rounded md:shadow-md">
        <input v-model="text" autofocus class="flex-1 bg-transparent outline-none" maxlength="500" type="text"
            placeholder="Type here" @keypress.enter="sendText">
        <div class="flex items-center">
            <div class="flex">
                <button class="icon-contrast-button mr-2" @click="showFilePicker()">
                    <div class="icon icon-base bg-stone-500 i-mdi:paperclip">
                    </div>
                </button>
            </div>
            <button class="primary-button" :disabled="text.length === 0" @click="sendText">send</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { createFileHandler } from "@/utils/file";
import { ref } from 'vue';

// defineProps<{

// }>()

const emit = defineEmits<{
    (name: 'sendText', v: string): void;
    (name: 'sendFile', v: File): void;
}>()

const text = ref('')

const sendText = () => {
    if (text.value.length === 0) return
    emit('sendText', text.value)
    text.value = ''
}

const { showFilePicker, handleFileDrop } = createFileHandler({
    onChange: (e) => {
        emit('sendFile', e,)
    }
})
</script>