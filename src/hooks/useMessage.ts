import { createPeekMessagePlugin, Message } from "@/core/message"
import { assay } from "@/utils/assay"
import { ref } from "vue"


export type FullMessage = Message & ({ value?: any, received: false, sendTime: number, byMe: boolean } | {
    sendTime: number,
    receiveTime: number,
    received: true,
    byMe: boolean
})

const messageList = ref<FullMessage[]>([])
export const messagePlugin = createPeekMessagePlugin({
    transformHeader: () => {
        return {
            sendTime: Date.now()
        }
    },
    onSend: async (data, header, finish) => {
        assay('Chat', header.type, 'Start')
        const fullData: FullMessage = { ...data, sendTime: header.sendTime, received: false, byMe: true }
        messageList.value.push(fullData)
        await finish()
        const index = messageList.value.findIndex(m => m.id === header.id)
        messageList.value[index] = { ...fullData, receiveTime: Date.now(), received: true } as FullMessage
        assay('Chat', header.type, 'Success')
    },
    onReceive: async (header, finish) => {
        const sendTime = Date.now()
        messageList.value.push({ ...header, received: false, sendTime, byMe: false, value: undefined })
        const fullData = await finish()
        const index = messageList.value.findIndex(m => m.id === header.id)
        const receiveTime = Date.now()
        messageList.value[index] = { ...fullData, sendTime, receiveTime, received: true } as FullMessage
        assay('Chat', 'Receive', `${header.type}-${((receiveTime - header.sendTime) / 1000).toFixed(2)}s`)
    }
})

export const useMessage = () => {
    return {
        messageList, messagePlugin
    }
}