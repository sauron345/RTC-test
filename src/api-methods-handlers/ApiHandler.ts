export default abstract class ApiHandler {

    protected readonly headers = new Headers()
    protected readonly endpoint: string

    protected constructor(endpoint: string) {
        this.endpoint = endpoint
        this.headers.set('Content-Type', 'application/json')
        this.headers.set('Accept', 'application/json')
    }

    protected createRequestObj() {
        return new Request(this.endpoint, this.getProperParams())
    }

    protected abstract getProperParams(): object

}
