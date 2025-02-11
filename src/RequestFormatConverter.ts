import SportDataRequestFormat from "./formats/SportDataRequestFormat";
import {SportDataFormat} from "./formats/SportDataFormat";

export default class RequestFormatConverter {

    private readonly sportEventsDataStorage: Set<SportDataFormat>
    private sportsDataRequestStorage: Set<SportDataRequestFormat>
    private sportDataRequest = this.getDefaultSportDataRequestFormat()

    constructor(sportEventsDataStorage: Set<SportDataFormat>) {
        this.sportEventsDataStorage = sportEventsDataStorage
    }

    executeAndGetResult(): Set<SportDataRequestFormat> {
        for (const sportData of Object.entries(this.sportEventsDataStorage)) {
            for (const [fieldName, fieldVal] of Object.entries(sportData)) {3
                this.addToSportDataRequest(fieldName, fieldVal)
            }
            this.sportsDataRequestStorage.add(this.sportDataRequest)
        }
        return this.sportsDataRequestStorage
    }

    private addToSportDataRequest(fieldName: string, fieldVal: string | string[]) {
        switch (fieldName) {
            case "sportEventStatus":
                this.handleStatus()
                break
            case "scores":
                this.handleScores(fieldVal as string[])
                break
            case "homeCompetitor":
                this.handleHomeCompetitor(fieldVal as string)
                break
            case "awayCompetitor":
                this.handleAwayCompetitor(fieldVal as string)
                break
            default:
                this.sportDataRequest[fieldName] = fieldVal
        }
    }

    private handleStatus(): void {
        this.sportDataRequest.status = "LIVE"
    }

    private handleScores(fieldVal: string[]): void {
        this.sportDataRequest.scores["CURRENT"].home = fieldVal[0]
        this.sportDataRequest.scores["CURRENT"].away = fieldVal[1]
    }

    private handleHomeCompetitor(fieldVal: string): void {
        this.sportDataRequest.competitors.HOME.name = fieldVal
    }

    private handleAwayCompetitor(fieldVal: string): void {
        this.sportDataRequest.competitors.AWAY.name = fieldVal
    }

    private getDefaultSportDataRequestFormat(): SportDataRequestFormat {
        return {
            id: '',
            status: "PRE",
            scores: {},
            startTime: '',
            sport: '',
            competitors: {
                "HOME": { "type": "HOME", "name": '' },
                "AWAY": { "type": "AWAY", "name": '' },
            },
            competition: ''
        }
    }

}
