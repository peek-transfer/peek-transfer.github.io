import { Ref, ref } from "vue";

type Watcher<T> = (f: (v: T) => any) => T;
export const useWatcher = <T>(watcher: (f: (v: any) => any) => T) => {
  const rf = ref<T>();
  const updateValue = (v: T) => {
    rf.value = v;
  };
  rf.value = watcher(updateValue);
  return rf as Ref<T>;
};
