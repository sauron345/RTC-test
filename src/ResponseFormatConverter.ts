import SportDataResponseFormat from "./formats/SportDataResponseFormat";
import {
    score,
    eventsEncodedStorageFormat,
    eventsDataResponseStorageFormat,
    defaultScore,
    eventsDecodedStorageFormat
} from "./utils";

type SportResponseFieldsFormat = string | Set<score> | "LIVE" | "REMOVED" | "PRE" | Set<score> | defaultScore

export default class ResponseFormatConverter {

    private eventsDataResponseStorage: eventsDataResponseStorageFormat = {}
    private sportEventsDataStorage: eventsDecodedStorageFormat = {}
    private eventDataResponse = this.getInitSportDataResponseFormat()
    private isExecutedOnce = false

    executeAndGetResult(
        sportEventsDataStorage: eventsDecodedStorageFormat
    ): eventsDataResponseStorageFormat {

        this.sportEventsDataStorage = sportEventsDataStorage
        if (this.isExecutedOnce) {
            this.updateDynamicEventsFields()
        } else {
            this.storeSportEventsData()
            this.isExecutedOnce = true
        }
        return this.eventsDataResponseStorage
    }

    private updateDynamicEventsFields(): void {
        for (const [eventID, sportEventData] of Object.entries(this.sportEventsDataStorage)) {
            for (const [fieldName, fieldVal] of Object.entries(sportEventData)) {
                if (fieldName === "scores") {
                    this.eventsDataResponseStorage[eventID].scores =
                        this.handleScores(this.eventsDataResponseStorage[eventID].scores, fieldVal as Set<score>)
                } else if (fieldName === "sportEventStatus") {
                    this.eventsDataResponseStorage[eventID].status = fieldVal
                }
            }
            this.excludeEventIfFinished(eventID)
        }
    }

    private excludeEventIfFinished(eventID: string) {
        if (this.eventsDataResponseStorage[eventID].status === "REMOVED") {
            delete this.eventsDataResponseStorage[eventID]
        }
    }

    private storeSportEventsData() {
        for (const [eventID, eventSportData] of Object.entries(this.sportEventsDataStorage)) {
            for (const [fieldName, fieldVal] of Object.entries(eventSportData)) {
                this.addToSportDataResponse(fieldName, fieldVal)
            }
            this.storeEventDataIfStatusIsNotRemoved(eventID, this.eventDataResponse)
            this.eventDataResponse = this.getInitSportDataResponseFormat()
        }
    }

    private addToSportDataResponse(fieldName: string, fieldVal: SportResponseFieldsFormat) {
        switch (fieldName) {
            case "scores":
                this.eventDataResponse.scores
                    = this.handleScores(this.eventDataResponse.scores , fieldVal as Set<score>)
                break
            case "homeCompetitor":
                this.handleHomeCompetitor(fieldVal as string)
                break
            case "awayCompetitor":
                this.handleAwayCompetitor(fieldVal as string)
                break
            case "sportEventStatus":
                this.eventDataResponse.status = fieldVal as "LIVE" | "REMOVED" | "PRE"
                break
            default:
                this.eventDataResponse[fieldName] = fieldVal
        }
    }

    private storeEventDataIfStatusIsNotRemoved(eventID: string, eventSportData: SportDataResponseFormat) {
        if (eventSportData.status !== "REMOVED") {
            this.eventsDataResponseStorage[eventID] = eventSportData
        }
    }

    private handleScores(
        eventScoresStorage: Set<score> | defaultScore, fieldVal: Set<score>
    ): Set<score> | defaultScore {

        for (const [typeName, typeVal] of Object.entries(fieldVal)) {
            if (typeName in eventScoresStorage) {
                eventScoresStorage[typeName].home = typeVal.home
                eventScoresStorage[typeName].away = typeVal.away
            } else {
                eventScoresStorage[typeName] = {
                    type: typeVal.type,
                    home: typeVal.home,
                    away: typeVal.away
                }
            }
        }
        return eventScoresStorage
    }

    private handleHomeCompetitor(fieldVal: string): void {
        this.eventDataResponse.competitors.HOME.name = fieldVal
    }

    private handleAwayCompetitor(fieldVal: string): void {
        this.eventDataResponse.competitors.AWAY.name = fieldVal
    }

    private getInitSportDataResponseFormat(): SportDataResponseFormat {
        return {
            id: '',
            status: "PRE",
            scores: {
                CURRENT: { type: "CURRENT", home: "0", away: "0" }
            },
            startTime: '',
            sport: '',
            competitors: {
                HOME: { type: "HOME", name: '' },
                AWAY: { type: "AWAY", name: '' },
            },
            competition: ''
        }
    }

}
