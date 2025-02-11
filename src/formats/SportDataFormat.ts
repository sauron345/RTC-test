import {score} from "../utils";

export interface SportDataFormat {
    id: string

    sport: string

    competition: string

    sportEventStatus: string

    startTime: string

    homeCompetitor: string

    awayCompetitor: string

    scores: Set<score> | {}
}
