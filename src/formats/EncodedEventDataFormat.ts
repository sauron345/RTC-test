import {score} from "../utils.ts";

type UUIDv4 = string
type timeInMilliseconds = string

export interface EncodedEventDataFormat {
    id: UUIDv4

    sportID: UUIDv4

    competitionID: UUIDv4

    sportEventStatusID: UUIDv4

    startTime: timeInMilliseconds

    homeCompetitorID: UUIDv4

    awayCompetitorID: UUIDv4

    scores: Set<score> | {}
}
