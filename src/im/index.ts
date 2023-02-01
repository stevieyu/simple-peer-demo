import Peer from './peer'

const peerId = localStorage.getItem('peerId') || '';
const peer = new Peer(peerId)

peer.on('open', (id) => {
    if(!peerId) localStorage.setItem('peerId', id);
    const {hash} = location
    if(hash) {
        if(hash.includes(id)) return;
        const connId = hash.replace('#', '')
        connHandle(peer.connect(connId));
        return;
    }
    history.replaceState('', '', `#${id}`);
});

peer.on('connection', (conn) => {
    console.log('peer connection', conn);

    conn.on('data', (data) => {
        console.log('peer Received', data);
        conn.send('Hello 2!');
    });
});



const connHandle = (conn) => {
    conn.on('open', () => {
        console.log('conn open');
        // Receive messages
        conn.on('data', (data) => {
          console.log('conn Received', data);
        });

        // Send messages
        conn.send('Hello!');
      });
}


