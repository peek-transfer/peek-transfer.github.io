// import { NoticeType, showNotice } from "@/components/notice"
import { showNotice } from "@/components/notice"

import { PeekOpenStatus, PeekInfo, setupPeek, PeekSetupOptions, PeekConnectStatus } from "@/core/peek"
import { assay } from "@/utils/assay"
import { userMediaAvailable } from "@/utils/userMedia"
import { getCurrentInstance, onBeforeUnmount, ref } from "vue"
import { callPlugin } from "./useCall"
import { messagePlugin } from "./useMessage"
import { User, useUser } from "./useUser"

const { userInfo } = useUser()

type Meta = User & { media: boolean, acceptAck?: string | number }

const openStatus = ref<PeekOpenStatus>(PeekOpenStatus.Initial)
const connectStatus = ref<PeekConnectStatus>(PeekConnectStatus.Spare)
const info = ref<PeekInfo<Meta>>()

let _beRequest: PeekSetupOptions<Meta>['beRequest'] | undefined
export const setPeekBequest = (beFn: PeekSetupOptions<Meta>['beRequest']) => {
    _beRequest = beFn
    if (getCurrentInstance()) {
        onBeforeUnmount(() => {
            _beRequest = undefined
        })
    }
}

const peek = setupPeek<Meta>({
    onOpenStatusChange: (stat) => {
        openStatus.value = stat
        assay('Peer_Open_Status', stat)
    },
    onConnectStatusChange: (stat) => {
        connectStatus.value = stat
        assay('Peer_Connect_Status', stat)
    },
    onInfoChange: (inf) => { info.value = inf },
    beRequest: (accept, reject, meta) => {
        _beRequest?.(accept, reject, meta)
    },
    plugins: [
        messagePlugin, callPlugin
    ],
    metadata: {
        name: userInfo.name,
        media: userMediaAvailable
    },
    onError: (err) => {
        // showNotice(err.message, { type: NoticeType.Error })
        showNotice({ content: err.message, type: 'error' })
    }
})

export const usePeek = () => {
    return {
        peek,
        openStatus,
        connectStatus,
        info,
    }
}

