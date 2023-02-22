<template>
    <div class="text-sm text-stone-600 underline cursor-pointer" @click="showGuide">{{ $t('whats-this') }}</div>
</template>
<script lang="ts" setup>
import { t } from '@/locale';
import { assay } from '@/utils/assay';
import { showConfirm } from './confirm';

const showGuide = () => {
    assay('Guide', 'Show')
    showConfirm({
        selections: [t('ok')],
        content: t('peek-instruction')
    })
}
</script>