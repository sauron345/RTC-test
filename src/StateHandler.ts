import ResponseStateExtractor from "./ResponseStateExtractor";

class StateHandler {

    private headers = new Headers()
    private readonly endpoint = '/api/state'
    private request: RequestInfo

    constructor() {
        this.headers.set('Content-Type', 'application/json')
        this.headers.set('Accept', 'application/json')
        this.request = new Request(this.endpoint, {
            method: 'GET',
            headers: this.headers
        })
    }

    fetch(): object {
        return fetch(this.request)
            .then(res => res.json())
    }

}
