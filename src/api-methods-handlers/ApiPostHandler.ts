import ApiHandler from "./ApiHandler";
import SportDataRequestFormat from "../formats/SportDataRequestFormat";
import {suitableRequestFormat} from "../utils";

export default class ApiPostHandler extends ApiHandler {

    private requestFormatStorage: Set<suitableRequestFormat>

    constructor(endpoint: string) {
        super(endpoint)
    }

    pass(requestFormatStorage: Set<suitableRequestFormat>) {
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
