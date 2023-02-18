import { createLocalStorageHandler } from "@/utils/localStorage"
import { readonly, ref } from "vue"
import { User } from "./useUser"

const CONNECT_HISTORY_KEY = 'connect_user_history'

export type StoredUser = (User & { peerId: string })

const [getHistory, setHistory] = createLocalStorageHandler(CONNECT_HISTORY_KEY, () => [] as StoredUser[])

export const useConnectHistory = () => {
    const history = ref(getHistory())
    const add = (user: StoredUser) => {
        remove(user.peerId)
        history.value.push(user)
        setHistory(history.value)
    }
    const remove = (id: string) => {
        history.value = history.value.filter((u) => u.peerId !== id)
        setHistory(history.value)
    }

    return {
        add, remove, history: readonly(history)
    }
}