import {SportDataFormat} from "./formats/SportDataFormat";
import SportDataResponseFormat from "./formats/SportDataResponseFormat";

export type stateDataFormat = { odds: string }

export type mappingsDataFormat = { mappings: string }

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

export type eventsDataResponseStorageFormat = { [id: string]: SportDataResponseFormat }

export type sportEventsStorageFormat = { [id: string]: SportDataFormat }

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
