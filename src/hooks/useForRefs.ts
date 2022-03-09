import { onBeforeUpdate, ref } from "vue";

export default function useForRefs<T extends HTMLElement>() {
  const refs = ref<T[]>([]);
  const setRefs = (el: any) => {
    refs.value.push(el);
  };
  onBeforeUpdate(() => {
    refs.value = [];
  });
  return {
    setRefs,
    refs,
  };
}
