import multipeer from './multipeer'
import {load as fingerprintJSLoad} from '@fingerprintjs/fingerprintjs';
import initTim, {sendMsg} from './im';
import {watch, reactive} from 'vue'

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
    const {visitorId} = (await (await fingerprintJSLoad()).get())

    const tim = await initTim(visitorId);

    const send = (description:any = '', to = toUid, data = 'signal', extension = '') => {
        if(description) description = JSON.stringify(description)
        sendMsg(description, to, data, extension)
    }

    if (!!toUid && toUid !== visitorId) {
        peer = mp.add(toUid, false)
        send()
    } else {
        peer = mp.add(visitorId)
        history.replaceState(null, '', `#${visitorId}`)
    }

    tim.on('onMessageReceived', (event: any) => {
        const {data: {0: value}} = event
        console.log('MESSAGE_RECEIVED', value)

        const {payload: {data: type, description}, from} = value
        if (type !== 'signal') return;

        if (description) {
            JSON.parse(description).forEach((v:any) => peer.signal(v))

            const wsStop = watch(signals, () => {
                send(signals, from)
                wsStop();
            })
        } else if (signals.length) {
            send(signals, from)
        } else {
            const wsStop = watch(signals, () => {
                send(signals, from)
                wsStop()
            })
        }
    });
}