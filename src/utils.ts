import {SportDataFormat} from "./formats/SportDataFormat";

export type stateDataFormat = { "odds": string }

export type mappingsDataFormat = { "mappings": string }

export type score = {
    string: { "type": string; "home": string; "away": string }
}

export function getDefaultSportDataFormat(): SportDataFormat {
    return {
        sport: '',
        competition: '',
        startTime: '',
        homeCompetitor: '',
        awayCompetitor: '',
        sportEventStatus: '',
        scores: []
    }
}