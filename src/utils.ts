import {DecodedEventDataFormat} from "./formats/DecodedEventDataFormat";
import SportDataResponseFormat from "./formats/SportDataResponseFormat";
import {EncodedEventDataFormat} from "./formats/EncodedEventDataFormat";

export type stateDataFormat = { odds: string }

export type mappingsDataFormat = { mappings: string }

export type score = {
    [type: string]: { type: string; home: string; away: string }
}

export type defaultScore = {
    CURRENT: {
        type: "CURRENT",
        home: string,
        away: string
    }
}

export type eventsDataResponseStorageFormat = { [id: string]: SportDataResponseFormat }

export type eventsEncodedStorageFormat = { [id: string]: EncodedEventDataFormat }

export type eventsDecodedStorageFormat = { [id: string]: DecodedEventDataFormat }
