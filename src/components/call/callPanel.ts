import { reactive, ref, watch } from "vue";

export enum CallType {
    Camera = 'Camera', // 摄像头视频流，包括麦克风音频
    Screen = 'Screen', // 屏幕视频流，包括屏幕音频
    Microphone = 'Microphone' // 麦克风音频流
}

type InitialState = {
    income: boolean | undefined,
    name: string | undefined,
    answered: boolean | undefined,
    type: CallType | undefined,

    localStream: MediaStream | undefined,
    remoteStream: undefined | undefined,
}

type DialOutState = {
    income: false,
    name: string,
    answered: false,
    type: CallType,

    localStream: MediaStream,
    remoteStream: undefined,
}
type DialOutAnsweredState = {
    income: false,
    name: string,
    answered: true,
    type: CallType,

    localStream: MediaStream,
    remoteStream: MediaStream,
}
type IncomeState = {
    income: true,
    name: string,
    answered: false,
    type: CallType,

    localStream: undefined,
    remoteStream: undefined,
}
type IncomeAnsweredState = {
    income: true,
    name: string,
    answered: true,
    type: CallType,

    localStream?: MediaStream,
    remoteStream: MediaStream,
}

export type ReceiverType = 'accept' | 'reject' | 'stop' | 'cancel'

export type CallState = (InitialState | DialOutState | DialOutAnsweredState | IncomeState | IncomeAnsweredState) & Partial<Record<`on${Capitalize<ReceiverType>}`, any>>

const initialState = {
    income: undefined,
    name: undefined,
    answered: false,
    type: undefined,

    localStream: undefined,
    remoteStream: undefined,
}
const initialListener = {
    onAccept: () => { },
    onCancel: () => { },
    onStop: () => { },
    onReject: () => { },

}
export const state = ref<CallState>({ ...initialState })

const INCOME_CANCEL_ERROR = 'income_cancel_error' // 拨出通话，在接通前就取消了


export const receiver = ref<ReceiverType>()

export const visible = ref(false)

let globalRej: undefined | (() => void)
export const clearAndClosePanel = () => {
    visible.value = false
    state.value = { ...initialState, ...initialListener }
    globalRej?.()
}


export const showIncomeCallPanel = (type: CallType, name: string) => {
    visible.value = true

    const actionAccepted = new Promise<boolean>((res, rej) => {
        state.value = {
            income: true, name, answered: false, type, localStream: undefined, remoteStream: undefined,
            ...initialListener,
            onAccept: () => {
                res(true);
            },
            onReject: () => {
                res(false)
            }
        }
        globalRej = rej
    })
    const shiftToAnswerView = (remoteStream: MediaStream, localStream?: MediaStream,) => {

        return new Promise<void>((res, rej) => {
            globalRej = rej
            state.value = {
                income: true, name, answered: true, type, localStream, remoteStream,
                ...initialListener,
                onAccept: () => {
                    res();
                },
                onStop: () => {
                    res()
                    clearAndClosePanel()
                }
            }
        })
    }
    const closePanel = () => {
        clearAndClosePanel()
    }

    return { actionAccepted, shiftToAnswerView, closePanel }
}

export const showDialOutCallPanel = (type: CallType, name: string, localStream: MediaStream, onCancel?: () => void) => {
    visible.value = true
    state.value = {
        income: false, name, answered: false, type, localStream, remoteStream: undefined,
        ...initialListener,
        onCancel: () => {
            console.log('terminate call')
            onCancel?.()
            clearAndClosePanel()
        }
    }
    const shiftToAnswerView = (remoteStream?: MediaStream) => {

        const start = new Promise<void>((res, rej) => {
            globalRej = rej
            state.value = {
                income: false, name, answered: true, type, localStream, remoteStream,
                ...initialListener,
                onAccept: () => { },
                onStop: () => {
                    res()
                    clearAndClosePanel()
                },
                onCancel: () => {
                    rej()
                    clearAndClosePanel()
                }
            }
        })
        return start
    }
    const closePanel = () => {
        clearAndClosePanel()
    }

    return { shiftToAnswerView, closePanel }
}