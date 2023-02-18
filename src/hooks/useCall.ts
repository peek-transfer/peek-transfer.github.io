import { CallType } from "@/components/call"
import { CallPluginOption, createCallPeekPlugin } from "@/core/call"
import { getCurrentInstance, onBeforeUnmount } from "vue"

type Meta = { type: CallType, name: string }
type BeRequest = CallPluginOption<Meta>['beRequest'] | undefined

let _beRequest: BeRequest
let _onClose: (() => void) | undefined
export const setCallOption = (option: { onBeRequest?: BeRequest, onClose?: () => void }) => {
    _beRequest = option.onBeRequest;
    _onClose = option.onClose
    if (getCurrentInstance()) {
        onBeforeUnmount(() => {
            _beRequest = undefined
            _onClose = undefined
        })
    }
}

export const callPlugin = createCallPeekPlugin<Meta>({
    beRequest: async (video, accept, reject,) => {
        _beRequest?.(video, accept, reject)
    },
    onClose: () => {
        _onClose?.()
    }
})

export const useCall = () => {
    return {
        callPlugin
    }
}
