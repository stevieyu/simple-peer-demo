import TIM from 'tim-js-sdk';

const load = (src:string = ''): PromiseLike<void> => {
    return new Promise((resolve) => {
        const el = document.createElement('script')
        el.src = src;
        el.onload = () => resolve()
        document.head.append(el);
    })
}

let tim:any

const initTim = (userID: string): PromiseLike<any> => {
    // @ts-ignore
    const genTestUserSig = window.genTestUserSig

    const {SDKAppID, userSig} = genTestUserSig(userID);
    tim = TIM.create({
        SDKAppID
    });
    tim.setLogLevel(1); // https://imsdk-1252463788.file.myqcloud.com/IM_DOC/Web/SDK.html#setLogLevel

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
    await load('https://cdn.jsdelivr.net/gh/tencentyun/TIMSDK/H5/dist/debug/lib-generate-test-usersig.min.js')
    await load('/GenerateTestUserSig.js')

    return await initTim(id)
}
