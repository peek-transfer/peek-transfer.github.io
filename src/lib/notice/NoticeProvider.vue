<template>
    <teleport to="body">
        <Transition name="slide">
            <div v-if="bindings.length" class="vl-notice-provider">
                <Overlay :bindings="bindings" :transition-props="{ name: 'slide' }">
                    <template #default="{ bind, index, key }">
                        <Content v-bind="toContentProp(bind)" class="vl-notice"
                            :class="[typeClass((bind as Required<NoticeOption>).type)]"
                            :style="{ zIndex: bindings.length }">
                        </Content>
                    </template>
                </Overlay>
            </div>
        </Transition>
    </teleport>

</template>
<script lang="ts" setup>
import Overlay, { Binding } from '../overlay';
import Content from '../content';
import { NoticeOption, NoticeType } from './provider';

defineProps<{
    bindings: Binding<Required<NoticeOption>>[]
}>()

const typeClass = (type: NoticeType) => type

const toContentProp = (bind: any) => ({ content: bind.content, contentHtml: bind.contentHtml, contentNode: bind.contentNode })


</script>
<style lang="scss">
@import './index.scss';
</style>
