import { reactive, Ref, ref, UnwrapRef, watch } from "vue";
import { ConnectStatus, UserInfoType } from "../utils/type";

export type LocalStorageItem = {
  peerInfo: {
    id: string;
    createTime: number;
  };
  userInfo: UserInfoType;
  connectStatus: ConnectStatus;
};

const map = {} as Record<keyof LocalStorageItem, Ref>;

export default function useStoredRef<T extends keyof LocalStorageItem>(
  key: T,
  initValue?: LocalStorageItem[T]
): Ref<UnwrapRef<Required<LocalStorageItem>[T]>> {
  const v = localStorage.getItem(key);
  if (v === null) {
    if (initValue === undefined)
      throw new Error(`key ${key} has not be initialed`);
    localStorage.setItem(key, JSON.stringify(initValue));
    return useStoredRef(key);
  }
  const itemValue = JSON.parse(v) as LocalStorageItem[T];
  if (!map[key]) {
    const sRef = ref(
      typeof itemValue === "object" ? reactive(itemValue) : itemValue
    ) as Ref<UnwrapRef<Required<LocalStorageItem>[T]>>;
    map[key] = sRef;
    watch(sRef, (r) => {
      localStorage.setItem(key, JSON.stringify(r));
    });
  }

  return map[key];
}
