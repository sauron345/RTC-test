import {mappingsDataFormat, eventsEncodedStorageFormat, stateDataFormat, eventsDecodedStorageFormat} from "./utils.ts";
import ReceivedStateExtractor from "./api-state-handlers/ReceivedStateExtractor.ts";
import ReceivedStateDecoder from "./api-state-handlers/ReceivedStateDecoder.ts";
import ResponseFormatConverter from "./ResponseFormatConverter.ts";
import ApiGetHandler from "./api-handlers/ApiGetHandler.ts";
import ResponseSender from "./api-handlers/ResponseSender.ts";

export default class RTCLauncher {

    private readonly stateHandler = new ApiGetHandler('api/state')
    private readonly mappingsHandler = new ApiGetHandler('api/mappings')
    private readonly responseSender = new ResponseSender('client/state')
    private readonly cycleDuration: number = 5 * 60 * 1000; // 5 minutes in milliseconds
    private readonly stateInterval: number = 1000; // 1 second interval for getting new state
    private receivedStateExtractor: ReceivedStateExtractor
    private receivedStateDecoder: ReceivedStateDecoder
    private responseFormatConverter: ResponseFormatConverter

    execute(): void {
        this.scheduleNewCycle();
        this.scheduleUpdateEvents();
    }

    private scheduleNewCycle(): void {
        this.prepareForNewCycle().then(() => {
            setInterval(() => this.prepareForNewCycle(), this.cycleDuration)
        })
    }

    private async prepareForNewCycle(): Promise<void> {
        await this.updateMappingsEventsData()
        this.receivedStateExtractor = new ReceivedStateExtractor()
        this.responseFormatConverter = new ResponseFormatConverter()
    }

    private async updateMappingsEventsData(): Promise<void> {
        let mappingsDataObj = await this.mappingsHandler.fetch() as mappingsDataFormat
        this.receivedStateDecoder = new ReceivedStateDecoder(mappingsDataObj.mappings)
    }

    private scheduleUpdateEvents(): void {
        this.updateSportEvents().then(() => {
        setInterval(() => this.updateSportEvents(), this.stateInterval)})
    }

    private async updateSportEvents(): Promise<void> {
        let encodedEventsDataStorage = await this.getEncodedEventsData()
        let decodedEventsDataStorage = this.getDecodedEventsData(encodedEventsDataStorage)
        this.passEventsDataInResponseFormat(decodedEventsDataStorage)
    }

    private async getEncodedEventsData(): Promise<eventsEncodedStorageFormat> {
        let stateDataObj = await this.stateHandler.fetch() as stateDataFormat
        return this.receivedStateExtractor.executeAndGetResult(stateDataObj.odds)
    }

    private getDecodedEventsData(encodedEventsDataStorage: eventsEncodedStorageFormat): eventsDecodedStorageFormat {
        return this.receivedStateDecoder.executeAndGetResultFrom(encodedEventsDataStorage)
    }

    private passEventsDataInResponseFormat(sportsDecodedStorage: eventsDecodedStorageFormat): void {
        let responseFormatStorage =
            this.responseFormatConverter.executeAndGetResult(sportsDecodedStorage)
        this.responseSender.pass(responseFormatStorage)
    }

}

let rtcLauncher = new RTCLauncher()
rtcLauncher.execute()
