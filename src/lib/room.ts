
export default interface Room{
    send(to:string, data: object, type: string): Promise<any>

    receive(cb:Function): void

    members(): Promise<any>
}