import {DecodedEventDataFormat} from "./formats/DecodedEventDataFormat";
import EventDataResponseFormat from "./formats/EventDataResponseFormat";
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

export type eventsDataResponseStorageFormat = { [id: string]: EventDataResponseFormat }

export type eventsEncodedStorageFormat = { [id: string]: EncodedEventDataFormat }

export type eventsDecodedStorageFormat = { [id: string]: DecodedEventDataFormat }
