import { createLocalStorageHandler } from "@/utils/localStorage"
import { randomName, randomString } from "@/utils/random"
import { reactive, watch } from "vue"

export type User = { name: string }

const USER_INFO_KEY = 'user_info'
const [getLocalUserInfo, setLocalUserInfo] = createLocalStorageHandler(USER_INFO_KEY, () => ({ name: randomName() } as User))
const userInfo = reactive(getLocalUserInfo())
watch(userInfo, setLocalUserInfo)

export const useUser = () => {
    return { userInfo }
}