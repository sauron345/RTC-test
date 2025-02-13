import {eventsResponseStorageFormat} from "../utils.ts";
import fetch from 'node-fetch';

export default class ResponseSender {

    private requestFormatStorage: eventsResponseStorageFormat
    protected readonly endpoint: string

    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

     async pass(requestFormatStorage: eventsResponseStorageFormat): Promise<void> {
         this.requestFormatStorage = requestFormatStorage
         await fetch(`http://localhost:4000/${this.endpoint}`, this.getProperParams());
     }

    private getProperParams(): object {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(this.requestFormatStorage),
            timeout: 20000 // 20 seconds
        }
    }

}
