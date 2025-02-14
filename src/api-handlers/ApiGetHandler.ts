import {env} from "../../env.js";

export default class ApiGetHandler {

    private readonly headers = new Headers()
    private readonly url: string
    private request: Request

    constructor(endpoint: string) {
        this.url = `http://localhost:${env.RTC_SIMULATION_API_PORT}${endpoint}`
        this.headers.set('Content-Type', 'application/json')
        this.headers.set('Accept', 'application/json')
        this.request = this.createRequestObj()
    }

    protected createRequestObj() {
        return new Request(this.url, this.getProperParams())
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
