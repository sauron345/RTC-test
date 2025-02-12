import SportDataRequestFormat from "./formats/SportDataRequestFormat";
import {score, sportEventsStorageFormat, eventsDataRequestStorageFormat, currentScore} from "./utils";

type SportRequestFieldsFormat = string | Set<score> | "LIVE" | "REMOVED" | "PRE" | Set<score> | currentScore

export default class RequestFormatConverter {

    private eventsDataRequestStorage: eventsDataRequestStorageFormat = {}
    private sportEventsDataStorage: sportEventsStorageFormat = {}
    private eventDataRequest = this.getInitSportDataRequestFormat()
    private isExecutedOnce = false

    executeAndGetResult(
        sportEventsDataStorage: sportEventsStorageFormat
    ): eventsDataRequestStorageFormat {

        this.sportEventsDataStorage = sportEventsDataStorage
        if (this.isExecutedOnce) {
            this.updateDynamicEventsFields()
        } else {
            this.storeSportEventsData()
            this.isExecutedOnce = true
        }
        return this.eventsDataRequestStorage
    }

    private updateDynamicEventsFields(): void {
        for (const [eventID, sportEventData] of Object.entries(this.sportEventsDataStorage)) {
            for (const [fieldName, fieldVal] of Object.entries(sportEventData)) {
                if (fieldName === "scores") {
                    this.eventsDataRequestStorage[eventID].scores =
                        this.handleScores(this.eventsDataRequestStorage[eventID].scores, fieldVal as Set<score>)
                } else if (fieldName === "sportEventStatus") {
                    this.eventsDataRequestStorage[eventID].status = fieldVal
                }
            }
            if (this.eventsDataRequestStorage[eventID].status === "REMOVED") {
                delete this.eventsDataRequestStorage[eventID]
            }
        }
    }

    private storeSportEventsData() {
        for (const [eventID, eventSportData] of Object.entries(this.sportEventsDataStorage)) {
            for (const [fieldName, fieldVal] of Object.entries(eventSportData)) {
                this.addToSportDataRequest(fieldName, fieldVal)
            }
            this.storeEventDataIfStatusIsNotRemoved(eventID, this.eventDataRequest)
            this.eventDataRequest = this.getInitSportDataRequestFormat()
        }
    }

    private addToSportDataRequest(fieldName: string, fieldVal: SportRequestFieldsFormat) {
        switch (fieldName) {
            case "scores":
                this.eventDataRequest.scores
                    = this.handleScores(this.eventDataRequest.scores , fieldVal as Set<score>)
                break
            case "homeCompetitor":
                this.handleHomeCompetitor(fieldVal as string)
                break
            case "awayCompetitor":
                this.handleAwayCompetitor(fieldVal as string)
                break
            case "sportEventStatus":
                this.eventDataRequest.status = fieldVal as "LIVE" | "REMOVED" | "PRE"
                break
            default:
                this.eventDataRequest[fieldName] = fieldVal
        }
    }

    private storeEventDataIfStatusIsNotRemoved(eventID: string, eventSportData: SportDataRequestFormat) {
        if (eventSportData.status !== "REMOVED") {
            this.eventsDataRequestStorage[eventID] = eventSportData
        } else if (eventID in this.eventsDataRequestStorage) {
            delete this.eventsDataRequestStorage[eventID]
        }
    }

    private handleScores(
        eventScoresStorage: Set<score> | currentScore, fieldVal: Set<score>
    ): Set<score> | currentScore {

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
        this.eventDataRequest.competitors.HOME.name = fieldVal
    }

    private handleAwayCompetitor(fieldVal: string): void {
        this.eventDataRequest.competitors.AWAY.name = fieldVal
    }

    private getInitSportDataRequestFormat(): SportDataRequestFormat {
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
