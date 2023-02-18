<template>
    <div>
        <template v-if="content">{{ content }}</template>
        <div v-else-if="contentHtml" v-html="contentHtml"></div>
        <component v-else-if="contentNode" :is="contentNode"></component>
    </div>
</template>
<script lang="ts" setup>
import { VNode } from 'vue';
defineProps<{
    content?: string | undefined;
    contentHtml?: string | undefined;
    contentNode?: VNode;
}>()

</script>
