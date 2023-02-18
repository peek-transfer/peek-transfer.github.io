<template>
    <div class="rounded-full text-white max-h-full transition-all aspect-1"
        :class="{ 'focus-within:!aspect-[2] hover:aspect-[1.2]': editable, 'hover:!aspect-[2]': preview }"
        :style="{backgroundColor:bgColor}">
        <input ref="input" type="text" :value="name" maxlength="20" :disabled="!editable"
            class="w-full h-full text-white bg-transparent outline-none text-center px-1 disabled:opacity-100"
            @blur="$emit('update:name', ($event.target as HTMLInputElement).value)" />
    </div>
</template>
<script lang="ts" setup>
import { getColorByString } from '@/utils/color';
import { computed } from 'vue';

const props = withDefaults(defineProps<{ name: string, editable?: boolean, preview?: boolean }>(), {
    editable: false,
    preview: false
});
defineEmits<{
    (name: 'update:name', v: string): void
}>();

const bgColor = computed(() => getColorByString(props.name))

</script>
