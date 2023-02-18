import { createLocalStorageHandler } from "@/utils/localStorage";
import { DataConnection, Peer } from "peerjs";

export enum PeekOpenStatus {
    Initial = 'initial',
    Unavailable = 'unavailable',
    Available = 'available',

}

export enum PeekConnectStatus {
    Spare = 'spare',
    Connecting = 'connecting',
    Connected = 'connected'
}

export type Connector<Meta = any> = {
    name: string;
    id: string;
    connectionId: string
} & Meta

export type PeekInfo<Meta = any> = {
    peerId: string;
    connectors: Connector<Meta>[]
}

export type PeekPlugin = {
    init: (con: DataConnection, peer: Peer) => void
}

export type PeekSetupOptions<Meta = any> = {
    plugins?: PeekPlugin[]
    onOpenStatusChange?: (stat: PeekOpenStatus) => void;
    onConnectStatusChange?: (stat: PeekConnectStatus) => void;
    onInfoChange?: (info: PeekInfo<Meta>) => void;
    onError?: (err: Error) => void;
    beRequest?: (accept: () => Promise<void>, reject: () => void, meta: Meta & { peerId: string }) => void,
    metadata: Meta
}

const LOCAL_ID_KEY = 'peerId'
const [localId, setLocalId] = createLocalStorageHandler<string>(LOCAL_ID_KEY)

const ACCEPT_CONNECTION = 'accept_connection'
const REJECT_CONNECTION = 'reject_connection'

const MANUALLY_REJECT_ERROR = 'connection be manually rejected'
export const isManuallyRejectedError = (e: Error) => e.message === MANUALLY_REJECT_ERROR

const createConnectManager = <M = any>() => {
    const connections = new Map<string, DataConnection>()
    const add = (connection: DataConnection, metadata?: M) => {
        connections.set(connection.connectionId, connection);
        (connection as any).___metadata = metadata
    }
    const remove = (id: string) => {
        connections.delete(id)
    }
    const get = connections.get
    const getAll = () => [...connections.values()]
    const getConnectors = (): Connector<M>[] => [...connections.values()].map((con) => ({ ...con.metadata, id: con.connectionId, connectionId: con.connectionId, ...(con as any).___metadata }))
    return {
        add, remove, getConnectors, get, getAll
    }
}

export const setupPeek = <Meta = any>(options: PeekSetupOptions<Meta>) => {
    const peer = new Peer(localId()!)
    const connectionManager = createConnectManager<Meta>()

    const updateOpenStatus = (stat: PeekOpenStatus) => {
        options.onOpenStatusChange?.(stat)
    }
    const updateConnectStatus = (stat: PeekConnectStatus) => {
        options.onConnectStatusChange?.(stat)
    }
    const updateInfo = () => {
        options.onInfoChange?.({ peerId: peer.id, connectors: connectionManager.getConnectors() })
    }
    updateInfo()

    peer.on('open', () => {
        console.log('peer open success')
        updateOpenStatus(PeekOpenStatus.Available)
        setLocalId(peer.id)
        updateInfo()
    })
    peer.on('error', (err) => {
        options.onError?.(err)
        updateOpenStatus(PeekOpenStatus.Available)
        if (err.message.includes('Could not connect to peer')) {
            updateOpenStatus(PeekOpenStatus.Available)
            updateConnectStatus(PeekConnectStatus.Spare)
            return
        }
        updateOpenStatus(PeekOpenStatus.Unavailable)
    })

    const connectTo = (id: string, meta: Meta) => {
        let con: DataConnection | undefined

        updateConnectStatus(PeekConnectStatus.Connecting)
        const connect = new Promise<Meta & { peerId: string }>((res, rej) => {
            con = peer.connect(id, { metadata: meta })
            console.log('try connect', con)

            con.once('data', (data: any) => {
                console.log('connect data', data)
                if (data.ack === ACCEPT_CONNECTION) {
                    res({ ...data.metadata, peerId: id })
                    options.plugins?.forEach(plugin => plugin.init(con!, peer))
                    updateConnectStatus(PeekConnectStatus.Connected)
                    connectionManager.add(con!, data.metadata)
                    updateInfo()
                }
                // else {
                //     rej(new Error(MANUALLY_REJECT_ERROR))
                //     updateConnectStatus(PeekConnectStatus.Spare)
                //     con?.close()
                // }
            })
            con.once('close', () => {
                rej(new Error(MANUALLY_REJECT_ERROR))
                updateConnectStatus(PeekConnectStatus.Spare)
                con?.close()
            })
            con.once('error', (e) => {
                console.log(e)
                rej()
            })
        })
        const disconnect = () => {
            if (!con) return
            con.close()
            connectionManager.remove(con.connectionId)
            updateInfo()
        }

        return {
            disconnect,
            connect,
        }
    }

    peer.on('connection', (con) => {
        const accept = () => {
            console.log('manual accept')
            return new Promise<void>((res) => {
                const tryAccept = () => {
                    console.log('send accept ack')
                    con.send({ ack: ACCEPT_CONNECTION, metadata: options.metadata })
                    options.plugins?.forEach(plugin => plugin.init(con!, peer))
                    connectionManager.add(con!)
                    updateInfo()
                    updateConnectStatus(PeekConnectStatus.Connected)
                    res()
                }
                tryAccept()
                con.once('open', tryAccept)
            })
        }
        const reject = () => {
            console.log('manual reject')
            return new Promise<void>((res) => {
                // res()
                // updateConnectStatus(PeekConnectStatus.Spare)
                // con.close()
                con.once('open', () => {
                    con.send(REJECT_CONNECTION)
                    res()
                    updateConnectStatus(PeekConnectStatus.Spare)
                    con.close()
                })
            })
        }
        console.log('be request connect')
        options.beRequest?.(accept, reject, { ...con.metadata, peerId: con.peer })
    })

    const destroy = () => {
        peer.destroy()
    }
    return {
        connectTo,
        connectionManager,
        destroy,
        peer
    }

}