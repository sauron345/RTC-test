import {score} from "../utils.ts";

type ISO8601DateString = string

export interface DecodedEventDataFormat {
    id: string

    sport: string

    competition: string

    sportEventStatus: string

    startTime: ISO8601DateString

    homeCompetitor: string

    awayCompetitor: string

    scores: Set<score> | {}
}
