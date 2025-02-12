import {SportDataFormat} from "../formats/SportDataFormat";
import {getInitSportDataFormat, score, sportEventsStorageFormat} from "../utils";

type mappingsDataFormat = { [encodedField: string]: string }

export default class ReceivedStateDecoder {

    private mappingsData: mappingsDataFormat = {}
    private eventsDataDecodedStorage: sportEventsStorageFormat = {}
    private eventsEncodedStorage: sportEventsStorageFormat
    private sportEventDecoded = getInitSportDataFormat()
    private isExecutedOnce = false

    constructor(mappingsDataStr: string) {
        this.extractAndStoreDataFrom(mappingsDataStr)
    }

    private extractAndStoreDataFrom(mappingsDataStr: string): void {
        for (let fieldData of mappingsDataStr.split(";")) {
            let [fieldName, fieldVal] = fieldData.split(":")
            this.mappingsData[fieldName] = fieldVal
        }
    }

    executeAndGetResultFrom(
        eventsEncodedStorage: sportEventsStorageFormat
    ): sportEventsStorageFormat {

        this.eventsEncodedStorage = eventsEncodedStorage
        if (this.isExecutedOnce) {
            this.updateDynamicEventsFields()
        } else {
            this.storeSportEventsData()
            this.isExecutedOnce = true
        }
        return this.eventsDataDecodedStorage
    }

    private updateDynamicEventsFields(): void {
        for (const [eventID, sportEventData] of Object.entries(this.eventsEncodedStorage)) {
            for (const [fieldName, fieldVal] of Object.entries(sportEventData)) {
                if (fieldName === "scores") {
                    this.eventsDataDecodedStorage[eventID] =
                        this.decodeProperlyAndStoreScores(this.eventsDataDecodedStorage[eventID], fieldVal as score)
                } else if (fieldName === "sportEventStatus") {
                    this.eventsDataDecodedStorage[eventID][fieldName] = this.mappingsData[fieldVal]
                }
            }
        }
    }

    private storeSportEventsData() {
        for (const [eventID, sportEventData] of Object.entries(this.eventsEncodedStorage)) {
            for (const [fieldName, fieldVal] of Object.entries(sportEventData)) {
                if (fieldName === "scores") {
                    this.sportEventDecoded =
                        this.decodeProperlyAndStoreScores(this.sportEventDecoded, fieldVal as score)
                } else if (fieldName === "startTime") {
                    this.sportEventDecoded[fieldName] = fieldVal
                } else if (fieldName === "id") {
                    this.sportEventDecoded[fieldName] = fieldVal
                } else {
                    this.sportEventDecoded[fieldName] = this.mappingsData[fieldVal]
                }
            }
            this.eventsDataDecodedStorage[eventID] = this.sportEventDecoded
            this.sportEventDecoded = getInitSportDataFormat()
        }
    }

    private decodeProperlyAndStoreScores(sportEventDecoded: SportDataFormat,fieldVal: score): SportDataFormat {
        for (const [typeScore, scoreData] of Object.entries(fieldVal)) {
            if (typeScore !== "CURRENT") {
                let decodedTypeScore = this.mappingsData[typeScore]
                sportEventDecoded.scores[decodedTypeScore] = {
                    type: this.mappingsData[scoreData.type],
                    home: scoreData.home,
                    away: scoreData.away
                }
            } else {
                sportEventDecoded.scores["CURRENT"] = {
                    type: scoreData.type,
                    home: scoreData.home,
                    away: scoreData.away
                }
            }
        }
        return sportEventDecoded
    }

}
