import ApiHandler from "./ApiHandler";
import SportDataRequestFormat from "../formats/SportDataRequestFormat";

export default class ApiPostHandler extends ApiHandler {

    private requestFormatStorage: Set<SportDataRequestFormat>

    constructor(endpoint: string) {
        super(endpoint)
    }

    response(requestFormatStorage: Set<SportDataRequestFormat>) {
        this.requestFormatStorage = requestFormatStorage
        this.createRequestObj()
    }

    protected getProperParams(): object {
        return {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(this.requestFormatStorage)
        }
    }

}
