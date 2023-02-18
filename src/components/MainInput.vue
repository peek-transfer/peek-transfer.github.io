<template>
    <Popover ref="popoverEl" trigger="focus-within" class="w-full z-1" overlay-class="w-[calc(100%+8px)]">
        <input :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
            class="primary-input my-1 w-full" type="text" :placeholder="placeholderText" @focus="stopTyping">
        <template #overlay v-if="history?.length">
            <div class="w-full min-h-10 bg-white shadow-xl rounded max-h-30 overflow-y-auto">
                <div class="text-center py-1 text-stone-600 text-sm">History connections</div>
                <div v-for="(item, index) in history"
                    class="w-full flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-stone-100 active:bg-stone-200"
                    @click="$emit('select', item.peerId); hideOverlay()">
                    <Avatar :name="item.name" class="w-10 h-10 text-sm"></Avatar>
                    <button class="icon-button" @click.stop="$emit('remove', item.peerId)">
                        <div class="i-mdi:close"></div>
                    </button>
                </div>
            </div>
        </template>
    </Popover>
</template>

<script lang="ts" setup>
import { StoredUser } from '@/hooks/useConnectHistory';
import { useTypingText } from '@/hooks/useTypingText';
import { onMounted, ref } from 'vue';
import Avatar from './Avatar.vue';
import Popover from './Popover.vue';

defineProps<{
    modelValue?: string;
    history?: readonly StoredUser[];
}>()

defineEmits<{
    (name: 'update:modelValue', v: string): void
    (name: 'remove', id: string): void
    (name: 'select', id: string): void
}>()


const INSTRUCTION_CONTENT = ['Hello,-- this is Peek.', 'A-- simple-- p2p chat-- & file transfer app.', 'Paste-- your friends\' id-- here,', 'Then-- click connect-- to enjoy!']
const { actText: placeholderText, start: startTyping, stop: stopTyping } = useTypingText(INSTRUCTION_CONTENT, { splitter: (str) => str.split('--') })
onMounted(() => {
    startTyping()
})

const popoverEl = ref<InstanceType<typeof Popover>>()
const hideOverlay = () => {
    popoverEl.value?.$el.blur()
}
</script>
<style lang="scss" scoped>
.primary-input {
    @apply border-2 border-stone-500 rounded-md py-2 px-4 hover: (border-stone-600) focus:(border-stone-900) outline-none
}
</style>