import {defaultScore, score} from "../utils";


export interface EncodedEventDataFormat {
    id: string

    sportID: string

    competitionID: string

    sportEventStatusID: string

    startTime: string

    homeCompetitorID: string

    awayCompetitorID: string

    scores: Set<score> | {}
}
