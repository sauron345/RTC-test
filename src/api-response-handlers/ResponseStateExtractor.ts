import {SportDataFormat} from "../formats/SportDataFormat";
import {getInitSportDataFormat} from "../utils";

export default class ResponseStateExtractor {

    private readonly stateData: string[]
    private sportEventsStorage: Set<SportDataFormat> = new Set()
    private sportEventData = getInitSportDataFormat()
    private seperatedSportEventDataStr: string[]

    constructor(encodedText: string) {
        this.stateData = encodedText.split('\n')
    }

    executeAndGetResult(): Set<SportDataFormat> {
        for (const sportEventDataStr of this.stateData) {
            this.seperatedSportEventDataStr = sportEventDataStr.split(',')
            this.assignEventFields(this.seperatedSportEventDataStr)
            this.sportEventsStorage.add(this.sportEventData)
            this.sportEventData = getInitSportDataFormat()
        }
        return this.sportEventsStorage
    }

    private assignEventFields(seperatedSportEventData: string[]) {
        let index = 0
        for (const field of Object.keys(this.sportEventData)) {
            if (field === "scores") {
                this.extractScoreDataFromStr(index)
            } else if (field === "startTime") {
                this.sportEventData.startTime = new Date().toISOString()
                index++
            } else {
                this.sportEventData[field] = seperatedSportEventData[index++]
            }
        }
    }

    private extractScoreDataFromStr(index: number) {
        if (this.seperatedSportEventDataStr[index]) {
            let scoresData = this.seperatedSportEventDataStr[index].split('|')
            for (let scoreData of scoresData) {
                let [scoreType, scores] = scoreData.split('@')
                let [homeScore, awayScore] = scores.split(':')
                this.sportEventData.scores[scoreType] = {
                    type: scoreType, home: homeScore, away: awayScore
                }
            }
        } else {
            this.sportEventData.scores["CURRENT"] = { type: "CURRENT", home: "0", away: "0" }
        }
    }

}
