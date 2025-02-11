import {SportDataFormat} from "../formats/SportDataFormat";
import {getInitSportDataFormat, score} from "../utils";

type mappingsDataFormat = { [encodedField: string]: string }

export default class ResponseStateDecoder {

    private readonly eventsDataEncodedStorage: Set<SportDataFormat>
    private mappingsData: mappingsDataFormat = {}
    private eventsDataDecodedStorage: Set<SportDataFormat> = new Set()
    private sportEventDecoded = getInitSportDataFormat()

    constructor(
        sportEventsEncodedStorage: Set<SportDataFormat>,
        mappingsDataStr: string
    ) {
        this.eventsDataEncodedStorage = sportEventsEncodedStorage
        this.extractAndStoreDataFrom(mappingsDataStr)
    }

    private extractAndStoreDataFrom(mappingsDataStr: string): void {
        for (let fieldData of mappingsDataStr.split(";")) {
            let [fieldName, fieldVal] = fieldData.split(":")
            this.mappingsData[fieldName] = fieldVal
        }
    }

    executeAndGetResult(): Set<SportDataFormat> {
        for (const sportEventData of this.eventsDataEncodedStorage) {
            for (const [fieldName, fieldVal] of Object.entries(sportEventData)) {
                if (fieldName === "scores") {
                    this.decodeProperlyAndStoreScores(fieldVal as score)
                } else if (fieldName === "id" || fieldName === "startTime") {
                    this.sportEventDecoded[fieldName] = fieldVal
                } else {
                    this.sportEventDecoded[fieldName] = this.mappingsData[fieldVal]
                }
            }
            this.eventsDataDecodedStorage.add(this.sportEventDecoded)
            this.sportEventDecoded = getInitSportDataFormat()
        }
        return this.eventsDataDecodedStorage
    }

    private decodeProperlyAndStoreScores(fieldVal: score): void {
        for (const [typeScore, scoreData] of Object.entries(fieldVal)) {
            if (typeScore !== "CURRENT") {
                let decodedTypeScore = this.mappingsData[typeScore]
                this.sportEventDecoded.scores[decodedTypeScore] = {
                    type: this.mappingsData[scoreData.type],
                    home: scoreData.home,
                    away: scoreData.away
                }
            } else {
                this.sportEventDecoded.scores["CURRENT"] = {
                    type: scoreData.type,
                    home: scoreData.home,
                    away: scoreData.away
                }
            }
        }
    }

}
