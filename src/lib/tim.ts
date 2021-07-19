import TIM from 'tim-js-sdk';
import Api from './timGenUserSig'
import Room from './room'

class Tim implements Room{
    private tim:any
    private readonly userID:string

    constructor(userID:string) {
        this.userID = userID;
    }

    async init(){
        const SDKAppID = 1400085368;
        const SDKAppKey = '9f0fb95bd7a8b97f6bc86b2b4910b37b15643b56a6cd1ea5691463f95b6eed50';
        const {userID} = this

        const userSig = (new Api(SDKAppID, SDKAppKey)).genSig(userID, 604800)

        const tim = TIM.create({
            SDKAppID,
        });
        tim.setLogLevel(3); // https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#setLogLevel

        tim.login({
            userID,
            userSig
        });
        // tim.logout();

        await new Promise(resolve => {
            tim.on(TIM.EVENT.SDK_READY, () => {
                resolve(tim);
            });
        })

        this.tim = tim
        return this
    }

    send(to:string, data: object|null = null, type: string = 'signal'): Promise<any> {
        const {tim} = this;

        return tim.sendMessage(tim.createCustomMessage({
            to,
            conversationType: TIM.TYPES.CONV_C2C, //TIM.TYPES.CONV_GROUP
            payload: {
                data: type,
                description: data && JSON.stringify(data),
                extension: ''
            }
        }))
    }

    receive(cb:Function): void {
        const {tim} = this;
        tim.on(TIM.EVENT.MESSAGE_RECEIVED, (event:any) => {
            const  {payload:{data: type, description: data}, from} = event.data[0]
            cb({
                data: data && JSON.parse(data) || '',
                type,
                from
            })
        })
    }

    members(): Promise<any> {
        const {tim} = this;
        return new Promise(resolve => {
            tim.on(TIM.EVENT.SDK_READY, resolve)
        })
    }
}

export default (userID:string) => (new Tim(userID)).init()