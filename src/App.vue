<script setup lang="ts">
import { ConfirmProvider, bindings as confirmBindings } from '@/components/confirm';
import { NoticeProvider, bindings as noticeBindings } from '@/components/notice';

</script>

<template>
  <RouterView />
  <NoticeProvider :bindings="noticeBindings"></NoticeProvider>
  <ConfirmProvider :bindings="confirmBindings">
    <template #closeButton="{ close }">
      <button class="icon icon-button" @click="close()">
        <div class="i-mdi:close"></div>
      </button>
    </template>
    <template #footerButton="{ select, selection }">
      <button
        class="rounded px-2 py-1 transition-all mr-1 text-stone-600 hover:bg-stone-100 active:!bg-stone-200 last:font-bold"
        @click="select()">
        {{ selection?.label ?? selection }}</button>
    </template>
  </ConfirmProvider>
</template>

<style lang="scss">
@import "./styles/base.scss";
</style>
