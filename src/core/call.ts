import { intervalWatch } from "@/utils/interval";
import { DataConnection, MediaConnection, Peer } from "peerjs";

export type CallPluginOption<Meta = any> = {
    beRequest?: (accept: (stream?: MediaStream) => { remoteStream: MediaStream, close: () => void }, reject: () => void, meta: Meta) => void;
    onClose?: () => void
}

const CALL_TIMEOUT = 1000 * 60

const CALL_MANUALLY_REJECT_ERROR = 'call_manually_reject_error'
const CALL_TIMEOUT_ERROR = 'call_timeout_error'

const CALL_CLOSE_FLAG = 'call_connection_close_flag'

export const isCallManuallyRejectError = (error: Error) => error.message === CALL_MANUALLY_REJECT_ERROR
export const isCallTimeoutError = (error: Error) => error.message === CALL_TIMEOUT_ERROR

// peerjs 已知问题，media connection无法正常获取close事件，使用data connection代替
const tryClose = (con?: DataConnection, mcon?: MediaConnection) => {
    con?.send(CALL_CLOSE_FLAG)
}
const tryOnClose = (con: DataConnection, callback: () => void) => {
    const fn = (data: any) => {
        if (data === CALL_CLOSE_FLAG) {
            con.off('data', fn)
            callback()
        }
    }
    con.on('data', fn)
}

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
                    // callConnection.close()
                    tryClose(con, callConnection)
                }
                return { remoteStream: callConnection.remoteStream, close }
            }
            const reject = () => {
                // callConnection.close()
                tryClose(con, callConnection)
            }
            option.beRequest?.(accept, reject, meta)
            // callConnection.once('close', () => {
            //     console.log('call closed')
            //     option.onClose?.()
            // })
            con && tryOnClose(con, () => {
                console.log('call closed')
                option.onClose?.()
            })
        })
    }

    const call = (stream: MediaStream, meta: Meta, waitStream: boolean) => {
        if (!peer || !con) throw new Error("plugin is not initialed");
        console.log("local: ", peer.id, "remote:", con.peer, '')
        const callConnection = peer?.call(con?.peer, stream, { metadata: meta })
        const answered = new Promise<MediaStream>((res, rej) => {
            callConnection.once('error', (err) => {
                console.log(err)
                rej(err)
            })
            if (waitStream) {
                callConnection.once('stream', (stream) => {
                    console.log('stream accept')
                    res(stream)
                })
            } else {
                intervalWatch(() => callConnection.open).then(() => {
                    res(callConnection.remoteStream)
                })
            }
            setTimeout(() => {
                rej(new Error(CALL_TIMEOUT_ERROR))
                // callConnection.close()
                tryClose(con, callConnection)
            }, CALL_TIMEOUT);

            // callConnection.once('close', () => {
            //     rej(CALL_MANUALLY_REJECT_ERROR);
            //     option?.onClose?.()
            //     console.log('call con closed')
            // })
            con && tryOnClose(con, () => {
                rej(CALL_MANUALLY_REJECT_ERROR);
                option?.onClose?.()
                console.log('call con closed')
            })
        })
        const stop = () => {
            console.log('stop call connection manually')
            // callConnection.close()
            tryClose(con, callConnection)

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