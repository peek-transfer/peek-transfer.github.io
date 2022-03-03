<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { getRandomColor } from "../utils/random";

const props = defineProps({
  name: String,
  editable: { type: Boolean, default: false },
  bgColor: {
    type: String,
    default: getRandomColor(),
  },
});
const emit = defineEmits(["change"]);
const input = ref<HTMLInputElement>();
const shouldEdit = ref(false);
const editing = computed({
  get: () => (props.editable ? shouldEdit.value : false),
  set: (v) => {
    shouldEdit.value = v;
  },
});
const toEdit = () => {
  if (!props.editable) return;
  editing.value = true;
  nextTick(() => {
    input.value?.focus();
  });
};

const onBlur = () => {
  editing.value = false;
  const newName = input.value?.value;
  if (newName !== name) {
    emit("change", newName);
  }
};
</script>
<template>
  <div :class="{ avatar: true, editable }" @click="toEdit()">
    <span class="name" v-if="!editing">{{ name }}</span>
    <input
      class="editor"
      ref="input"
      v-else
      type="text"
      :value="name"
      @blur="onBlur()"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/utils.scss";
.avatar {
  $height: 50px;
  width: $height;
  height: $height;
  min-width: $height;
  max-width: 150px;
  background-color: v-bind(bgColor);
  border-radius: $height;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ease-in-out 0.2s;
  $text-color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  color: $text-color;
  margin: 5px;
  @include shadowed();

  &.editable {
    @media (hover: hover) {
      &:hover {
        padding: 0 25px;
      }
    }
    &:focus-within {
      padding: 0 25px;
    }
  }

  .editor {
    border: none;
    outline: none;
    background: none;
    width: 100%;
    font-size: 16px;
    color: $text-color;
  }
  .name {
    // width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    margin: 3px;
  }
}
</style>
