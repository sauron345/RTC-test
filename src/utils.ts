import {SportDataFormat} from "./formats/SportDataFormat";
import SportDataRequestFormat from "./formats/SportDataRequestFormat";

export type stateDataFormat = { "odds": string }

export type mappingsDataFormat = { "mappings": string }

export type score = {
    [type: string]: { type: string; home: string; away: string }
}

export type currentScore = {
    CURRENT: {
        type: "CURRENT",
        home: string,
        away: string
    }
}

export type suitableRequestFormat = { [id: string]: SportDataRequestFormat }

export function getInitSportDataFormat(): SportDataFormat {
    return {
        id: '',
        sport: '',
        competition: '',
        startTime: '',
        homeCompetitor: '',
        awayCompetitor: '',
        sportEventStatus: '',
        scores: {}
    }
}
