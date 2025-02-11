import {SportDataFormat} from "./formats/SportDataFormat";
import {getDefaultSportDataFormat} from "./utils";

export default class ResponseStateDecoder {

    private readonly sportEventsEncodedStorage: Set<SportDataFormat>
    private mappingsData: object
    private sportEventsDecodedStorage: Set<SportDataFormat>
    private sportEventsDecoded = getDefaultSportDataFormat()

    constructor(
        sportEventsEncodedStorage: Set<SportDataFormat>,
        mappingsData: string
    ) {
        this.sportEventsEncodedStorage = sportEventsEncodedStorage
        this.extractDataFrom(mappingsData)
    }

    private extractDataFrom(mappingsData: string): void {
        for (let fieldData of mappingsData.split(";")) {
            let [fieldName, fieldVal] = fieldData.split(":")
            this.mappingsData[fieldName] = fieldVal
        }
    }

    executeAndGetResult(): Set<SportDataFormat> {
        for (const sportEventData of Object.entries(this.sportEventsEncodedStorage)) {
            for (const [fieldName, fieldVal] of sportEventData) {
                if (fieldName in Object.keys(this.mappingsData)) {
                    this.sportEventsDecoded[fieldName] = this.mappingsData[fieldVal]
                }
            }
            this.sportEventsDecodedStorage.add(this.sportEventsDecoded)
        }
        return this.sportEventsDecodedStorage
    }

}
