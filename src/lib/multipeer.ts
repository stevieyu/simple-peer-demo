import SimplePeer from 'simple-peer'
import {xirsys} from './iceServers'

interface MP{
    add: (id:string, initiator?: boolean)  => SimplePeer.Instance
    remove: (id:string)  => this
    get: (id:string)  => this
    on: (eventName: string, cb: Function)  => this
}

export default ():MP => {
    const peers = new Map()
    const config = {
        iceServers: xirsys
    };
    const channelConfig = {
        maxRetransmits: 3
    }

    const events = new Map()

    const eventNames = [
        'signal',
        'connect',
        'data',
        'stream',
        'track',
        'close',
        'error'
    ]

    return {
        add(id:string, initiator:boolean = true){
            if(peers.has(id)) throw '重复ID';

            const peer = new SimplePeer({
                // trickle: false,
                initiator,
                config,
                channelConfig
            })

            for (let eventName of eventNames) {
                if(!events.has(eventName)) continue
                peer.on(eventName, (...args:any[]) => {
                    events.get(eventName)(...args, peer, id, this)
                })
            }

            peers.set(id, peer)
            return peer;
        },
        remove(id:string){
            if(peers.has(id)) {
                peers.get(id).destroy();
                peers.delete(id)
            }

            return this;
        },
        get(id:string){
            if(!peers.has(id)) throw '不存在ID';
            return peers.get(id)
        },
        on(eventName: string, cb: Function){
            if(events.has('eventName')) throw '重复添加事件';
            events.set(eventName, cb)
            return this;
        },
    }
}