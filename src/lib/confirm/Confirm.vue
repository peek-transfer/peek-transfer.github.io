<template>
    <div class="vl-confirm-provider" :class="[customClass]">
        <div class="vl-confirm-modal" @click="() => modalClose && $emit('select', UNSELECT_CLOSE)">
        </div>
        <div class="vl-confirm-content" :class="[customContentClass]">
            <div class="vl-confirm-content__header">
                <template v-if="showClose">
                    <slot name="closeButton" v-bind="{ close: () => $emit('select', UNSELECT_CLOSE) }">
                        <button class="close-button" @click="$emit('select', UNSELECT_CLOSE)">
                            close
                        </button>
                    </slot>
                </template>
            </div>
            <slot v-bind="{ ...toContentProp(props) }">
                <Content v-bind="toContentProp(props)" class="vl-confirm-content__body">
                </Content>
            </slot>
            <div class="vl-confirm-content__footer">
                <template v-for="(selection, index)  in selections" :key="index">
                    <slot name="footerButton" v-bind="{
                        select: () => doSelect(selection, index),
                        selection, index,
                        enteringIndex: enteringIndex
                    }">
                        <button class="selection-button" :disabled="enteringIndex !== undefined"
                            @click="doSelect(selection, index)">
                            {{ enteringIndex === index ? 'Waiting...' : getSelectionLabel(selection) }}
                        </button>
                    </slot>
                </template>

            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, VNode } from 'vue';
import Content from '../content';
import type { Selections, } from './provider';
import { UNSELECT_CLOSE } from "./provider";


// const props = defineProps<Required<ConfirmProps>>()
const props = defineProps<{
    customClass?: string;
    customContentClass?: string;
    selections?: any[];
    showClose?: boolean
    modalClose?: boolean
    content?: string
    contentHtml?: string
    contentNode?: VNode
}>()

const emit = defineEmits<{
    // vue3 子组件的emit事件在父组件除了可以用 @eventName 来接收之外，还可以向子组件传入 onEventName 的 props 来处理
    (name: 'select', v: any): void
}>()

const enteringIndex = ref<number>()

const toContentProp = (bind: any) => ({ content: bind.content, contentHtml: bind.contentHtml, contentNode: bind.contentNode })

const getSelectionLabel = (selection: Selections[number]) => typeof selection === 'string' ? selection : selection.label

const doSelect = async (selection: Selections[number], selectionIndex: number) => {
    if (enteringIndex.value !== undefined) return
    if (typeof selection === 'string') {
        emit('select', selection)
        return
    }
    if (!selection.entering) {
        emit('select', selection.value)
        return
    }
    enteringIndex.value = selectionIndex
    try {
        await selection.entering()
        enteringIndex.value = undefined
        emit('select', selection.value)
    } catch (error) {
        enteringIndex.value = undefined
    }


}
</script>