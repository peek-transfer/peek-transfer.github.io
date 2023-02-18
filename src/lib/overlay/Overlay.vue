<template>
    <TransitionGroup v-bind="transitionProps">
        <template v-for="(binding, index) in bindings" :key="binding.key">
            <slot v-bind="{ ...binding, index }"></slot>
        </template>
    </TransitionGroup>
</template>
<script lang="ts" setup>
import type { TransitionGroupProps } from 'vue';
import type { Binding } from "./provider";

defineProps<{
    bindings: Binding[],
    transitionProps?: TransitionGroupProps
}>()
</script>