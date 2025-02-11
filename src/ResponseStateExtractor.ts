import {SportDataFormat} from "./formats/SportDataFormat";
import {getDefaultSportDataFormat} from "./utils";

export default class ResponseStateExtractor {

    private readonly stateData: string[]
    private sportEventsStorage: Set<SportDataFormat>
    private sportEventData = getDefaultSportDataFormat()

    constructor(encodedText: string) {
        this.stateData = encodedText.split('\n')
    }

    executeAndGetResult(): Set<SportDataFormat> {
        let seperatedSportEventData: string[]
        for (const sportEventDataStr of this.stateData) {
            seperatedSportEventData = sportEventDataStr.split(',')
            this.assignEventFields(seperatedSportEventData)
            this.sportEventsStorage.add(this.sportEventData)
        }
        return this.sportEventsStorage
    }

    private assignEventFields(seperatedSportEventData: string[]) {
        let index = 1
        for (const field of Object.keys(this.sportEventData)) {
            if (field == "scores") {
                this.sportEventData[field] = seperatedSportEventData[index++].split('|')
            } else {
                this.sportEventData[field] = seperatedSportEventData[index++]
            }
        }
    }

}
