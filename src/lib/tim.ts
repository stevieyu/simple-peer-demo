import TIM from 'tim-js-sdk';
import Api from './timGenUserSig'

let tim:any

const initTim = (userID: string): PromiseLike<any> => {
    const SDKAppID = 1400085368;
    const SDKAppKey = '9f0fb95bd7a8b97f6bc86b2b4910b37b15643b56a6cd1ea5691463f95b6eed50';

    const userSig = (new Api(SDKAppID, SDKAppKey)).genSig(userID, 604800)

    tim = TIM.create({
        SDKAppID,
    });
    tim.setLogLevel(3); // https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#setLogLevel

    tim.login({
        userID,
        userSig
    });
    // tim.logout();

    return new Promise(resolve => {
        tim.on(TIM.EVENT.SDK_READY, () => {
            resolve(tim);
        });
    })
}

export const sendMsg = (description = '', to = 'Z', data = '', extension = '') => {
    tim.sendMessage(tim.createCustomMessage({
        to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
            data,
            description,
            extension
        }
    }))
}

export default async (id:string) => {
    return await initTim(id)
}
