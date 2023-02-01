export default async () => {
    let visitorId = localStorage.getItem('fingerprint')
    if(!visitorId) {
        await import('https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.umd.min.js');
        const {FingerprintJS} = globalThis

        visitorId = (await(await FingerprintJS.load()).get()).visitorId

        localStorage.setItem('fingerprint', visitorId)
    }
    return visitorId
}