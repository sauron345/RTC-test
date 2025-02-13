import EventDataResponseFormat from "./formats/EventDataResponseFormat.ts";
import {EncodedEventDataFormat} from "./formats/EncodedEventDataFormat.ts";
import {DecodedEventDataFormat} from "./formats/DecodedEventDataFormat.ts";

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

export type eventsResponseStorageFormat = { [id: string]: EventDataResponseFormat }

export type eventsEncodedStorageFormat = { [id: string]: EncodedEventDataFormat }

export type eventsDecodedStorageFormat = { [id: string]: DecodedEventDataFormat }
