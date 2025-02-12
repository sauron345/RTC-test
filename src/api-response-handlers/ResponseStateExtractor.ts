import {SportDataFormat} from "../formats/SportDataFormat";
import {getInitSportDataFormat, sportEventsStorageFormat} from "../utils";

export default class ResponseStateExtractor {

    private sportEventsStorage: sportEventsStorageFormat = {}
    private sportEventData = getInitSportDataFormat()
    private newEventsStateData: string[]
    private seperatedEventsData: string[]
    private isExecutedOnce = false
    private currentEventID: string

    executeAndGetResult(encodedText: string): sportEventsStorageFormat {
        this.newEventsStateData = encodedText.split('\n')
        if (this.isExecutedOnce) {
            this.updateSportEventsData()
        } else {
            this.storeSportEventsData()
            this.isExecutedOnce = true
        }
        return this.sportEventsStorage
    }

    private updateSportEventsData() {
        for (const sportEventDataStr of this.newEventsStateData) {
            this.seperatedEventsData = sportEventDataStr.split(',')
            this.updateDynamicEventFields()
        }
    }

    private updateDynamicEventFields(): void {
        let index = 0
        for (const field of Object.keys(this.sportEventData)) {
            if (field === "id") {
                this.currentEventID = this.seperatedEventsData[index++]
                this.sportEventsStorage[this.currentEventID][field] = this.currentEventID
            } else if (field === "scores") {
                this.sportEventsStorage[this.currentEventID] =
                    this.extractScoreDataFrom(this.sportEventsStorage[this.currentEventID], index)
            } else if (field === "status") {
                this.sportEventsStorage[this.currentEventID][field] = this.seperatedEventsData[index++]
            } else {
                index++
            }
        }
    }

    private storeSportEventsData() {
        for (const sportEventDataStr of this.newEventsStateData) {
            this.seperatedEventsData = sportEventDataStr.split(',')
            this.assignEventFields()
            this.sportEventsStorage[this.currentEventID] = this.sportEventData
            this.sportEventData = getInitSportDataFormat()
        }
    }

    private assignEventFields() {
        let index = 0
        for (const field of Object.keys(this.sportEventData)) {
            if (field === "scores") {
                this.sportEventData = this.extractScoreDataFrom(this.sportEventData, index)
            } else if (field === "startTime") {
                this.sportEventData.startTime = new Date().toISOString()
                index++
            } else if (field === "id") {
                this.currentEventID = this.seperatedEventsData[index++]
                this.sportEventData[field] = this.currentEventID
            } else {
                this.sportEventData[field] = this.seperatedEventsData[index++]
            }
        }
    }

    private extractScoreDataFrom(sportEventData: SportDataFormat, index: number): SportDataFormat {
        if (this.seperatedEventsData[index]) {
            let scoresData = this.seperatedEventsData[index].split('|')
            for (let scoreData of scoresData) {
                let [scoreType, scores] = scoreData.split('@')
                let [homeScore, awayScore] = scores.split(':')
                sportEventData.scores[scoreType] = {
                    type: scoreType, home: homeScore, away: awayScore
                }
            }
        } else {
            sportEventData.scores["CURRENT"] = { type: "CURRENT", home: "0", away: "0" }
        }
        return sportEventData
    }

}
