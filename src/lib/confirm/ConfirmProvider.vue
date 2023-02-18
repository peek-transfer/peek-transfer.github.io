<template>
    <teleport to="body">
        <Overlay :bindings="bindings" :transition-props="{ name: 'fade' }">
            <template #default="{ bind, key }">
                <Confirm v-bind="bind">
                    <template #closeButton="slot">
                        <slot name="closeButton" v-bind="slot"></slot>
                    </template>
                    <template #default="slot">
                        <slot name="default" v-bind="slot"></slot>
                    </template>
                    <template #footerButton="slot">
                        <slot name="footerButton" v-bind="slot"></slot>
                    </template>
                </Confirm>
            </template>
        </Overlay>
    </teleport>
</template>
<script lang="ts" setup>
import Overlay, { Binding } from '../overlay';
import Content from '../content';
import { ConfirmProps, Selections, UNSELECT_CLOSE } from './provider';
import Confirm from "./Confirm.vue";
import { reactive, ref } from 'vue';

defineProps<{
    bindings: Binding<Required<ConfirmProps>>[]
}>()

</script>
<style lang="scss">
@import './index.scss';
</style>
