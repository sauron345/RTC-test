import {eventsResponseStorageFormat} from "../utils.ts";
import fetch from 'node-fetch';
import {env} from "../../env.js";

export default class ResponseSender {

    private requestFormatStorage: eventsResponseStorageFormat
    protected readonly url: string

    constructor(endpoint: string) {
        this.url = `http://localhost:${env.RTC_SIMULATION_API_PORT}${endpoint}`
    }

     async pass(requestFormatStorage: eventsResponseStorageFormat): Promise<void> {
         this.requestFormatStorage = requestFormatStorage
         await fetch(this.url, this.getProperParams());
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
