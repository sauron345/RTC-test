import ApiHandler from "./ApiHandler";
import SportDataRequestFormat from "../formats/SportDataRequestFormat";
import {eventsDataRequestStorageFormat} from "../utils";

export default class ApiPostHandler extends ApiHandler {

    private requestFormatStorage: eventsDataRequestStorageFormat

    constructor(endpoint: string) {
        super(endpoint)
    }

    pass(requestFormatStorage: eventsDataRequestStorageFormat) {
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
