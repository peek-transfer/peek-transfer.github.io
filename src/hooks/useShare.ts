import { readMessageFromURL, removeURLMessage } from "@/utils/url"
import { ref } from "vue"

export type URLShareAppend = { targetId: string, ack: string }

export const useShare = () => {
    const info = ref(readMessageFromURL<URLShareAppend>())
    const clear = () => {
        removeURLMessage()
    }
    return { info, clear }
}