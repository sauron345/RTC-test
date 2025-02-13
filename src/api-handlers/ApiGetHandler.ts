export default class ApiGetHandler {

    private readonly headers = new Headers()
    private readonly endpoint: string
    private request: Request

    constructor(endpoint: string) {
        this.endpoint = endpoint
        this.headers.set('Content-Type', 'application/json')
        this.headers.set('Accept', 'application/json')
        this.request = this.createRequestObj()
    }

    protected createRequestObj() {
        return new Request(`http://localhost:4000/${this.endpoint}`, this.getProperParams())
    }

    async fetch(): Promise<object> {
        return fetch(this.request)
            .then(res => res.json())
    }

    getProperParams(): object {
        return {
            method: 'POST',
            headers: this.headers,
        }
    }

}
