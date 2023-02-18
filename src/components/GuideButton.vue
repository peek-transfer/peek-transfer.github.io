<template>
    <div class="text-sm text-stone-600 underline cursor-pointer" @click="showGuide">what's this?</div>
</template>
<script lang="ts" setup>
import { assay } from '@/utils/assay';
import { showConfirm } from './confirm';

const showGuide = () => {
    assay('Guide', 'Show')
    showConfirm({
        selections: ['Ok'],
        content: `Peek can transfer data between you and your friend's device though P2P without server, including text, images, videos and any other files.`
    })
}
</script>