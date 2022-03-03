<script setup lang="ts">
import { ref } from "vue";
defineProps<{ list: string[] }>();
const emits = defineEmits(["choose"]);
const popupVisible = ref(false);
</script>
<template>
  <div class="picker">
    <div class="content" @click="() => (popupVisible = !popupVisible)">
      <slot></slot>
    </div>
    <transition name="slide-fade">
      <div
        v-if="popupVisible"
        v-click-outside="() => (popupVisible = false)"
        class="popup"
      >
        <div
          v-for="(item, i) in list"
          class="item"
          :key="i"
          @click="
            () => {
              emits('choose', item, i);
            }
          "
        >
          {{ item }}
        </div>
      </div>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
@import "../styles/utils.scss";
.picker {
  position: relative;
  .popup {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    min-height: 50px;
    background-color: aliceblue;
    border-radius: 2px;
    @include shadowed();
    transition: all 0.2s ease;
    color: black;
    padding: 5px;
    .item {
      @include buttoned();
      padding: 10px 5px;
      color: #585858;
      font-weight: 500;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in-out;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: scale(0.2);
  transform-origin: right top;
  opacity: 0;
}
</style>
