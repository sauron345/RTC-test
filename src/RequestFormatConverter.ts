import SportDataRequestFormat from "./formats/SportDataRequestFormat";
import {SportDataFormat} from "./formats/SportDataFormat";
import {score, suitableRequestFormat} from "./utils";

export default class RequestFormatConverter {

    private readonly sportEventsDataStorage: Set<SportDataFormat>
    private sportsDataRequestStorage: Set<suitableRequestFormat> = new Set()
    private sportDataRequest = this.getInitSportDataRequestFormat()

    constructor(sportEventsDataStorage: Set<SportDataFormat>) {
        this.sportEventsDataStorage = sportEventsDataStorage
    }

    executeAndGetResult(): Set<suitableRequestFormat> {
        let suitableSportData: suitableRequestFormat
        for (const sportData of this.sportEventsDataStorage) {
            for (const [fieldName, fieldVal] of Object.entries(sportData)) {
                this.addToSportDataRequest(fieldName, fieldVal)
            }
            suitableSportData = { [sportData.id]: this.sportDataRequest }
            this.sportsDataRequestStorage.add(suitableSportData)
        }
        return this.sportsDataRequestStorage
    }

    private addToSportDataRequest(fieldName: string, fieldVal: string | Set<score>) {
        switch (fieldName) {
            case "scores":
                this.handleScores(fieldVal as Set<score>)
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

    private handleScores(fieldVal: Set<score>): void {
        for (const [typeName, typeVal] of Object.entries(fieldVal)) {
            if (typeName in this.sportDataRequest.scores) {
                this.sportDataRequest.scores[typeName].home = typeVal.home
                this.sportDataRequest.scores[typeName].away = typeVal.away
            } else {
                this.sportDataRequest.scores[typeName] = {
                    type: typeVal.type,
                    home: typeVal.home,
                    away: typeVal.away
                }
            }
        }
    }

    private handleHomeCompetitor(fieldVal: string): void {
        this.sportDataRequest.competitors.HOME.name = fieldVal
    }

    private handleAwayCompetitor(fieldVal: string): void {
        this.sportDataRequest.competitors.AWAY.name = fieldVal
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
