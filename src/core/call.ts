import { intervalWatch } from "@/utils/interval";
import { DataConnection, MediaConnection, Peer } from "peerjs";

export type CallPluginOption<Meta = any> = {
    beRequest?: (accept: (stream?: MediaStream) => { remoteStream: MediaStream, close: () => void }, reject: () => void, meta: Meta) => void;
    onClose?: () => void
}

const CALL_TIMEOUT = 1000 * 60

const CALL_MANUALLY_REJECT_ERROR = 'call_manually_reject_error'
const CALL_TIMEOUT_ERROR = 'call_timeout_error'

export const isCallManuallyRejectError = (error: Error) => error.message === CALL_MANUALLY_REJECT_ERROR
export const isCallTimeoutError = (error: Error) => error.message === CALL_TIMEOUT_ERROR

export const createCallPeekPlugin = <Meta = any>(option: CallPluginOption) => {
    let con: DataConnection | undefined
    let peer: Peer | undefined


    const init = (connection: DataConnection, p: Peer) => {
        con = connection;
        peer = p;

        peer.on('call', (callConnection) => {
            const meta: Meta = callConnection.metadata
            const accept = (localStream?: MediaStream) => {
                console.log('answer stream')
                callConnection.answer(localStream)
                const close = () => {
                    callConnection.close()
                }
                return { remoteStream: callConnection.remoteStream, close }
            }
            const reject = () => {
                callConnection.close()
            }
            option.beRequest?.(accept, reject, meta)
            callConnection.once('close', () => {
                option.onClose?.()
            })
        })
    }

    const call = (stream: MediaStream, meta: Meta) => {
        if (!peer || !con) throw new Error("plugin is not initialed");
        console.log("local: ", peer.id, "remote:", con.peer, '')
        const callConnection = peer?.call(con?.peer, stream, { metadata: meta })
        const answered = new Promise<MediaStream>(async (res, rej) => {
            callConnection.on('error', (err) => {
                console.log(err)
                rej(err)
            })
            callConnection.once('close', () => { rej(CALL_MANUALLY_REJECT_ERROR); option?.onClose?.() })
            callConnection.once('stream', (stream) => {
                console.log('stream accept')
                res(stream)
            })
            // await intervalWatch(() => callConnection.open)
            // res(callConnection.remoteStream)
            setTimeout(() => {
                rej(new Error(CALL_TIMEOUT_ERROR))
                callConnection.close()
            }, CALL_TIMEOUT);
        })
        const stop = () => {
            callConnection.close()
        }
        return {
            answered,
            stop
        }
    }

    return {
        init, call
    }
}