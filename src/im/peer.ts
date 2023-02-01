// import fingerprint from './fingerprint.js'

// const peerId = await fingerprint()

await import('https://cdn.jsdelivr.net/npm/peerjs@1.4.7/dist/peerjs.min.js');

const { Peer: PeerExtends } = window;

export default class Peer extends PeerExtends{
    constructor(id = '', options = {}){
        // if(!id) id = peerId;
        options = {
            host: '1.peerjs.com',
            secure: true,
            port: '',
        }
        super(id, options);
    }
}

