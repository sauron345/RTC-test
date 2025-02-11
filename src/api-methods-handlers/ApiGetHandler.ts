import ApiHandler from "./ApiHandler";

export default class ApiGetHandler extends ApiHandler {

    private request: Request

    constructor(endpoint: string) {
        super(endpoint)
        this.request = this.createRequestObj()
    }

    fetch(): object {
        return fetch(this.request)
            .then(res => res.json())
    }

    protected getProperParams(): object {
        return {
            method: 'GET',
            headers: this.headers,
        }
    }

}
