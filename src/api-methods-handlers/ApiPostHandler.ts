import ApiHandler from "./ApiHandler";
import SportDataResponseFormat from "../formats/SportDataResponseFormat";
import {eventsDataResponseStorageFormat} from "../utils";

export default class ApiPostHandler extends ApiHandler {

    private requestFormatStorage: eventsDataResponseStorageFormat

    constructor(endpoint: string) {
        super(endpoint)
    }

    pass(requestFormatStorage: eventsDataResponseStorageFormat) {
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
