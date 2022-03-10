<script lang="ts" setup>
import { ref } from "vue";

defineProps<{
  modelValue: string;
  showFilterList?: boolean;
  filterList?: any[];
}>();
defineEmits(["update:modelValue"]);

const inputRef = ref<HTMLInputElement>();
const wrapRef = ref<HTMLDivElement>();
</script>
<template>
  <div tabindex="0" class="custom-input" ref="wrapRef">
    <div tabindex="1" class="input-field">
      <input
        ref="inputRef"
        :value="modelValue"
        @input="(e:any) => $emit('update:modelValue', e?.target?.value)"
        v-bind="$attrs"
      />
      <button
        class="clear"
        @touchstart=""
        @click="
          () => {
            $emit('update:modelValue', '');
            inputRef?.focus();
          }
        "
      ></button>
    </div>
    <div
      v-if="showFilterList"
      class="filter-list"
      @click="
        () => {
          wrapRef?.blur();
        }
      "
    >
      <div
        v-for="(item, index) in filterList"
        :key="index"
        class="list-item"
        @click="() => {}"
      >
        <slot v-bind="item"> {{ item }}</slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../styles/utils.scss";
.custom-input {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  .input-field {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    input {
      flex: 1;
      border: none;
      outline: none;
      background: none;
      &:active {
        outline: none;
      }
    }
    &:focus-within button.clear {
      display: flex;
    }
    .clear {
      @include buttoned();
      background-color: #aaa5a5;
      // width: 15px;
      aspect-ratio: 1;
      height: 50%;
      border-radius: 50%;
      @include crossed();
      display: none;
    }
  }
  &:focus-within .filter-list {
    display: flex;
  }
  .filter-list {
    @include shadowed();
    position: absolute;
    display: none;
    background-color: white;
    width: 100%;
    border-radius: 8px;
    top: calc(100% + 10px);
    flex-flow: column nowrap;
    max-height: 300px;
    overflow-y: scroll;
    .list-item {
      width: 100%;
    }
  }
}
</style>
