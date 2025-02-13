import {DecodedEventDataFormat} from "../formats/DecodedEventDataFormat";
import {score, eventsEncodedStorageFormat, eventsDecodedStorageFormat} from "../utils";

type mappingsDataFormat = { [encodedField: string]: string }

export default class ReceivedStateDecoder {

    private mappingsData: mappingsDataFormat = {}
    private eventsDataDecodedStorage: eventsDecodedStorageFormat = {}
    private eventsEncodedStorage: eventsEncodedStorageFormat
    private sportEventDecoded = this.getInitSportDataFormat()
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
        eventsEncodedStorage: eventsEncodedStorageFormat
    ): eventsDecodedStorageFormat {

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
                } else if (fieldName === "sportEventStatusID") {
                    this.eventsDataDecodedStorage[eventID].sportEventStatus = this.mappingsData[fieldVal]
                }
            }
        }
    }

    private storeSportEventsData() {
        let fieldNameWithoutID: string
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
                    fieldNameWithoutID = fieldName.replace('ID', '')
                    this.sportEventDecoded[fieldNameWithoutID] = this.mappingsData[fieldVal]
                }
            }
            this.eventsDataDecodedStorage[eventID] = this.sportEventDecoded
            this.sportEventDecoded = this.getInitSportDataFormat()
        }
    }

    private decodeProperlyAndStoreScores(sportEventDecoded: DecodedEventDataFormat, fieldVal: score): DecodedEventDataFormat {
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

    private getInitSportDataFormat(): DecodedEventDataFormat {
        return {
            id: '',
            sport: '',
            competition: '',
            startTime: '',
            homeCompetitor: '',
            awayCompetitor: '',
            sportEventStatus: '',
            scores: {}
        }
    }

}
