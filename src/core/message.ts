import Peer, { DataConnection } from "peerjs"
import { v1 } from "uuid";
import { gteFileType, FileType } from "@/utils/file";

export enum MessageType {
    Text = 'Text',
    File = 'File',
}
export type Message = {
    from?: string;
    id: string
} & ({
    type: MessageType.Text,
    value: string
} | {
    type: MessageType.File,
    fileType: FileType,
    fileSize: number,
    fileName: string
    value: Blob
})


enum MessagePhase {
    Start,
    Data,
    End
}

type Header = {
    id: string;
    type: MessageType.Text;
} | {
    id: string;
    type: MessageType.File;
    fileType: FileType;
    fileSize: number
    fileName: string
}

type RawMessage<MessageHeaderAppend = any> = { data: Message, phase: MessagePhase.Data } | { data: Header & MessageHeaderAppend, phase: MessagePhase.Start } | { data: string, phase: MessagePhase.End }



type MessagePluginOption<MessageHeaderAppend = any> = {
    transformHeader?: (header: Header) => MessageHeaderAppend;
    onReceive?: (header: Header & MessageHeaderAppend, finish: () => Promise<Message>) => void
    onSend?: (data: Message, header: Header & MessageHeaderAppend, finish: () => Promise<void>) => void
}
export const createPeekMessagePlugin = <MessageHeaderAppend = any>(option: MessagePluginOption<MessageHeaderAppend>) => {
    let con: DataConnection | undefined
    let peer: Peer | undefined


    const init = (connection: DataConnection, p: Peer) => {
        con = connection;
        peer = p
        con.on('data', (_raw) => {
            const raw = _raw as RawMessage<MessageHeaderAppend>
            if (raw.phase === MessagePhase.Start) {
                const finish = () => new Promise<Message>((res, rej) => {
                    const fn = (__raw: any) => {
                        const fullData = __raw as RawMessage<MessageHeaderAppend>
                        if (fullData.phase === MessagePhase.Data && fullData.data.id === raw.data.id) {
                            res(fullData.data)
                            const ackMsg: RawMessage = { phase: MessagePhase.End, data: raw.data.id }
                            con?.send(ackMsg)
                            con?.off('data', fn)
                        }
                    }
                    con?.on('data', fn)
                    con?.once('error', rej)
                })
                option.onReceive?.(raw.data, finish)
            }
        })
    }

    const send = <T extends MessageType = MessageType.Text>(type: T, data: T extends MessageType.Text ? string : File) => {
        if (!con) return
        if (type === MessageType.Text) data;
        const messageId = v1()
        const fileType = (type === MessageType.Text ? undefined : gteFileType(data as File)) as T extends MessageType.Text ? never : FileType;
        const headerData: Header = type === MessageType.Text ? { id: messageId, type } : { id: messageId, type, fileType, fileSize: (data as File).size, fileName: (data as File).name }
        const transformedHeader = { ...headerData, ...option.transformHeader?.(headerData) } as Header & MessageHeaderAppend
        con.send({
            phase: MessagePhase.Start,
            data: transformedHeader
        } as RawMessage<MessageHeaderAppend>);
        const msg: Message = type === MessageType.Text ? {
            id: messageId,
            type,
            from: peer?.id,
            value: data as string,
        } : {
            id: messageId,
            type,
            from: peer?.id,
            fileType,
            fileSize: (data as File).size,
            fileName: (data as File).name,
            value: (data as File),
        }
        con.send({
            phase: MessagePhase.Data,
            data: msg
        } as RawMessage<MessageHeaderAppend>);
        const finish = () => new Promise<void>((res, rej) => {
            const fn = (_raw: any) => {
                const raw = _raw as RawMessage<MessageHeaderAppend>
                if (raw.phase === MessagePhase.End && raw.data === messageId) {
                    res()
                    con?.off('data', fn)
                }
            }
            con?.on('data', fn)
            con?.once('error', rej)
        })
        option.onSend?.(msg, transformedHeader, finish)
    }

    return {
        init,
        send
    }
}