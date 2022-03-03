<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  delay: {
    type: Number,
    default: 2000,
  },
  type: {
    type: String,
    default: "success",
  },
  onFullDestroyed: {
    type: Function,
    default: () => ({}),
  },
});
const emits = defineEmits(["fullDestroyed"]);
const selfVisible = ref(props.visible);
watchEffect(() => {
  selfVisible.value = props.visible;
});
const show = () => {
  selfVisible.value = true;
  setTimeout(() => {
    selfVisible.value = false;
    setTimeout(() => {
      emits("fullDestroyed");
    }, 200);
  }, props.delay);
};
onMounted(() => {
  setTimeout(() => {
    show();
  }, 1);
});
</script>
<template>
  <div class="message" :class="`${selfVisible ? 'showed' : ''} ${type}`">
    <div class="message-text">{{ text }}</div>
  </div>
</template>
<style scoped lang="scss">
@import "../styles/utils.scss";
.message {
  position: fixed;
  top: 0;
  transform: translateY(-40px);
  opacity: 0;
  right: 10%;
  width: 80%;
  margin: 10px 0;
  padding: 10px 0;
  border-radius: 6px;
  background-color: gray;
  transition: all ease-in-out 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  @include shadowed();
  &.showed {
    transform: translateY(0);
    opacity: 1;
  }
  &.success {
    background-color: green;
  }
  &.error {
    background-color: red;
  }
  &.warn {
    background-color: orange;
  }
  &-text {
    // display: inline-block;
    max-width: 90%;
    max-height: 46px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: normal;
    word-break: break-all;
  }
}
</style>
