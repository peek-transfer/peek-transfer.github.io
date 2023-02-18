import { MediaConnection, DataConnection } from "peerjs";

type Connection = MediaConnection | DataConnection

// type x = MediaConnection['on']

// type p = Parameters<x>

type Fn = <T extends string>(name: T, v: T extends 'name' ? string : number) => void

let x: Fn | undefined;
x?.('name', '12')

export const once = <Event>(connection: Connection, event: Event, when: (data: Connection['on']) => boolean, callback: Parameters<Connection['on']>[1]) => { }