// @ts-ignore
import hmacSHA256 from 'crypto-js/hmac-sha256'
// @ts-ignore
import Base64 from 'crypto-js/enc-base64'
// @ts-ignore
import pako from 'pako'

export default class {
    private readonly sdkappid: any
    private readonly key: any

    constructor(sdkappid:any, key:any) {
        this.sdkappid = sdkappid;
        this.key = key;
    }

    public genSig(userid:any, expire:any, userBuf:any = null){
        const currTime = Math.floor(Date.now() / 1000);

        const sigDoc:any = {
            'TLS.ver': "2.0",
            'TLS.identifier': "" + userid,
            'TLS.sdkappid': Number(this.sdkappid),
            'TLS.time': Number(currTime),
            'TLS.expire': Number(expire)
        };

        let sig = '';
        if (null != userBuf) {
            const base64UserBuf = Base64.stringify(userBuf);
            sigDoc['TLS.userbuf'] = base64UserBuf;
            sig = this._hmacsha256(userid, currTime, expire, base64UserBuf);
        } else {
            sig = this._hmacsha256(userid, currTime, expire, null);
        }
        sigDoc['TLS.sig'] = sig;

        return btoa(String.fromCharCode(...pako.deflate(JSON.stringify(sigDoc))))
            .replace(/\+/g, '*')
            .replace(/\//g, '-')
            .replace(/=/g, '_')
    }

    private _hmacsha256(identifier:any, currTime:any, expire:any, base64UserBuf:any) {
        let contentToBeSigned = "TLS.identifier:" + identifier + "\n";
        contentToBeSigned += "TLS.sdkappid:" + this.sdkappid + "\n";
        contentToBeSigned += "TLS.time:" + currTime + "\n";
        contentToBeSigned += "TLS.expire:" + expire + "\n";
        if (null != base64UserBuf) {
            contentToBeSigned += "TLS.userbuf:" + base64UserBuf + "\n";
        }
        return Base64.stringify(hmacSHA256(contentToBeSigned, this.key));
    };
}