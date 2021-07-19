import multipeer from './multipeer'
import {load as fingerprintJSLoad} from '@fingerprintjs/fingerprintjs';
import room from './tim';
import {reactive} from 'vue'
import { debouncedWatch } from '@vueuse/core'

//import.meta.env.MODE === 'development'

const toUid = location.hash.replace('#', '')

const signals: any[] = reactive([])
let peer: any
const mp = multipeer()
    .on('signal', (data: any) => {
        console.log('signal', data)
        signals.push(data)
    })
    .on('connect', () => {
        console.log('sp:CONNECT')
        peer.send('whatever' + Math.random())
    })
    .on('data', (data: any) => {
        console.log('sp:data', data, data.toString())
    })
    .on('close', () => {
        console.log('sp:close')
    })
    .on('error', (err: Error, peer: any, id: string, self: any) => {
        if (err.message.concat('error Connection failed')) {
            self.remove(id)
        }
        throw err
    })

export default async () => {
    const {visitorId} = await (await fingerprintJSLoad()).get()
    const Room = await room(visitorId);

    if (!!toUid && toUid !== visitorId) {
        // 加入
        peer = mp.add(toUid, false)
        await Room.send(toUid)
    } else {
        // 创建
        peer = mp.add(visitorId)
        history.replaceState(null, '', `#${visitorId}`)
    }

    Room.receive((res:any) => {
        console.log('MESSAGE_RECEIVED', res)

        const {data, from} = res

        if (data) {
            data.forEach((v:any) => peer.signal(v))

            const wsStop = debouncedWatch(signals, () => {
                Room.send(from, signals)
                wsStop();
            }, { debounce: 100 })
        } else if (signals.length) {
            Room.send(from, signals)
        } else {
            const wsStop = debouncedWatch(signals, () => {
                signals.length && Room.send(from, signals)
                wsStop()
            }, { debounce: 100 })
        }
    });
}