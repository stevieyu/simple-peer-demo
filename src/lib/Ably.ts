/**
 * https://ably.com/accounts/15918/apps/28670
 * @param clientId
 * @param memberCb
 */

export default (clientId:string, memberCb:(type:string, member:any, members:any[])=>void) => {
    const key = '2Jes3g.wC29vQ:glHuRZJSUl4s4i5b';
    const ably = new Ably.Realtime({ key, clientId }   );
    const channel = ably.channels.get('SimplePeer');

    channel.presence.subscribe('enter', (member:any) => {
        // console.log('presence.subscribe.enter', member)
        channel.presence.get((err:any, members:any[]) => {
            if(err) throw err
            if(memberCb) memberCb('enter', member, members)
            // console.log('presence.subscribe.enter.members', members)
        })
    })
    channel.presence.subscribe('leave', (member:any) => {
        // console.log('presence.subscribe.leave', member)
        channel.presence.get((err:any, members:any[]) => {
            if(err) throw err
            if(memberCb) memberCb('leave', member, members)
            // console.log('presence.subscribe.leave.members', members)
        })
    })

    channel.presence.enter()

    return channel
}